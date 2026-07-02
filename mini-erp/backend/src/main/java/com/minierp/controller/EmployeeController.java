package com.minierp.controller;

import com.minierp.dto.EmployeeRequest;
import com.minierp.dto.EmployeeResponse;
import com.minierp.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Employees & Payroll is Admin-only (see role matrix in the design doc). */
@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public List<EmployeeResponse> list() {
        return employeeService.listAll().stream().map(EmployeeResponse::fromEntity).toList();
    }

    @PostMapping
    public EmployeeResponse create(@Valid @RequestBody EmployeeRequest request) {
        return EmployeeResponse.fromEntity(employeeService.create(request));
    }

    @PutMapping("/{id}")
    public EmployeeResponse update(@PathVariable String id, @Valid @RequestBody EmployeeRequest request) {
        return EmployeeResponse.fromEntity(employeeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        employeeService.softDelete(id);
    }
}
