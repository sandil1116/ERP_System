package com.minierp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProductRequest {
    @NotBlank
    private String name;
    private String category;
    private String unit;

    @Min(0)
    private double costPrice;

    @Min(0)
    private double salePrice;

    @Min(0)
    private int quantity;

    @Min(0)
    private int reorderLevel;
}
