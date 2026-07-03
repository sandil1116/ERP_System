package com.minierp.service;

import com.minierp.model.LedgerEntry;
import com.minierp.repository.LedgerEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

/**
 * Writes to the central ledger collection. This is intentionally the ONLY
 * place that creates LedgerEntry records, so Phase 3 (Cash Flow, P&L,
 * Account Balances) can trust every money movement is captured exactly once,
 * here, at the moment it happens.
 */
@Service
@RequiredArgsConstructor
public class LedgerService {

    private final LedgerEntryRepository ledgerEntryRepository;

    public void record(String type, String refId, String direction, double amount, String note) {
        LedgerEntry entry = LedgerEntry.builder()
                .type(type)
                .refId(refId)
                .direction(direction)
                .amount(amount)
                .note(note)
                .createdAt(Instant.now())
                .build();
        ledgerEntryRepository.save(entry);
    }
}
