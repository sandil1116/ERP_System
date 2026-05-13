package com.minierp.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateThemeRequest {
    @Pattern(regexp = "light|dark", message = "theme must be 'light' or 'dark'")
    private String theme;
}
