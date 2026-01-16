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
	@Bean
	public CommandLineRunner dataLoader(ProductRepository productRepo) {
		return args -> {
			productRepo.save(Product.builder()
					.name("Juice A")
					.sku("JC-302")
					.category("Juice")
					.unitCost(BigDecimal.valueOf(1.00))
					.unitPrice(BigDecimal.valueOf(2.50))
					.build());

			productRepo.save(Product.builder()
					.name("Juice B")
					.sku("JC-303")
					.category("Juice")
					.unitCost(BigDecimal.valueOf(1.20))
					.unitPrice(BigDecimal.valueOf(2.80))
					.build());

			productRepo.save(Product.builder()
					.name("Cookie C")
					.sku("CK-SN2")
					.category("Cookie")
					.unitCost(BigDecimal.valueOf(0.60))
					.unitPrice(BigDecimal.valueOf(1.50))
					.build());

			productRepo.save(Product.builder()
					.name("Cookie D")
					.sku("CK-SN3")
					.category("Cookie")
					.unitCost(BigDecimal.valueOf(0.70))
					.unitPrice(BigDecimal.valueOf(1.60))
					.build());

			productRepo.findAll().forEach(p ->
					System.out.println("Loaded: " + p.getName() + " @ $" + p.getUnitPrice()));
		};
	}
}
