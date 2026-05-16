package com.minierp.controller;

import com.minierp.dto.RegisterRequest;
import com.minierp.dto.UpdateUserRequest;
import com.minierp.dto.UserResponse;
import com.minierp.model.User;
import com.minierp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only user management: this is the reference implementation of the
 * "list page + edit/add/deactivate everywhere" pattern used across every
 * other module in the system (Customers, Products, Employees, etc.).
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserResponse> listUsers() {
        return userService.listAll().stream().map(UserResponse::fromEntity).toList();
    }

    @PostMapping
    public UserResponse createUser(@Valid @RequestBody RegisterRequest request) {
        User created = userService.create(request);
        return UserResponse.fromEntity(created);
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable String id, @Valid @RequestBody UpdateUserRequest request) {
        User updated = userService.update(id, request);
        return UserResponse.fromEntity(updated);
    }

    @DeleteMapping("/{id}")
    public UserResponse deactivateUser(@PathVariable String id) {
        User deactivated = userService.deactivate(id);
        return UserResponse.fromEntity(deactivated);
    }
}
