package com.minierp.controller;

import com.minierp.dto.AccountRequest;
import com.minierp.dto.AccountResponse;
import com.minierp.service.AccountService;
import com.minierp.service.FinancialsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AccountController {

    private final AccountService accountService;
    private final FinancialsService financialsService;

    /** Returns the automated "Cash" pseudo-account first, then any manually-tracked accounts. */
    @GetMapping
    public List<AccountResponse> list() {
        List<AccountResponse> result = new ArrayList<>();
        result.add(new AccountResponse("cash", "Cash", financialsService.getCurrentCashBalance(), true));
        accountService.listAll().forEach(a -> result.add(AccountResponse.fromEntity(a)));
        return result;
    }

    @PostMapping
    public AccountResponse create(@Valid @RequestBody AccountRequest request) {
        return AccountResponse.fromEntity(accountService.create(request));
    }

    @PutMapping("/{id}")
    public AccountResponse update(@PathVariable String id, @Valid @RequestBody AccountRequest request) {
        return AccountResponse.fromEntity(accountService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        accountService.softDelete(id);
    }
}
