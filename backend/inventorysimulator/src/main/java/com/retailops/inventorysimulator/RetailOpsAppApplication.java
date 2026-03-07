package com.retailops.inventorysimulator;

import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;

@SpringBootApplication
public class RetailOpsAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(RetailOpsAppApplication.class, args);

	}
}
