package com.minierp.repository;

import com.minierp.model.PayrollRun;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PayrollRunRepository extends MongoRepository<PayrollRun, String> {
    List<PayrollRun> findAllByOrderByProcessedAtDesc();
}
