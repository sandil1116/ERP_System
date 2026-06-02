package com.minierp.controller;

import com.minierp.dto.CustomerRequest;
import com.minierp.dto.CustomerResponse;
import com.minierp.dto.PaymentRequest;
import com.minierp.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Admin + Cashier can view/add customers. Only Admin edits/deactivates (see role matrix). */
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','CASHIER')")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public List<CustomerResponse> list() {
        return customerService.listAll().stream().map(CustomerResponse::fromEntity).toList();
    }

    @PostMapping
    public CustomerResponse create(@Valid @RequestBody CustomerRequest request) {
        return CustomerResponse.fromEntity(customerService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public CustomerResponse update(@PathVariable String id, @Valid @RequestBody CustomerRequest request) {
        return CustomerResponse.fromEntity(customerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable String id) {
        customerService.softDelete(id);
    }

    @PostMapping("/{id}/payments")
    public CustomerResponse recordPayment(@PathVariable String id, @Valid @RequestBody PaymentRequest request) {
        return CustomerResponse.fromEntity(customerService.recordPayment(id, request.getAmount()));
    }
}
