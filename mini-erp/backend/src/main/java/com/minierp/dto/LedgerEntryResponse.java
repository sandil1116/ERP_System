package com.minierp.dto;

import com.minierp.model.LedgerEntry;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class LedgerEntryResponse {
    private String id;
    private String type;
    private String refId;
    private String direction;
    private double amount;
    private String note;
    private Instant createdAt;
    /** Running balance after this entry - only populated on the Cash Flow endpoint, null on the raw Ledger endpoint. */
    private Double runningBalance;

    public static LedgerEntryResponse fromEntity(LedgerEntry e) {
        return new LedgerEntryResponse(e.getId(), e.getType(), e.getRefId(), e.getDirection(), e.getAmount(), e.getNote(), e.getCreatedAt(), null);
    }
}
