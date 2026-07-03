package com.minierp.dto;

import jakarta.validation.constraints.Positive;
import lombok.Data;

/** Used for both "Record Payment" (customer credit) and "Mark as Paid" (supplier payable). */
@Data
public class PaymentRequest {
    @Positive
    private double amount;
    private String note;
}
