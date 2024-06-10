package com.scancuisine.scancuisine_back.controller;


import com.scancuisine.scancuisine_back.entity.Recipe;
import com.scancuisine.scancuisine_back.service.RecipeBasedOnIngredientsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/recipe-based-on-ingredients")
public class RecipeBasedOnIngredients {

    @Autowired private RecipeBasedOnIngredientsService recipeBasedOnIngredientsService;

    @PostMapping
    public String postRecipeBasedOnIngredients(@RequestBody Recipe recipe) throws ExecutionException, InterruptedException {
        return recipeBasedOnIngredientsService.postRecipeBasedOnIngredients(recipe);
    }

    @GetMapping
    public List<Recipe> getAllRecipeBasedOnIngredients() throws ExecutionException, InterruptedException {
        return recipeBasedOnIngredientsService.getAllRecipeBasedOnIngredients();
    }

    @GetMapping("/{authorEmail}")
    public List<Recipe> getRecipeBasedOnIngredientsByAuthor(@PathVariable String authorEmail) throws ExecutionException, InterruptedException {
        return recipeBasedOnIngredientsService.getRecipeBasedOnIngredientsByAuthor(authorEmail);
    }

    @GetMapping("/getRecipeById/{id}")
    public Recipe getRecipeBasedOnIngredientsById(@PathVariable String id) throws ExecutionException, InterruptedException {
        return recipeBasedOnIngredientsService.getRecipeBasedOnIngredientsById(id);
    }

    @DeleteMapping("/{authorEmail}")
    public String deleteRecipeBasedOnIngredientsByAuthor(@PathVariable String authorEmail) throws ExecutionException, InterruptedException {
        return recipeBasedOnIngredientsService.deleteRecipeBasedOnIngredientsByAuthor(authorEmail);
    }


}
