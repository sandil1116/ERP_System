package com.minierp.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.List;

@Data
public class SaleRequest {
    /** Null = walk-in cash customer (no record kept). */
    private String customerId;

    @NotEmpty
    @Valid
    private List<SaleItemRequest> items;

    @Pattern(regexp = "CASH|CREDIT")
    private String paymentType;
}
