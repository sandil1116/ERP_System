package com.minierp.dto;

import com.minierp.model.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SupplierResponse {
    private String id;
    private String name;
    private String contact;
    private double payableBalance;

    public static SupplierResponse fromEntity(Supplier s) {
        return new SupplierResponse(s.getId(), s.getName(), s.getContact(), s.getPayableBalance());
    }
}
