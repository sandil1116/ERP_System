package com.minierp.service;

import com.minierp.dto.CustomerRequest;
import com.minierp.exception.ApiException;
import com.minierp.model.Customer;
import com.minierp.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final LedgerService ledgerService;

    public List<Customer> listAll() {
        return customerRepository.findByIsDeletedFalse();
    }

    public Customer getById(String id) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new ApiException("Customer not found", HttpStatus.NOT_FOUND));
        if (c.isDeleted()) throw new ApiException("Customer not found", HttpStatus.NOT_FOUND);
        return c;
    }

    public Customer create(CustomerRequest req) {
        Customer c = Customer.builder()
                .name(req.getName())
                .contact(req.getContact())
                .type(req.getType() != null ? req.getType() : "CASH")
                .creditBalance(0.0)
                .isDeleted(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        return customerRepository.save(c);
    }

    public Customer update(String id, CustomerRequest req) {
        Customer c = getById(id);
        c.setName(req.getName());
        c.setContact(req.getContact());
        if (req.getType() != null) c.setType(req.getType());
        c.setUpdatedAt(Instant.now());
        return customerRepository.save(c);
    }

    public void softDelete(String id) {
        Customer c = getById(id);
        c.setDeleted(true);
        c.setUpdatedAt(Instant.now());
        customerRepository.save(c);
    }

    /** Record a payment against outstanding credit - never lets balance go below zero. */
    public Customer recordPayment(String id, double amount) {
        Customer c = getById(id);
        if (amount > c.getCreditBalance() + 0.01) {
            throw new ApiException("Payment exceeds outstanding balance", HttpStatus.BAD_REQUEST);
        }
        c.setCreditBalance(Math.max(0, c.getCreditBalance() - amount));
        c.setUpdatedAt(Instant.now());
        Customer saved = customerRepository.save(c);
        ledgerService.record("RECEIVABLE_PAYMENT", saved.getId(), "IN", amount, "Payment received from " + saved.getName());
        return saved;
    }

    /** Used internally by SaleService when a credit sale is made. */
    public Customer increaseBalance(String id, double amount) {
        Customer c = getById(id);
        c.setCreditBalance(c.getCreditBalance() + amount);
        c.setUpdatedAt(Instant.now());
        return customerRepository.save(c);
    }
}
