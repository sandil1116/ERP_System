package com.minierp.service;

import com.minierp.dto.AccountRequest;
import com.minierp.exception.ApiException;
import com.minierp.model.Account;
import com.minierp.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/** Manages manually-tracked accounts (e.g. a bank account). The automated
 *  "Cash" balance is computed separately in FinancialsService from the ledger. */
@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    public List<Account> listAll() {
        return accountRepository.findByIsDeletedFalse();
    }

    public Account create(AccountRequest req) {
        Account account = Account.builder()
                .name(req.getName())
                .balance(req.getBalance())
                .isDeleted(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        return accountRepository.save(account);
    }

    public Account update(String id, AccountRequest req) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ApiException("Account not found", HttpStatus.NOT_FOUND));
        account.setName(req.getName());
        account.setBalance(req.getBalance());
        account.setUpdatedAt(Instant.now());
        return accountRepository.save(account);
    }

    public void softDelete(String id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ApiException("Account not found", HttpStatus.NOT_FOUND));
        account.setDeleted(true);
        accountRepository.save(account);
    }
}
