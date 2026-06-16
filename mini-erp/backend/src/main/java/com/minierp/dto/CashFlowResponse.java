package com.minierp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CashFlowResponse {
    private double openingBalance;
    private double closingBalance;
    private List<LedgerEntryResponse> entries;
}
