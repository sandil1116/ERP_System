package com.minierp.controller;

import com.minierp.dto.CashFlowResponse;
import com.minierp.dto.FinancialSummaryResponse;
import com.minierp.dto.LedgerEntryResponse;
import com.minierp.service.FinancialsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

/** All Financials endpoints are Admin-only (see role matrix in the design doc). */
@RestController
@RequestMapping("/api/financials")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class FinancialsController {

    private final FinancialsService financialsService;

    @GetMapping("/summary")
    public FinancialSummaryResponse summary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to) {
        return financialsService.getSummary(from, to);
    }

    @GetMapping("/cash-flow")
    public CashFlowResponse cashFlow(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to) {
        return financialsService.getCashFlow(from, to);
    }

    @GetMapping("/ledger")
    public List<LedgerEntryResponse> ledger(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to) {
        return financialsService.getLedger(from, to);
    }
}
