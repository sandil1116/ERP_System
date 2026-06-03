package com.minierp.controller;

import com.minierp.dto.PurchaseRequest;
import com.minierp.dto.PurchaseResponse;
import com.minierp.model.User;
import com.minierp.repository.UserRepository;
import com.minierp.service.PurchaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Admin creates purchases, Staff can view only (see role matrix). */
@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','STAFF')")
public class PurchaseController {

    private final PurchaseService purchaseService;
    private final UserRepository userRepository;

    @GetMapping
    public List<PurchaseResponse> list() {
        return purchaseService.listAll().stream().map(PurchaseResponse::fromEntity).toList();
    }

    @GetMapping("/{id}")
    public PurchaseResponse getOne(@PathVariable String id) {
        return PurchaseResponse.fromEntity(purchaseService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PurchaseResponse create(@Valid @RequestBody PurchaseRequest request, Authentication authentication) {
        User staff = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return PurchaseResponse.fromEntity(purchaseService.createPurchase(request, staff.getId(), staff.getName()));
    }
}
