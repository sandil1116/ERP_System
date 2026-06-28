package com.minierp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class EmployeeLoanRequest {
    @NotBlank
    private String employeeId;

    @NotBlank
    private String type; // LOAN or ADVANCE

    @Positive
    private double principal;

    /** Required for LOAN. Ignored for ADVANCE (installment = full principal, paid back next payroll). */
    private double installmentAmount;

    /** WEEKLY or MONTHLY - required for LOAN, ignored for ADVANCE. */
    private String frequency;
}
