package com.minierp.repository;

import com.minierp.model.Purchase;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PurchaseRepository extends MongoRepository<Purchase, String> {
    List<Purchase> findByIsDeletedFalseOrderByCreatedAtDesc();
}
