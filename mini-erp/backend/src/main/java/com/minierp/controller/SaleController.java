package com.minierp.controller;

import com.minierp.dto.SaleRequest;
import com.minierp.dto.SaleResponse;
import com.minierp.model.User;
import com.minierp.repository.UserRepository;
import com.minierp.service.SaleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Admin + Cashier can create/view sales (see role matrix). */
@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','CASHIER')")
public class SaleController {

    private final SaleService saleService;
    private final UserRepository userRepository;

    @GetMapping
    public List<SaleResponse> list() {
        return saleService.listAll().stream().map(SaleResponse::fromEntity).toList();
    }

    @GetMapping("/{id}")
    public SaleResponse getOne(@PathVariable String id) {
        return SaleResponse.fromEntity(saleService.getById(id));
    }

    @PostMapping
    public SaleResponse create(@Valid @RequestBody SaleRequest request, Authentication authentication) {
        User staff = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return SaleResponse.fromEntity(saleService.createSale(request, staff.getId(), staff.getName()));
    }
}
