package com.minierp.controller;

import com.minierp.dto.UpdateThemeRequest;
import com.minierp.dto.UserResponse;
import com.minierp.model.User;
import com.minierp.repository.UserRepository;
import com.minierp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/** Endpoints for the logged-in user's own profile - any authenticated role can call these. */
@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class MeController {

    private final UserRepository userRepository;
    private final UserService userService;

    @GetMapping
    public UserResponse me(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return UserResponse.fromEntity(user);
    }

    @PutMapping("/theme")
    public UserResponse updateTheme(Authentication authentication, @Valid @RequestBody UpdateThemeRequest request) {
        User updated = userService.updateOwnTheme(authentication.getName(), request.getTheme());
        return UserResponse.fromEntity(updated);
    }
}
