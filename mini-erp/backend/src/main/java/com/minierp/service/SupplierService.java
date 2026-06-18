package com.minierp.service;

import com.minierp.dto.SupplierRequest;
import com.minierp.exception.ApiException;
import com.minierp.model.Supplier;
import com.minierp.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final LedgerService ledgerService;

    public List<Supplier> listAll() {
        return supplierRepository.findByIsDeletedFalse();
    }

    public Supplier getById(String id) {
        Supplier s = supplierRepository.findById(id)
                .orElseThrow(() -> new ApiException("Supplier not found", HttpStatus.NOT_FOUND));
        if (s.isDeleted()) throw new ApiException("Supplier not found", HttpStatus.NOT_FOUND);
        return s;
    }

    public Supplier create(SupplierRequest req) {
        Supplier s = Supplier.builder()
                .name(req.getName())
                .contact(req.getContact())
                .payableBalance(0.0)
                .isDeleted(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        return supplierRepository.save(s);
    }

    public Supplier update(String id, SupplierRequest req) {
        Supplier s = getById(id);
        s.setName(req.getName());
        s.setContact(req.getContact());
        s.setUpdatedAt(Instant.now());
        return supplierRepository.save(s);
    }

    public void softDelete(String id) {
        Supplier s = getById(id);
        s.setDeleted(true);
        s.setUpdatedAt(Instant.now());
        supplierRepository.save(s);
    }

    public Supplier recordPayment(String id, double amount) {
        Supplier s = getById(id);
        if (amount > s.getPayableBalance() + 0.01) {
            throw new ApiException("Payment exceeds outstanding balance", HttpStatus.BAD_REQUEST);
        }
        s.setPayableBalance(Math.max(0, s.getPayableBalance() - amount));
        s.setUpdatedAt(Instant.now());
        Supplier saved = supplierRepository.save(s);
        ledgerService.record("PAYABLE_PAYMENT", saved.getId(), "OUT", amount, "Payment made to " + saved.getName());
        return saved;
    }

    /** Used internally by PurchaseService when a credit purchase is made. */
    public Supplier increaseBalance(String id, double amount) {
        Supplier s = getById(id);
        s.setPayableBalance(s.getPayableBalance() + amount);
        s.setUpdatedAt(Instant.now());
        return supplierRepository.save(s);
    }
}
