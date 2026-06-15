package com.minierp.dto;

import com.minierp.model.Account;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AccountResponse {
    private String id;
    private String name;
    private double balance;
    private boolean isSystem; // true only for the computed "Cash" pseudo-account

    public static AccountResponse fromEntity(Account a) {
        return new AccountResponse(a.getId(), a.getName(), a.getBalance(), false);
    }
}
