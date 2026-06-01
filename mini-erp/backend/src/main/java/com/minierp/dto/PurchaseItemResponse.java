package com.minierp.dto;

import com.minierp.model.PurchaseItem;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PurchaseItemResponse {
    private String productId;
    private String productName;
    private double unitCost;
    private int quantity;
    private double lineTotal;

    public static PurchaseItemResponse fromEntity(PurchaseItem i) {
        return new PurchaseItemResponse(i.getProductId(), i.getProductName(), i.getUnitCost(), i.getQuantity(), i.getLineTotal());
    }
}
