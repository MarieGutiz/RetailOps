package com.retailops.inventorysimulator.service;

import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
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


}
