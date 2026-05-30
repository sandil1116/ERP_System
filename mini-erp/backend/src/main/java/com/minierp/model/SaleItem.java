package com.minierp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Snapshot of a product at the moment of sale - name/price are copied so
 *  historical invoices stay accurate even if the product is edited later. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleItem {
    private String productId;
    private String productName;
    private double unitPrice;
    private double unitCost;   // product cost price at time of sale - snapshot for accurate P&L/COGS
    private int quantity;
    private double lineTotal;
}
