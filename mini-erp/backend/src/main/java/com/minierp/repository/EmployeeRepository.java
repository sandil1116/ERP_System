package com.minierp.repository;

import com.minierp.model.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EmployeeRepository extends MongoRepository<Employee, String> {
    List<Employee> findByIsDeletedFalse();
    List<Employee> findByIsDeletedFalseAndActiveTrue();
}
