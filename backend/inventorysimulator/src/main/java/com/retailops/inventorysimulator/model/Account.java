package com.retailops.inventorysimulator.model;

import com.retailops.inventorysimulator.util.AuthProviderType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
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

    @Email
    @Column(length = 50, nullable = false, unique = true)
    private String email;

    @Column(unique = true, nullable = true)
    private String username;  // login credential

    @Column(nullable = false)
    private String password;  // will be hashed with BCrypt

    private String role; // e.g. ROLE_USER, ROLE_ADMIN

    @Enumerated(EnumType.STRING)
    private AuthProviderType provider;


}
