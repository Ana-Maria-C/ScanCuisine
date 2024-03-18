package com.scancuisine.scancuisine_back.entity;

import lombok.Data;

import java.util.UUID;

@Data
public class RecipeComment {
    private String id;
    private String recipeId;
    private String authorEmail;
    private String comment;
    private Integer likesCount;
    private Integer dislikesCount;

    public void setId() {
        this.id = UUID.randomUUID().toString();
    }
}
