package com.minierp.controller;

import com.minierp.dto.PaymentRequest;
import com.minierp.dto.SupplierRequest;
import com.minierp.dto.SupplierResponse;
import com.minierp.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Admin edits suppliers, Staff can view only (see role matrix). */
@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','STAFF')")
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public List<SupplierResponse> list() {
        return supplierService.listAll().stream().map(SupplierResponse::fromEntity).toList();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public SupplierResponse create(@Valid @RequestBody SupplierRequest request) {
        return SupplierResponse.fromEntity(supplierService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SupplierResponse update(@PathVariable String id, @Valid @RequestBody SupplierRequest request) {
        return SupplierResponse.fromEntity(supplierService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable String id) {
        supplierService.softDelete(id);
    }

    @PostMapping("/{id}/payments")
    @PreAuthorize("hasRole('ADMIN')")
    public SupplierResponse recordPayment(@PathVariable String id, @Valid @RequestBody PaymentRequest request) {
        return SupplierResponse.fromEntity(supplierService.recordPayment(id, request.getAmount()));
    }
}
