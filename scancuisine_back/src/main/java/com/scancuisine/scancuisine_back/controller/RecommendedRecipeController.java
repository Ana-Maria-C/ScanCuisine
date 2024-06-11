package com.scancuisine.scancuisine_back.controller;


import com.scancuisine.scancuisine_back.entity.Recipe;
import com.scancuisine.scancuisine_back.service.RecommendedRecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/recommended-recipe")
public class RecommendedRecipeController {
    @Autowired
    private RecommendedRecipeService recommendedRecipeService;

    @PostMapping
    public String postRecommendedRecipe(@RequestBody Recipe recipe) {
        return recommendedRecipeService.postRecommendedRecipe(recipe);
    }

    @GetMapping
    public List<Recipe> getAllRecommendedRecipe() throws ExecutionException, InterruptedException {
        return recommendedRecipeService.getAllRecommendedRecipe();
    }

    @GetMapping("/{authorEmail}")
    public List<Recipe> getRecommendedRecipeByAuthor(@PathVariable String authorEmail) throws ExecutionException, InterruptedException {
        return recommendedRecipeService.getRecommendedRecipeByAuthor(authorEmail);
    }

    @GetMapping("/getRecipeById/{id}")
    public Recipe getRecommendedRecipeById(@PathVariable String id) throws ExecutionException, InterruptedException {
        return recommendedRecipeService.getRecommendedRecipeById(id);
    }

    @DeleteMapping("/{authorEmail}")
    public String deleteRecommendedRecipeByAuthor(@PathVariable String authorEmail) throws ExecutionException, InterruptedException {
        return recommendedRecipeService.deleteRecommendedRecipeByAuthor(authorEmail);
    }
}
