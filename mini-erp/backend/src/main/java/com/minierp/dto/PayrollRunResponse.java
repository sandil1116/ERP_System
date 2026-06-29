package com.minierp.dto;

import com.minierp.model.PayrollRun;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
public class PayrollRunResponse {
    private String id;
    private List<PayrollEntryResponse> entries;
    private double totalPaid;
    private Instant processedAt;
    private String processedByName;

    public static PayrollRunResponse fromEntity(PayrollRun r) {
        return new PayrollRunResponse(
                r.getId(),
                r.getEntries().stream().map(PayrollEntryResponse::fromEntity).toList(),
                r.getTotalPaid(), r.getProcessedAt(), r.getProcessedByName()
        );
    }
}
