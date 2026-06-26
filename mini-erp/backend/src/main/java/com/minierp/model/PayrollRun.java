package com.minierp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

/** A record of a completed payroll batch - prevents ambiguity about what was paid and when. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payroll_runs")
public class PayrollRun {
    @Id
    private String id;

    private List<PayrollEntry> entries;
    private double totalPaid;
    private Instant processedAt;
    private String processedByName;
}
