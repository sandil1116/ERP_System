package com.minierp.service;

import com.minierp.dto.EmployeeRequest;
import com.minierp.exception.ApiException;
import com.minierp.model.Employee;
import com.minierp.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public List<Employee> listAll() {
        return employeeRepository.findByIsDeletedFalse();
    }

    public List<Employee> listActive() {
        return employeeRepository.findByIsDeletedFalseAndActiveTrue();
    }

    public Employee getById(String id) {
        Employee e = employeeRepository.findById(id)
                .orElseThrow(() -> new ApiException("Employee not found", HttpStatus.NOT_FOUND));
        if (e.isDeleted()) throw new ApiException("Employee not found", HttpStatus.NOT_FOUND);
        return e;
    }

    public Employee create(EmployeeRequest req) {
        Employee employee = Employee.builder()
                .name(req.getName())
                .jobTitle(req.getJobTitle())
                .contact(req.getContact())
                .joinDate(req.getJoinDate() != null ? req.getJoinDate() : Instant.now())
                .baseSalary(req.getBaseSalary())
                .active(true)
                .isDeleted(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        return employeeRepository.save(employee);
    }

    public Employee update(String id, EmployeeRequest req) {
        Employee e = getById(id);
        e.setName(req.getName());
        e.setJobTitle(req.getJobTitle());
        e.setContact(req.getContact());
        if (req.getJoinDate() != null) e.setJoinDate(req.getJoinDate());
        e.setBaseSalary(req.getBaseSalary());
        e.setActive(req.isActive());
        e.setUpdatedAt(Instant.now());
        return employeeRepository.save(e);
    }

    public void softDelete(String id) {
        Employee e = getById(id);
        e.setDeleted(true);
        e.setUpdatedAt(Instant.now());
        employeeRepository.save(e);
    }
}
