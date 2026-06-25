package com.minierp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollEntry {
    private String employeeId;
    private String employeeName;
    private double baseSalary;
    private double deduction;
    private double netPay;
}
