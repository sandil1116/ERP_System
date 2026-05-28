package com.minierp.repository;

import com.minierp.model.Sale;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface SaleRepository extends MongoRepository<Sale, String> {
    List<Sale> findByIsDeletedFalseOrderByCreatedAtDesc();
    List<Sale> findByIsDeletedFalseAndCreatedAtBetween(Instant start, Instant end);
}
