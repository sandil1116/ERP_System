package com.minierp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.Instant;

@Data
public class ExpenseRequest {
    @NotBlank
    private String category;

    @Positive
    private double amount;

    private String note;

    /** Defaults to now if not provided. */
    private Instant date;
}
