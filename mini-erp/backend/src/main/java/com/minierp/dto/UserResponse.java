package com.minierp.dto;

import com.minierp.model.Role;
import com.minierp.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private Role role;
    private boolean active;
    private String theme;

    public static UserResponse fromEntity(User u) {
        return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.isActive(), u.getTheme());
    }
}
