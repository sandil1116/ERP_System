package com.minierp.repository;

import com.minierp.model.Supplier;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SupplierRepository extends MongoRepository<Supplier, String> {
    List<Supplier> findByIsDeletedFalse();
}
