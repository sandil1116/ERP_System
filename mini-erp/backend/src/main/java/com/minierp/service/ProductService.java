package com.minierp.service;

import com.minierp.dto.ProductRequest;
import com.minierp.exception.ApiException;
import com.minierp.model.Product;
import com.minierp.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> listAll() {
        return productRepository.findByIsDeletedFalse();
    }

    public Product getById(String id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ApiException("Product not found", HttpStatus.NOT_FOUND));
        if (p.isDeleted()) {
            throw new ApiException("Product not found", HttpStatus.NOT_FOUND);
        }
        return p;
    }

    public Product create(ProductRequest req) {
        Product product = Product.builder()
                .name(req.getName())
                .category(req.getCategory())
                .unit(req.getUnit())
                .costPrice(req.getCostPrice())
                .salePrice(req.getSalePrice())
                .quantity(req.getQuantity())
                .reorderLevel(req.getReorderLevel())
                .isDeleted(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        return productRepository.save(product);
    }

    public Product update(String id, ProductRequest req) {
        Product p = getById(id);
        p.setName(req.getName());
        p.setCategory(req.getCategory());
        p.setUnit(req.getUnit());
        p.setCostPrice(req.getCostPrice());
        p.setSalePrice(req.getSalePrice());
        p.setReorderLevel(req.getReorderLevel());
        // Note: quantity is NOT set from this form during normal edits -
        // stock only moves via Sales/Purchases or the explicit adjustStock() below,
        // so the number can never silently drift from what actually happened.
        p.setUpdatedAt(Instant.now());
        return productRepository.save(p);
    }

    /** Manual correction (damages, stocktake correction) - the one deliberate exception to "stock only moves via sales/purchases". */
    public Product adjustStock(String id, int newQuantity, String reason) {
        Product p = getById(id);
        if (newQuantity < 0) {
            throw new ApiException("Quantity cannot be negative", HttpStatus.BAD_REQUEST);
        }
        p.setQuantity(newQuantity);
        p.setUpdatedAt(Instant.now());
        return productRepository.save(p);
    }

    public void softDelete(String id) {
        Product p = getById(id);
        p.setDeleted(true);
        p.setUpdatedAt(Instant.now());
        productRepository.save(p);
    }

    /** Used internally by SaleService/PurchaseService - not exposed directly via controller. */
    public Product save(Product product) {
        return productRepository.save(product);
    }
}
