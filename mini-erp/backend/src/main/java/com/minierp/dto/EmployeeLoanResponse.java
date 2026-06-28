package com.minierp.dto;

import com.minierp.model.EmployeeLoan;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class EmployeeLoanResponse {
    private String id;
    private String employeeId;
    private String employeeName;
    private String type;
    private double principal;
    private double installmentAmount;
    private String frequency;
    private double balanceRemaining;
    private String status;
    private Instant createdAt;

    public static EmployeeLoanResponse fromEntity(EmployeeLoan l) {
        return new EmployeeLoanResponse(l.getId(), l.getEmployeeId(), l.getEmployeeName(), l.getType(),
                l.getPrincipal(), l.getInstallmentAmount(), l.getFrequency(), l.getBalanceRemaining(),
                l.getStatus(), l.getCreatedAt());
    }
}
