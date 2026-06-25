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
@Document(collection = "employees")
public class Employee {
    @Id
    private String id;

    private String name;
    private String jobTitle;   // e.g. "Sales Assistant" - distinct from the system login Role
    private String contact;
    private Instant joinDate;
    private double baseSalary;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private boolean isDeleted = false;

    private Instant createdAt;
    private Instant updatedAt;
}
