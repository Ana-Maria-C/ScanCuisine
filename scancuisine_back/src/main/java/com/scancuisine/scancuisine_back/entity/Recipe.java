package com.scancuisine.scancuisine_back.entity;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class Recipe {
    private String id;
    private String authorEmail;
    private String name;
    private List<String> ingredients;
    private String preparationMethod;
    private String imageUrl;
    private String category;
    private String cuisine;
    private String videoUrl;
    private List<String> commentId;

    public void setId() {
        this.id = UUID.randomUUID().toString();
    }
}
