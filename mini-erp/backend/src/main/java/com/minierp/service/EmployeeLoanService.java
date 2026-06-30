package com.minierp.service;

import com.minierp.dto.EmployeeLoanRequest;
import com.minierp.exception.ApiException;
import com.minierp.model.Employee;
import com.minierp.model.EmployeeLoan;
import com.minierp.repository.EmployeeLoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeLoanService {

    private final EmployeeLoanRepository employeeLoanRepository;
    private final EmployeeService employeeService;
    private final LedgerService ledgerService;

    public List<EmployeeLoan> listForEmployee(String employeeId) {
        return employeeLoanRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId);
    }

    /**
     * Give a loan or advance. The cash leaves the business right now (ledger
     * entry written immediately) - repayment then happens gradually via
     * payroll deductions, which don't create new cash movements since
     * that money was already counted as paid out here.
     */
    public EmployeeLoan create(EmployeeLoanRequest req) {
        Employee employee = employeeService.getById(req.getEmployeeId());

        if (!List.of("LOAN", "ADVANCE").contains(req.getType())) {
            throw new ApiException("type must be LOAN or ADVANCE", HttpStatus.BAD_REQUEST);
        }

        double installment;
        String frequency;
        if ("ADVANCE".equals(req.getType())) {
            installment = req.getPrincipal(); // full amount deducted on the very next payroll run
            frequency = "ONE_TIME";
        } else {
            if (req.getInstallmentAmount() <= 0) {
                throw new ApiException("installmentAmount is required for a loan", HttpStatus.BAD_REQUEST);
            }
            if (!List.of("WEEKLY", "MONTHLY").contains(req.getFrequency())) {
                throw new ApiException("frequency must be WEEKLY or MONTHLY for a loan", HttpStatus.BAD_REQUEST);
            }
            installment = req.getInstallmentAmount();
            frequency = req.getFrequency();
        }

        EmployeeLoan loan = EmployeeLoan.builder()
                .employeeId(employee.getId())
                .employeeName(employee.getName())
                .type(req.getType())
                .principal(req.getPrincipal())
                .installmentAmount(installment)
                .frequency(frequency)
                .balanceRemaining(req.getPrincipal())
                .status("ACTIVE")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        loan = employeeLoanRepository.save(loan);

        String ledgerType = "ADVANCE".equals(req.getType()) ? "ADVANCE_GIVEN" : "LOAN_GIVEN";
        ledgerService.record(ledgerType, loan.getId(), "OUT", req.getPrincipal(),
                ("ADVANCE".equals(req.getType()) ? "Advance to " : "Loan to ") + employee.getName());

        return loan;
    }

    /** Used internally by PayrollService when applying a deduction. */
    public EmployeeLoan applyDeduction(EmployeeLoan loan, double amount) {
        loan.setBalanceRemaining(Math.max(0, loan.getBalanceRemaining() - amount));
        if (loan.getBalanceRemaining() <= 0.01) {
            loan.setStatus("COMPLETED");
        }
        loan.setUpdatedAt(Instant.now());
        return employeeLoanRepository.save(loan);
    }

    public List<EmployeeLoan> listActiveForEmployee(String employeeId) {
        return employeeLoanRepository.findByEmployeeIdAndStatus(employeeId, "ACTIVE");
    }
}
