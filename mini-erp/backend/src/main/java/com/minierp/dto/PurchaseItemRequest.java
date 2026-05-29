package com.minierp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PurchaseItemRequest {
    @NotBlank
    private String productId;

    @Positive
    private int quantity;

    /** Cost price for this purchase - allows cost to vary purchase to purchase. */
    @Min(0)
    private double unitCost;
}
