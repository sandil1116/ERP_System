package com.minierp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/** Operating costs not tied to a purchase - rent, utilities, transport, etc. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "expenses")
public class Expense {
    @Id
    private String id;

    private String category;
    private double amount;
    private String note;
    private Instant date;

    @Builder.Default
    private boolean isDeleted = false;

    private Instant createdAt;
}
