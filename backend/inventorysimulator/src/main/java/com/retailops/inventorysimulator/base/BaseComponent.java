package com.retailops.inventorysimulator.base;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Base component class providing logging for lifecycle events (initialization and destruction)
 * and a shared logger for all subclasses.
 */
public abstract class BaseComponent {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @PostConstruct()
    private void init() {
        logger.trace("Loaded {}.", getClass().getName());
    }

    @PreDestroy()
    private void destroy() {
        logger.trace("Unloaded {}.", getClass().getName());
    }
}
