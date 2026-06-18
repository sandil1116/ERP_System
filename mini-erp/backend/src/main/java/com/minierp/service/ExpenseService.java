package com.minierp.service;

import com.minierp.dto.ExpenseRequest;
import com.minierp.exception.ApiException;
import com.minierp.model.Expense;
import com.minierp.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final LedgerService ledgerService;

    public List<Expense> listAll() {
        return expenseRepository.findByIsDeletedFalseOrderByDateDesc();
    }

    public Expense create(ExpenseRequest req) {
        Instant date = req.getDate() != null ? req.getDate() : Instant.now();
        Expense expense = Expense.builder()
                .category(req.getCategory())
                .amount(req.getAmount())
                .note(req.getNote())
                .date(date)
                .isDeleted(false)
                .createdAt(Instant.now())
                .build();
        expense = expenseRepository.save(expense);

        // Every expense is cash leaving the business - write it straight to the ledger,
        // same as sales/purchases, so Cash Flow/P&L stay accurate automatically.
        ledgerService.record("EXPENSE", expense.getId(), "OUT", expense.getAmount(), "Expense: " + expense.getCategory());

        return expense;
    }

    public void softDelete(String id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ApiException("Expense not found", HttpStatus.NOT_FOUND));
        expense.setDeleted(true);
        expenseRepository.save(expense);
        // Note: the original ledger entry for this expense is intentionally left in place -
        // it's a historical record of money that did leave the account at the time.
    }
}
