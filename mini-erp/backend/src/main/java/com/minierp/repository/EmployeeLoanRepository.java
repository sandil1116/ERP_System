package com.minierp.repository;

import com.minierp.model.EmployeeLoan;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EmployeeLoanRepository extends MongoRepository<EmployeeLoan, String> {
    List<EmployeeLoan> findByEmployeeIdOrderByCreatedAtDesc(String employeeId);
    List<EmployeeLoan> findByEmployeeIdAndStatus(String employeeId, String status);
    List<EmployeeLoan> findByStatus(String status);
}
