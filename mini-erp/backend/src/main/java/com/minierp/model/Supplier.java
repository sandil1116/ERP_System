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
@Document(collection = "suppliers")
public class Supplier {
    @Id
    private String id;

    private String name;
    private String contact;

    /** How much we currently owe this supplier from credit purchases. */
    @Builder.Default
    private double payableBalance = 0.0;

    @Builder.Default
    private boolean isDeleted = false;

    private Instant createdAt;
    private Instant updatedAt;
}
