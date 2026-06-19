package com.minierp.controller;

import com.minierp.dto.ExpenseRequest;
import com.minierp.dto.ExpenseResponse;
import com.minierp.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping
    public List<ExpenseResponse> list() {
        return expenseService.listAll().stream().map(ExpenseResponse::fromEntity).toList();
    }

    @PostMapping
    public ExpenseResponse create(@Valid @RequestBody ExpenseRequest request) {
        return ExpenseResponse.fromEntity(expenseService.create(request));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        expenseService.softDelete(id);
    }
}
