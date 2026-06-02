package com.minierp.controller;

import com.minierp.dto.ProductRequest;
import com.minierp.dto.ProductResponse;
import com.minierp.model.Product;
import com.minierp.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** Admin + Staff can edit stock/products, Cashier is view-only (see role matrix in design doc). */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','CASHIER','STAFF')")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<ProductResponse> list() {
        return productService.listAll().stream().map(ProductResponse::fromEntity).toList();
    }

    @GetMapping("/low-stock")
    public List<ProductResponse> lowStock() {
        return productService.listAll().stream()
                .filter(p -> p.getQuantity() <= p.getReorderLevel())
                .map(ProductResponse::fromEntity)
                .toList();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ProductResponse create(@Valid @RequestBody ProductRequest request) {
        return ProductResponse.fromEntity(productService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ProductResponse update(@PathVariable String id, @Valid @RequestBody ProductRequest request) {
        return ProductResponse.fromEntity(productService.update(id, request));
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ProductResponse adjustStock(@PathVariable String id, @RequestBody Map<String, Object> body) {
        int quantity = ((Number) body.get("quantity")).intValue();
        String reason = (String) body.getOrDefault("reason", "");
        Product updated = productService.adjustStock(id, quantity, reason);
        return ProductResponse.fromEntity(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable String id) {
        productService.softDelete(id);
    }
}
