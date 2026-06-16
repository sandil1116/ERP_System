package com.minierp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FinancialSummaryResponse {
    private double revenue;
    private double cogs;
    private double expenses;
    private double netProfit;
    private double cashIn;
    private double cashOut;
    private double netCash;
}
