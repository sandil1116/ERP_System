package com.minierp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "customers")
public class Customer {
    @Id
    private String id;

    private String name;
    private String contact;

    /** CASH, CREDIT, or RECURRING. Recurring is auto-flagged later but can be set manually now. */
    @Builder.Default
    private String type = "CASH";

    /** How much this customer currently owes us from credit sales. Kept in sync by SaleService/payments. */
    @Builder.Default
    private double creditBalance = 0.0;

    @Builder.Default
    private boolean isDeleted = false;

    private Instant createdAt;
    private Instant updatedAt;
}
