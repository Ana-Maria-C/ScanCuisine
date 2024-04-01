package com.scancuisine.scancuisine_back.controller;

import com.scancuisine.scancuisine_back.entity.RecipeComment;
import com.scancuisine.scancuisine_back.service.RecipeCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/recipe-comments")
public class RecipeCommentController {

    @Autowired private RecipeCommentService recipeCommentService;

    @PostMapping
    public String createRecipeComment(@RequestBody RecipeComment recipeComment) throws ExecutionException, InterruptedException {
        return recipeCommentService.createRecipeComment(recipeComment);
    }

    @GetMapping("/all")
    public List<RecipeComment> getAllRecipeComments() throws ExecutionException, InterruptedException {
        return recipeCommentService.getAllRecipeComments();
    }

    @GetMapping("/{id}")
    public RecipeComment getRecipeCommentbyId(@PathVariable String id) {
        return recipeCommentService.getRecipeCommentById(id);
    }

    @GetMapping("/recipe/{recipeId}")
    public List<RecipeComment> getRecipeCommentsByRecipeId(@PathVariable String recipeId) throws ExecutionException, InterruptedException {
        return recipeCommentService.getRecipeCommentsByRecipeId(recipeId);
    }

    @PutMapping("/{id}")
    public String updateRecipeComment(@PathVariable String id, @RequestBody RecipeComment recipeComment) {
        return recipeCommentService.updateRecipeComment(id, recipeComment);
    }

    @DeleteMapping("/{id}")
    public String deleteRecipeComment(@PathVariable String id) {
        return recipeCommentService.deleteRecipeComment(id);
    }
}
