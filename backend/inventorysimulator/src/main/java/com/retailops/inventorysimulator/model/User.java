package com.retailops.inventorysimulator.model;

import java.time.LocalDate;

public class User extends BaseModel{
    private String name;
    private  String position;// A manager, a student
    private LocalDate registrationDate;

}
