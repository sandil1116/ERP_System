package com.minierp.dto;

import com.minierp.model.Customer;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomerResponse {
    private String id;
    private String name;
    private String contact;
    private String type;
    private double creditBalance;

    public static CustomerResponse fromEntity(Customer c) {
        return new CustomerResponse(c.getId(), c.getName(), c.getContact(), c.getType(), c.getCreditBalance());
    }
}
