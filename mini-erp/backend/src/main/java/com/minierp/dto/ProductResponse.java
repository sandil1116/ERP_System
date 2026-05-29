package com.minierp.dto;

import com.minierp.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductResponse {
    private String id;
    private String name;
    private String category;
    private String unit;
    private double costPrice;
    private double salePrice;
    private int quantity;
    private int reorderLevel;
    private boolean lowStock;

    public static ProductResponse fromEntity(Product p) {
        return new ProductResponse(p.getId(), p.getName(), p.getCategory(), p.getUnit(),
                p.getCostPrice(), p.getSalePrice(), p.getQuantity(), p.getReorderLevel(),
                p.getQuantity() <= p.getReorderLevel());
    }
}
