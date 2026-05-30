package com.minierp.dto;

import com.minierp.model.Sale;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
public class SaleResponse {
    private String id;
    private String customerId;
    private String customerName;
    private String staffName;
    private List<SaleItemResponse> items;
    private double total;
    private String paymentType;
    private Instant createdAt;

    public static SaleResponse fromEntity(Sale s) {
        return new SaleResponse(
                s.getId(), s.getCustomerId(), s.getCustomerName(), s.getStaffName(),
                s.getItems().stream().map(SaleItemResponse::fromEntity).toList(),
                s.getTotal(), s.getPaymentType(), s.getCreatedAt()
        );
    }
}
