package com.minierp.controller;

import com.minierp.dto.PayrollPreviewResponse;
import com.minierp.dto.PayrollRunResponse;
import com.minierp.model.User;
import com.minierp.repository.UserRepository;
import com.minierp.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class PayrollController {

    private final PayrollService payrollService;
    private final UserRepository userRepository;

    /** Preview what a payroll run would pay right now, without actually paying anyone. */
    @GetMapping("/preview")
    public PayrollPreviewResponse preview() {
        return payrollService.preview();
    }

    @PostMapping("/run")
    public PayrollRunResponse run(Authentication authentication) {
        User admin = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return PayrollRunResponse.fromEntity(payrollService.run(admin.getName()));
    }

    @GetMapping("/history")
    public List<PayrollRunResponse> history() {
        return payrollService.history().stream().map(PayrollRunResponse::fromEntity).toList();
    }
}
