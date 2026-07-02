package com.minierp.controller;

import com.minierp.dto.EmployeeLoanRequest;
import com.minierp.dto.EmployeeLoanResponse;
import com.minierp.service.EmployeeLoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee-loans")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class EmployeeLoanController {

    private final EmployeeLoanService employeeLoanService;

    @GetMapping
    public List<EmployeeLoanResponse> listForEmployee(@RequestParam String employeeId) {
        return employeeLoanService.listForEmployee(employeeId).stream().map(EmployeeLoanResponse::fromEntity).toList();
    }

    @PostMapping
    public EmployeeLoanResponse create(@Valid @RequestBody EmployeeLoanRequest request) {
        return EmployeeLoanResponse.fromEntity(employeeLoanService.create(request));
    }
}
