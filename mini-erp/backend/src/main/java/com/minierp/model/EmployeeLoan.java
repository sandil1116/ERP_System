package com.minierp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Covers both "Loans" (agreed installment over weeks/months) and "Advances"
 * (deducted in full on the next payroll run) - same underlying mechanic,
 * just different frequency, per the design doc's "Salary & Advance Tracking"
 * + "Automated Loan Deductions" sections.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "employee_loans")
public class EmployeeLoan {
    @Id
    private String id;

    private String employeeId;
    private String employeeName;

    /** LOAN or ADVANCE */
    private String type;

    private double principal;

    /** How much to deduct each payroll run. For ADVANCE this equals the full principal (paid back in one go). */
    private double installmentAmount;

    /** WEEKLY, MONTHLY, or ONE_TIME (advances) */
    private String frequency;

    private double balanceRemaining;

    /** ACTIVE or COMPLETED */
    @Builder.Default
    private String status = "ACTIVE";

    private Instant createdAt;
    private Instant updatedAt;
}
