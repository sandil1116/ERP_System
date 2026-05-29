package com.minierp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SupplierRequest {
    @NotBlank
    private String name;
    private String contact;
}
