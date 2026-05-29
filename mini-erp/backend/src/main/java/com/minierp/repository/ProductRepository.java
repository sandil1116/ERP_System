package com.minierp.repository;

import com.minierp.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByIsDeletedFalse();
}
