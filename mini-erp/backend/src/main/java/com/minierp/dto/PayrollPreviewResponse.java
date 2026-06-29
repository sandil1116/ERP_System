package com.minierp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PayrollPreviewResponse {
    private List<PayrollEntryResponse> entries;
    private double totalPay;
}
