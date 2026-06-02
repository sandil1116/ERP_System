package com.minierp.service;

import com.minierp.dto.SaleItemRequest;
import com.minierp.dto.SaleRequest;
import com.minierp.exception.ApiException;
import com.minierp.model.*;
import com.minierp.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final ProductService productService;
    private final CustomerService customerService;
    private final LedgerService ledgerService;

    /**
     * Creates a sale. This single method is what keeps stock, customer
     * balances, and the ledger all in sync - every write that follows a
     * sale happens right here, in one place, instead of being scattered
     * across the frontend or duplicated per-page.
     */
    public Sale createSale(SaleRequest req, String staffId, String staffName) {
        if (!List.of("CASH", "CREDIT").contains(req.getPaymentType())) {
            throw new ApiException("paymentType must be CASH or CREDIT", HttpStatus.BAD_REQUEST);
        }
        if ("CREDIT".equals(req.getPaymentType()) && (req.getCustomerId() == null || req.getCustomerId().isBlank())) {
            throw new ApiException("A customer must be selected for credit sales", HttpStatus.BAD_REQUEST);
        }

        List<SaleItem> saleItems = new ArrayList<>();
        double total = 0;

        // Validate stock and build line items before writing anything.
        for (SaleItemRequest itemReq : req.getItems()) {
            Product product = productService.getById(itemReq.getProductId());
            if (product.getQuantity() < itemReq.getQuantity()) {
                throw new ApiException(
                        "Not enough stock for '" + product.getName() + "' (have " + product.getQuantity() + ", need " + itemReq.getQuantity() + ")",
                        HttpStatus.BAD_REQUEST);
            }
            double lineTotal = product.getSalePrice() * itemReq.getQuantity();
            saleItems.add(SaleItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .unitPrice(product.getSalePrice())
                    .unitCost(product.getCostPrice())
                    .quantity(itemReq.getQuantity())
                    .lineTotal(lineTotal)
                    .build());
            total += lineTotal;
        }

        // Deduct stock now that we know every line item is valid.
        for (SaleItemRequest itemReq : req.getItems()) {
            Product product = productService.getById(itemReq.getProductId());
            product.setQuantity(product.getQuantity() - itemReq.getQuantity());
            productService.save(product);
        }

        String customerName = "Walk-in customer";
        if (req.getCustomerId() != null && !req.getCustomerId().isBlank()) {
            customerName = customerService.getById(req.getCustomerId()).getName();
        }

        Sale sale = Sale.builder()
                .customerId(req.getCustomerId())
                .customerName(customerName)
                .staffId(staffId)
                .staffName(staffName)
                .items(saleItems)
                .total(total)
                .paymentType(req.getPaymentType())
                .isDeleted(false)
                .createdAt(Instant.now())
                .build();
        sale = saleRepository.save(sale);

        if ("CREDIT".equals(req.getPaymentType())) {
            customerService.increaseBalance(req.getCustomerId(), total);
            ledgerService.record("SALE_CREDIT", sale.getId(), "NONE", total, "Credit sale to " + customerName);
        } else {
            ledgerService.record("SALE_CASH", sale.getId(), "IN", total, "Cash sale to " + customerName);
        }

        return sale;
    }

    public List<Sale> listAll() {
        return saleRepository.findByIsDeletedFalseOrderByCreatedAtDesc();
    }

    public Sale getById(String id) {
        Sale s = saleRepository.findById(id)
                .orElseThrow(() -> new ApiException("Sale not found", HttpStatus.NOT_FOUND));
        if (s.isDeleted()) throw new ApiException("Sale not found", HttpStatus.NOT_FOUND);
        return s;
    }
}
