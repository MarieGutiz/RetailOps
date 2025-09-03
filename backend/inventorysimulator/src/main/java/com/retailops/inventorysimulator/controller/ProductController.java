package com.retailops.inventorysimulator.controller;

import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
  private final ProductService productService;

  //List of prdt
   @GetMapping
    public List<Product> getAllProducts() {
       return productService.findAll();
   }

   //Get a product
   @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable long id) {
       return ResponseEntity.ok(productService.get(id));
   }

   //Persist a product
    @RequestMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
       return ResponseEntity.ok(productService.create(product));
    }

    //Put a product, return a 201?
    @PutMapping("/{id}")
    public ResponseEntity<Optional<Product>> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    //Delete a product
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable long id) {
       productService.deleteById(id);
    }


}
