package com.retailops.inventorysimulator.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serial;
import java.io.Serializable;


/**
 * Base entity class providing a primary key ID and serialization support
 * for all inheriting JPA entities.
 */
@Getter
@Setter
@ToString
@MappedSuperclass
public class BaseModel implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "idGenerator")
    @Column(updatable = false)
    private Long id;
}