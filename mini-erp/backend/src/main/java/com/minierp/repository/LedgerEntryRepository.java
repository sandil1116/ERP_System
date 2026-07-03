package com.minierp.repository;

import com.minierp.model.LedgerEntry;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface LedgerEntryRepository extends MongoRepository<LedgerEntry, String> {
    List<LedgerEntry> findAllByOrderByCreatedAtDesc();
    List<LedgerEntry> findByCreatedAtBetweenOrderByCreatedAtAsc(Instant start, Instant end);
    List<LedgerEntry> findByCreatedAtBefore(Instant before);
}
