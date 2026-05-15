package com.minierp.service;

import com.minierp.dto.AuthResponse;
import com.minierp.dto.LoginRequest;
import com.minierp.dto.RegisterRequest;
import com.minierp.dto.UserResponse;
import com.minierp.exception.ApiException;
import com.minierp.model.Role;
import com.minierp.model.User;
import com.minierp.repository.UserRepository;
import com.minierp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    /**
     * Bootstrap registration - only works while the users collection is empty.
     * The very first account created this way is always ADMIN, no matter what
     * role was requested, so the system always has an owner account.
     * After that, new users must be created by an existing ADMIN via
     * POST /api/users (see UserController).
     */
    public AuthResponse bootstrapRegister(RegisterRequest req) {
        if (userRepository.count() > 0) {
            throw new ApiException(
                    "Setup already complete. Ask an existing Admin to create your account from Settings > Users.",
                    HttpStatus.FORBIDDEN);
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail().toLowerCase())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(Role.ADMIN)
                .active(true)
                .theme("light")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        userRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail().toLowerCase(), req.getPassword())
        );

        User user = userRepository.findByEmail(req.getEmail().toLowerCase())
                .orElseThrow(() -> new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        return buildAuthResponse(user);
    }

    public boolean needsBootstrap() {
        return userRepository.count() == 0;
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthResponse(token, UserResponse.fromEntity(user));
    }
}
