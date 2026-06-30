package com.minierp.service;

import com.minierp.dto.PayrollEntryResponse;
import com.minierp.dto.PayrollPreviewResponse;
import com.minierp.model.Employee;
import com.minierp.model.EmployeeLoan;
import com.minierp.model.PayrollEntry;
import com.minierp.model.PayrollRun;
import com.minierp.repository.PayrollRunRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * This is the piece the original spec specifically called out: "if an
 * employee takes a loan, the system must automatically deduct a fixed
 * agreed amount from their salary weekly or monthly until full settlement."
 *
 * calculateEntries() is shared by the preview (GET) and the actual run
 * (POST), so what the Admin sees before confirming is guaranteed to match
 * exactly what gets paid.
 */
@Service
@RequiredArgsConstructor
public class PayrollService {

    private final EmployeeService employeeService;
    private final EmployeeLoanService employeeLoanService;
    private final PayrollRunRepository payrollRunRepository;
    private final LedgerService ledgerService;

    public PayrollPreviewResponse preview() {
        List<PayrollEntry> entries = calculateEntries();
        double total = entries.stream().mapToDouble(PayrollEntry::getNetPay).sum();
        return new PayrollPreviewResponse(entries.stream().map(PayrollEntryResponse::fromEntity).toList(), total);
    }

    /**
     * Runs payroll for every active employee: computes each employee's due
     * loan/advance installment (capped so pay never goes negative), pays
     * the net amount, and reduces the loan balance by exactly what was
     * deducted - marking it COMPLETED once it reaches zero.
     */
    public PayrollRun run(String processedByName) {
        List<PayrollEntry> entries = calculateEntries();

        for (PayrollEntry entry : entries) {
            if (entry.getDeduction() > 0) {
                for (EmployeeLoan loan : employeeLoanService.listActiveForEmployee(entry.getEmployeeId())) {
                    double due = Math.min(loan.getInstallmentAmount(), loan.getBalanceRemaining());
                    if (due > 0) {
                        employeeLoanService.applyDeduction(loan, due);
                    }
                }
            }
            ledgerService.record("SALARY_PAYMENT", entry.getEmployeeId(), "OUT", entry.getNetPay(),
                    "Salary paid to " + entry.getEmployeeName()
                            + (entry.getDeduction() > 0 ? " (after LKR " + String.format("%.2f", entry.getDeduction()) + " loan deduction)" : ""));
        }

        double total = entries.stream().mapToDouble(PayrollEntry::getNetPay).sum();
        PayrollRun run = PayrollRun.builder()
                .entries(entries)
                .totalPaid(total)
                .processedAt(Instant.now())
                .processedByName(processedByName)
                .build();
        return payrollRunRepository.save(run);
    }

    public List<PayrollRun> history() {
        return payrollRunRepository.findAllByOrderByProcessedAtDesc();
    }

    private List<PayrollEntry> calculateEntries() {
        List<PayrollEntry> entries = new ArrayList<>();
        for (Employee employee : employeeService.listActive()) {
            double dueDeduction = employeeLoanService.listActiveForEmployee(employee.getId()).stream()
                    .mapToDouble(loan -> Math.min(loan.getInstallmentAmount(), loan.getBalanceRemaining()))
                    .sum();

            // Never let a deduction push net pay below zero.
            double deduction = Math.min(dueDeduction, employee.getBaseSalary());
            double netPay = employee.getBaseSalary() - deduction;

            entries.add(PayrollEntry.builder()
                    .employeeId(employee.getId())
                    .employeeName(employee.getName())
                    .baseSalary(employee.getBaseSalary())
                    .deduction(deduction)
                    .netPay(netPay)
                    .build());
        }
        return entries;
    }
}
