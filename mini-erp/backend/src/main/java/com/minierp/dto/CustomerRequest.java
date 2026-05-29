package com.minierp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerRequest {
    @NotBlank
    private String name;
    private String contact;
    private String type; // CASH, CREDIT, RECURRING
}
