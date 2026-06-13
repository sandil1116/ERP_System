package com.minierp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * A manually-tracked balance (e.g. a bank account). Separate from the
 * automated "Cash" figure, which is always computed live from the ledger
 * (see FinancialsService.getCashBalance()) rather than stored here.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "accounts")
public class Account {
    @Id
    private String id;

    private String name;
    private double balance;

    @Builder.Default
    private boolean isDeleted = false;

    private Instant createdAt;
    private Instant updatedAt;
}
