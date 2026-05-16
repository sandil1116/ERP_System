package com.minierp.controller;

import com.minierp.dto.AuthResponse;
import com.minierp.dto.LoginRequest;
import com.minierp.dto.RegisterRequest;
import com.minierp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    /**
     * Only works once, when the database has zero users - creates the first
     * Admin account. Every user after that must be created by an Admin from
     * Settings > Users.
     */
    @PostMapping("/bootstrap")
    public AuthResponse bootstrap(@Valid @RequestBody RegisterRequest request) {
        return authService.bootstrapRegister(request);
    }

    @GetMapping("/needs-bootstrap")
    public Map<String, Boolean> needsBootstrap() {
        return Map.of("needsBootstrap", authService.needsBootstrap());
    }
}
