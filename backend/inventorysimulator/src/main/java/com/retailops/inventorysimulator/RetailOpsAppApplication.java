package com.retailops.inventorysimulator;

import com.retailops.inventorysimulator.model.Product;
import com.retailops.inventorysimulator.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

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
					.category("Juice")
					.unitCost(1.00)
					.unitPrice(2.50)
					.build());

			productRepo.save(Product.builder()
					.name("Juice B")
					.category("Juice")
					.unitCost(1.20)
					.unitPrice(2.80)
					.build());

			productRepo.save(Product.builder()
					.name("Cookie C")
					.category("Cookie")
					.unitCost(0.60)
					.unitPrice(1.50)
					.build());

			productRepo.save(Product.builder()
					.name("Cookie D")
					.category("Cookie")
					.unitCost(0.70)
					.unitPrice(1.60)
					.build());

			productRepo.findAll().forEach(p ->
					System.out.println("Loaded: " + p.getName() + " @ $" + p.getUnitPrice()));
		};
	}
}
