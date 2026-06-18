package com.minierp.service;

import com.minierp.dto.CashFlowResponse;
import com.minierp.dto.FinancialSummaryResponse;
import com.minierp.dto.LedgerEntryResponse;
import com.minierp.model.LedgerEntry;
import com.minierp.model.Sale;
import com.minierp.repository.ExpenseRepository;
import com.minierp.repository.LedgerEntryRepository;
import com.minierp.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * Reads from the ledger collection that Sales/Purchases/Expenses write to.
 * This is the piece that proves Phase 3 is really "just a view" on top of
 * Phase 2's data - nothing here writes anything, it only aggregates.
 */
@Service
@RequiredArgsConstructor
public class FinancialsService {

    private final LedgerEntryRepository ledgerEntryRepository;
    private final SaleRepository saleRepository;
    private final ExpenseRepository expenseRepository;

    /** Cash Flow: only entries that actually moved cash (IN/OUT), with a running balance. */
    public CashFlowResponse getCashFlow(Instant from, Instant to) {
        double openingBalance = ledgerEntryRepository.findByCreatedAtBefore(from).stream()
                .mapToDouble(this::signedAmount)
                .sum();

        List<LedgerEntry> windowEntries = ledgerEntryRepository.findByCreatedAtBetweenOrderByCreatedAtAsc(from, to);

        double running = openingBalance;
        List<LedgerEntryResponse> responses = new java.util.ArrayList<>();
        for (LedgerEntry entry : windowEntries) {
            if ("NONE".equals(entry.getDirection())) continue; // credit entries don't move cash yet
            running += signedAmount(entry);
            LedgerEntryResponse dto = LedgerEntryResponse.fromEntity(entry);
            dto.setRunningBalance(running);
            responses.add(dto);
        }

        return new CashFlowResponse(openingBalance, running, responses);
    }

    /** Raw ledger - every entry including non-cash-moving credit entries, newest first. */
    public List<LedgerEntryResponse> getLedger(Instant from, Instant to) {
        return ledgerEntryRepository.findByCreatedAtBetweenOrderByCreatedAtAsc(from, to).stream()
                .map(LedgerEntryResponse::fromEntity)
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }

    /** The current, all-time Cash balance - shown on the Account Balances page. */
    public double getCurrentCashBalance() {
        return ledgerEntryRepository.findAllByOrderByCreatedAtDesc().stream()
                .mapToDouble(this::signedAmount)
                .sum();
    }

    public FinancialSummaryResponse getSummary(Instant from, Instant to) {
        List<Sale> sales = saleRepository.findByIsDeletedFalseOrderByCreatedAtDesc().stream()
                .filter(s -> !s.getCreatedAt().isBefore(from) && s.getCreatedAt().isBefore(to))
                .toList();

        double revenue = sales.stream().mapToDouble(Sale::getTotal).sum();
        double cogs = sales.stream()
                .flatMap(s -> s.getItems().stream())
                .mapToDouble(item -> item.getUnitCost() * item.getQuantity())
                .sum();

        double expenses = expenseRepository.findByIsDeletedFalseAndDateBetween(from, to).stream()
                .mapToDouble(e -> e.getAmount())
                .sum();

        List<LedgerEntry> windowEntries = ledgerEntryRepository.findByCreatedAtBetweenOrderByCreatedAtAsc(from, to);

        // Salary payments are a labor cost - include them in expenses for P&L.
        // (Loan/advance disbursements are NOT an expense - they're a receivable,
        // cash out but not a cost - so they're deliberately excluded here even
        // though they do appear in Cash Flow below.)
        double payroll = windowEntries.stream()
                .filter(e -> "SALARY_PAYMENT".equals(e.getType()))
                .mapToDouble(LedgerEntry::getAmount)
                .sum();
        expenses += payroll;

        double cashIn = windowEntries.stream().filter(e -> "IN".equals(e.getDirection())).mapToDouble(LedgerEntry::getAmount).sum();
        double cashOut = windowEntries.stream().filter(e -> "OUT".equals(e.getDirection())).mapToDouble(LedgerEntry::getAmount).sum();

        double netProfit = revenue - cogs - expenses;

        return new FinancialSummaryResponse(revenue, cogs, expenses, netProfit, cashIn, cashOut, cashIn - cashOut);
    }

    private double signedAmount(LedgerEntry entry) {
        if ("IN".equals(entry.getDirection())) return entry.getAmount();
        if ("OUT".equals(entry.getDirection())) return -entry.getAmount();
        return 0; // NONE - credit entries don't move cash
    }
}
