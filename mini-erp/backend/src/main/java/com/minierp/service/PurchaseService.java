package com.minierp.service;

import com.minierp.dto.PurchaseItemRequest;
import com.minierp.dto.PurchaseRequest;
import com.minierp.exception.ApiException;
import com.minierp.model.*;
import com.minierp.repository.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final ProductService productService;
    private final SupplierService supplierService;
    private final LedgerService ledgerService;

    public Purchase createPurchase(PurchaseRequest req, String staffId, String staffName) {
        if (!List.of("CASH", "CREDIT").contains(req.getPaymentType())) {
            throw new ApiException("paymentType must be CASH or CREDIT", HttpStatus.BAD_REQUEST);
        }

        Supplier supplier = supplierService.getById(req.getSupplierId());

        List<PurchaseItem> purchaseItems = new ArrayList<>();
        double total = 0;

        for (PurchaseItemRequest itemReq : req.getItems()) {
            Product product = productService.getById(itemReq.getProductId());
            double lineTotal = itemReq.getUnitCost() * itemReq.getQuantity();
            purchaseItems.add(PurchaseItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .unitCost(itemReq.getUnitCost())
                    .quantity(itemReq.getQuantity())
                    .lineTotal(lineTotal)
                    .build());
            total += lineTotal;
        }

        // Stock increases immediately - purchases don't need a "sufficient stock" check like sales do.
        for (PurchaseItemRequest itemReq : req.getItems()) {
            Product product = productService.getById(itemReq.getProductId());
            product.setQuantity(product.getQuantity() + itemReq.getQuantity());
            // Keep the product's reference cost price current for future sale-price/margin decisions.
            product.setCostPrice(itemReq.getUnitCost());
            productService.save(product);
        }

        Purchase purchase = Purchase.builder()
                .supplierId(supplier.getId())
                .supplierName(supplier.getName())
                .staffId(staffId)
                .staffName(staffName)
                .items(purchaseItems)
                .total(total)
                .paymentType(req.getPaymentType())
                .isDeleted(false)
                .createdAt(Instant.now())
                .build();
        purchase = purchaseRepository.save(purchase);

        if ("CREDIT".equals(req.getPaymentType())) {
            supplierService.increaseBalance(supplier.getId(), total);
            ledgerService.record("PURCHASE_CREDIT", purchase.getId(), "NONE", total, "Credit purchase from " + supplier.getName());
        } else {
            ledgerService.record("PURCHASE_CASH", purchase.getId(), "OUT", total, "Cash purchase from " + supplier.getName());
        }

        return purchase;
    }

    public List<Purchase> listAll() {
        return purchaseRepository.findByIsDeletedFalseOrderByCreatedAtDesc();
    }

    public Purchase getById(String id) {
        Purchase p = purchaseRepository.findById(id)
                .orElseThrow(() -> new ApiException("Purchase not found", HttpStatus.NOT_FOUND));
        if (p.isDeleted()) throw new ApiException("Purchase not found", HttpStatus.NOT_FOUND);
        return p;
    }
}
