package com.retailops.inventorysimulator.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Entity
@Table(name = "accounts")
public class Account extends BaseModel{
    private String name;
    private  String position;// A manager, a student
    private LocalDate registrationDate;

    @Column(unique = true, nullable = false)
    private String username;  // login credential

    @Column(nullable = false)
    private String password;  // will be hashed with BCrypt

    private String role; // e.g. ROLE_USER, ROLE_ADMIN

}
