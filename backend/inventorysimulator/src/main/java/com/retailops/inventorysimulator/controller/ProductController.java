package com.retailops.inventorysimulator.controller;

import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
  private final ProductService productService;

   @GetMapping
    public List<Product> getAllProducts() {
       return productService.findAll();
   }

}
