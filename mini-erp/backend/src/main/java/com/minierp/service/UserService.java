package com.minierp.service;

import com.minierp.dto.RegisterRequest;
import com.minierp.dto.UpdateUserRequest;
import com.minierp.exception.ApiException;
import com.minierp.model.Role;
import com.minierp.model.User;
import com.minierp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> listAll() {
        return userRepository.findAll();
    }

    public User getById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }

    /** Admin creates a new staff/cashier/admin account. */
    public User create(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail().toLowerCase())) {
            throw new ApiException("A user with this email already exists", HttpStatus.CONFLICT);
        }
        if (req.getRole() == null) {
            throw new ApiException("Role is required", HttpStatus.BAD_REQUEST);
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail().toLowerCase())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole())
                .active(true)
                .theme("light")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return userRepository.save(user);
    }

    /** Admin edits name/role/active status, optionally resets password. */
    public User update(String id, UpdateUserRequest req) {
        User user = getById(id);

        user.setName(req.getName());
        if (req.getRole() != null) {
            user.setRole(req.getRole());
        }
        user.setActive(req.isActive());

        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        }

        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }

    /** Soft delete - deactivate rather than remove, so history/audit stays intact. */
    public User deactivate(String id) {
        User user = getById(id);
        user.setActive(false);
        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }

    public User updateOwnTheme(String email, String theme) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        user.setTheme(theme);
        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }
}
