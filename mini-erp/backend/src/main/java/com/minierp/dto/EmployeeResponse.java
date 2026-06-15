package com.minierp.dto;

import com.minierp.model.Employee;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class EmployeeResponse {
    private String id;
    private String name;
    private String jobTitle;
    private String contact;
    private Instant joinDate;
    private double baseSalary;
    private boolean active;

    public static EmployeeResponse fromEntity(Employee e) {
        return new EmployeeResponse(e.getId(), e.getName(), e.getJobTitle(), e.getContact(), e.getJoinDate(), e.getBaseSalary(), e.isActive());
    }
}
