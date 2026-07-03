package com.minierp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Central money-movement log - the single source of truth the Phase 3
 * Financials module (Cash Flow, P&L, Account Balances) will read from.
 * Every sale and purchase writes one of these; nothing recalculates or
 * duplicates the number elsewhere.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ledger")
public class LedgerEntry {
    @Id
    private String id;

    /** SALE_CASH, SALE_CREDIT, PURCHASE_CASH, PURCHASE_CREDIT, RECEIVABLE_PAYMENT, PAYABLE_PAYMENT */
    private String type;

    private String refId;   // sale/purchase/payment id this entry came from

    /** Which account this movement affects. Single default account for now: "CASH". */
    @Builder.Default
    private String account = "CASH";

    /** IN = cash coming into the business, OUT = cash leaving, NONE = no cash movement yet (credit) */
    private String direction;

    private double amount;
    private String note;

    private Instant createdAt;
}
