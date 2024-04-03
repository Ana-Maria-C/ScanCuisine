package com.scancuisine.scancuisine_back.entity;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class Category {
    private String id;
    private String name;
    private List<String> recipeIds = new ArrayList<>();

    public void setId() {
        this.id = UUID.randomUUID().toString();
    }
}
