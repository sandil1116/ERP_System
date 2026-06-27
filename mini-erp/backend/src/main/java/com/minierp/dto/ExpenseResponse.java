package com.minierp.dto;

import com.minierp.model.Expense;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class ExpenseResponse {
    private String id;
    private String category;
    private double amount;
    private String note;
    private Instant date;

    public static ExpenseResponse fromEntity(Expense e) {
        return new ExpenseResponse(e.getId(), e.getCategory(), e.getAmount(), e.getNote(), e.getDate());
    }
}
