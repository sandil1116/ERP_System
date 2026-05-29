package com.minierp.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.List;

@Data
public class PurchaseRequest {
    @NotBlank
    private String supplierId;

    @NotEmpty
    @Valid
    private List<PurchaseItemRequest> items;

    @Pattern(regexp = "CASH|CREDIT")
    private String paymentType;
}
