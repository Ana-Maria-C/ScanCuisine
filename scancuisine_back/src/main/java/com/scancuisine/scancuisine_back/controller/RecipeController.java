package com.scancuisine.scancuisine_back.controller;

import com.scancuisine.scancuisine_back.entity.Recipe;
import com.scancuisine.scancuisine_back.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @PostMapping
    public String createRecipe(@RequestBody Recipe recipe) throws ExecutionException, InterruptedException {
        return recipeService.createRecipe(recipe);
    }

    @GetMapping("/all")
    public List<Recipe> getAllRecipes() throws ExecutionException, InterruptedException {
        return recipeService.getAllRecipes();
    }

    @GetMapping("/{id}")
    public Recipe getRecipebyId (@PathVariable String id) throws ExecutionException, InterruptedException {
        return recipeService.getRecipebyId(id);
    }

    @GetMapping("/user/{email}")
    public List<Recipe> getRecipesOfUser(@PathVariable String email) throws ExecutionException, InterruptedException {
        return recipeService.getRecipesOfUser(email);
    }

    @GetMapping("/favorite/{email}")
    public List<Recipe> getFavoriteRecipesOfUser(@PathVariable String email) throws ExecutionException, InterruptedException {
        return recipeService.getFavoriteRecipesOfUser(email);
    }

    @PutMapping("/{id}")
    public String updateRecipe(@PathVariable String id, @RequestBody Recipe recipe) throws ExecutionException, InterruptedException {
        return recipeService.updateRecipe(id, recipe);
    }

    @DeleteMapping("/{id}")
    public String deleteRecipe(@PathVariable String id) throws ExecutionException, InterruptedException {
        return recipeService.deleteRecipe(id);
    }

}
