package com.scancuisine.scancuisine_back.controller;

import com.scancuisine.scancuisine_back.entity.Cuisine;
import com.scancuisine.scancuisine_back.entity.Recipe;
import com.scancuisine.scancuisine_back.service.CuisineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/cuisine")
public class CuisineController {
    @Autowired private CuisineService cuisineService;

    @PostMapping
    public String createCuisine(@RequestBody Cuisine cuisine) throws ExecutionException, InterruptedException {
        return cuisineService.createCuisine(cuisine);
    }

    @GetMapping("/all")
    public List<Cuisine> getAllCuisines() throws ExecutionException, InterruptedException {
        return cuisineService.getAllCuisines();
    }

    @GetMapping("/{name}")
    public Cuisine getCuisineByName(@PathVariable String name) {
        return cuisineService.getCuisineByName(name);
    }

    @GetMapping("/recipes/{cuisineName}")
    public List<Recipe> getRecipesByCuisine(@PathVariable String cuisineName) {
        return cuisineService.getRecipesByCuisine(cuisineName);
    }

    @PutMapping("/{name}")
    public String updateCuisine(@PathVariable String name, @RequestBody String recipeId) {
        return cuisineService.updateCuisine(name, recipeId);
    }

    @DeleteMapping("/{name}")
    public String deleteCuisine(@PathVariable String name) {
        return cuisineService.deleteCuisine(name);
    }
}
