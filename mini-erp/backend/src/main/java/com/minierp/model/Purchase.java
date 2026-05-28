package com.minierp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "purchases")
public class Purchase {
    @Id
    private String id;

    private String supplierId;
    private String supplierName;

    private String staffId;
    private String staffName;

    private List<PurchaseItem> items;
    private double total;

    /** CASH or CREDIT */
    private String paymentType;

    @Builder.Default
    private boolean isDeleted = false;

    private Instant createdAt;
}
