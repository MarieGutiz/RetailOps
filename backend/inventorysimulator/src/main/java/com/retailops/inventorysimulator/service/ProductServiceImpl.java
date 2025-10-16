package com.retailops.inventorysimulator.service;

import com.retailops.inventorysimulator.exception.ProductNotFoundException;
import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl extends BaseServiceImpl<Product> implements ProductService {
    private final ProductRepository productRepository;
    //We can freely add other repo here

    @Override
    protected JpaRepository<Product, Long> getRepository() {
        return productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(long id) {
       return productRepository.findById(id);
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public void delete(Product item) {
        productRepository.delete(item);
    }

    public void updateProduct(Product product) {
         productRepository.save(product);
    }

    @Override
    public Optional<Product> updateProduct(Long id, Product updatedProduct) {
        return Optional.ofNullable(productRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedProduct.getName());
                    existing.setCategory(updatedProduct.getCategory());
                    existing.setUnitCost(updatedProduct.getUnitCost());
                    existing.setUnitPrice(updatedProduct.getUnitPrice());
                    return productRepository.save(existing);
                })
                .orElseThrow(() -> new ProductNotFoundException(id)));
    }

    @Override
    public Optional<Product> getProduct(Long id) {
        return Optional.of(productRepository.findById(id))
                .orElseThrow(() ->  new ProductNotFoundException(id));
    }

    @Override
    public List<Product> saveAll(List<Product> products) {
        List<Product> validProducts = products.stream()
                .filter(p -> p.getDescription() != null && p.getUnitPrice() != null)
                .toList();
        return productRepository.saveAll(validProducts);
    }
}
