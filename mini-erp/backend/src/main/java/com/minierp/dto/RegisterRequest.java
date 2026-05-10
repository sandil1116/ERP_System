package com.minierp.dto;

import com.minierp.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Used two ways:
 *  - Bootstrap: first-ever user in an empty database, always created as ADMIN
 *    regardless of what role is passed (see AuthService).
 *  - Admin-created users: POST /api/users (requires ADMIN role), any role allowed.
 */
@Data
public class RegisterRequest {
    @NotBlank
    private String name;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private Role role; // ignored on bootstrap; required when an admin creates a user
}
