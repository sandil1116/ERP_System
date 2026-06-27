package com.minierp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.Instant;

@Data
public class EmployeeRequest {
    @NotBlank
    private String name;
    private String jobTitle;
    private String contact;
    private Instant joinDate;

    @Min(0)
    private double baseSalary;

    private boolean active = true;
}
