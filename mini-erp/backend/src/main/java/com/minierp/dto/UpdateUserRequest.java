package com.minierp.dto;

import com.minierp.model.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateUserRequest {
    @NotBlank
    private String name;

    private Role role;

    private boolean active;

    /** Optional - only set the password if the admin wants to reset it. */
    private String password;
}
