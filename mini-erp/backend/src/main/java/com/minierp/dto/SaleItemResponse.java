package com.minierp.dto;

import com.minierp.model.SaleItem;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SaleItemResponse {
    private String productId;
    private String productName;
    private double unitPrice;
    private int quantity;
    private double lineTotal;

    public static SaleItemResponse fromEntity(SaleItem i) {
        return new SaleItemResponse(i.getProductId(), i.getProductName(), i.getUnitPrice(), i.getQuantity(), i.getLineTotal());
    }
}
