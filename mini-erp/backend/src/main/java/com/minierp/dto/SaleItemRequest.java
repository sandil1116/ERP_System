package com.minierp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class SaleItemRequest {
    @NotBlank
    private String productId;

    @Positive
    private int quantity;
}
