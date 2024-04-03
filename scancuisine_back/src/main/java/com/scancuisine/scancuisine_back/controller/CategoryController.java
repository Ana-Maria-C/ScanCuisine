package com.scancuisine.scancuisine_back.controller;


import com.scancuisine.scancuisine_back.entity.Category;
import com.scancuisine.scancuisine_back.entity.Recipe;
import com.scancuisine.scancuisine_back.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/category")
public class CategoryController {
@Autowired private CategoryService categoryService;

    @PostMapping
    public String createCategory(@RequestBody Category category) throws ExecutionException, InterruptedException {
        return categoryService.createCategory(category);
    }

    @GetMapping("/all")
    public List<Category> getAllCategories() throws ExecutionException, InterruptedException {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{name}")
    public Category getCategoryByName(@PathVariable String name) {
        return categoryService.getCategoryByName(name);
    }

    @GetMapping("/recipes/{categoryName}")
    public List<Recipe> getRecipesByCategory(@PathVariable String categoryName) {
        return categoryService.getRecipesByCategory(categoryName);
    }

    @PutMapping("/{name}")
    public String updateCategory(@PathVariable String name, @RequestBody String recipeId) {
        return categoryService.updateCategory(name, recipeId);
    }

    @DeleteMapping("/{name}")
    public String deleteCategory(@PathVariable String name) {
        return categoryService.deleteCategory(name);
    }
}
