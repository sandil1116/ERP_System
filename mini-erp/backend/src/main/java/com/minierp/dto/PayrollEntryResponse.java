package com.minierp.dto;

import com.minierp.model.PayrollEntry;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PayrollEntryResponse {
    private String employeeId;
    private String employeeName;
    private double baseSalary;
    private double deduction;
    private double netPay;

    public static PayrollEntryResponse fromEntity(PayrollEntry e) {
        return new PayrollEntryResponse(e.getEmployeeId(), e.getEmployeeName(), e.getBaseSalary(), e.getDeduction(), e.getNetPay());
    }
}
