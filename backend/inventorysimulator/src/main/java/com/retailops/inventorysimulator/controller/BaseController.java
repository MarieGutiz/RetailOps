package com.retailops.inventorysimulator.controller;


import com.retailops.inventorysimulator.base.BaseComponent;
import com.retailops.inventorysimulator.mapper.BaseMapper;
import com.retailops.inventorysimulator.model.BaseModel;
import com.retailops.inventorysimulator.service.BaseService;
import com.retailops.inventorysimulator.transfer.ApiResponse;
import com.retailops.inventorysimulator.transfer.resource.BaseResource;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public abstract class BaseController<T extends BaseModel, R extends BaseResource> extends BaseComponent {
  protected abstract BaseService<T, Long> getBaseService();
  protected abstract BaseMapper<T, R> getMapper();

    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<R>> get(@PathVariable("id") final Long id) {
        return ResponseEntity.ok(
                ApiResponse.<R>builder()
                        .data(getMapper().toResource(getBaseService().get(id)))
                        .build());
    }
  @GetMapping
  public ResponseEntity<ApiResponse<List<R>>> findAll(){
      return ResponseEntity.ok(
              ApiResponse.<List<R>>builder()
                      .data(getMapper().toResources(getBaseService().findAll()))
                      .build()
      );
  }
@PostMapping
public ResponseEntity<ApiResponse<R>> create(@Valid @RequestBody final R resource){
    T domain = getBaseService().create(getMapper().toDomain(resource));
    return new ResponseEntity<>(
            ApiResponse.<R>builder()
                    .data(getMapper().toResource(domain))
                    .build(),
            getNoCacheHeaders(),
            HttpStatus.CREATED);
}

@PutMapping
@ResponseStatus(HttpStatus.NO_CONTENT)
public void update(@RequestBody final R resource){
   getBaseService().update(getMapper().toDomain(resource));
}

@DeleteMapping("{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void delete(@PathVariable("id")final Long id){
    getBaseService().deleteById(id);
}
protected HttpHeaders getNoCacheHeaders() {
    final HttpHeaders headers = new HttpHeaders();
    // HTTP 1.1 cache control header
    headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
    // Http 1.0 cache control header
    headers.add("Pragma", "no-cache");
    headers.add("Expires", "0");
    return headers;
}

}
