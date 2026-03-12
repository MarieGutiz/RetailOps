package com.retailops.inventorysimulator.service;

import com.retailops.inventorysimulator.model.BaseModel;

import java.util.List;

/**
 * Generic service interface defining basic CRUD operations for entities
 * extending {@link BaseModel}.
 *
 * @param <T> the type of entity
 * @param <K> the type of the entity's identifier
 */
public interface BaseService<T extends BaseModel, K> {
    T create(T item);

    List<T> createAll(List<T> items);

    List<T> createAll(T... items);

    void update(T item);

    void delete(T item);

    void deleteById(K id);

    T get(K id);

    boolean exists(T item);

    List<T> findAll();

    Long count();
}
