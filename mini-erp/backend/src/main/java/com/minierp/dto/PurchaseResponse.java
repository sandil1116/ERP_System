package com.minierp.dto;

import com.minierp.model.Purchase;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
public class PurchaseResponse {
    private String id;
    private String supplierId;
    private String supplierName;
    private String staffName;
    private List<PurchaseItemResponse> items;
    private double total;
    private String paymentType;
    private Instant createdAt;

    public static PurchaseResponse fromEntity(Purchase p) {
        return new PurchaseResponse(
                p.getId(), p.getSupplierId(), p.getSupplierName(), p.getStaffName(),
                p.getItems().stream().map(PurchaseItemResponse::fromEntity).toList(),
                p.getTotal(), p.getPaymentType(), p.getCreatedAt()
        );
    }
}
