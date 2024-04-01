package com.scancuisine.scancuisine_back.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.scancuisine.scancuisine_back.entity.Recipe;
import com.scancuisine.scancuisine_back.entity.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class RecipeService {
    private static final String COLLECTION_NAME = "recipes";
    @Autowired
    private UserService userService;

    public String createRecipe(Recipe recipe) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference recipesCollection = dbFirestore.collection(COLLECTION_NAME);

        Query query = dbFirestore.collection(COLLECTION_NAME).whereEqualTo("id", recipe.getId());
        ApiFuture<QuerySnapshot> querySnapshotApiFuture = query.get();
        QuerySnapshot querySnapshot = querySnapshotApiFuture.get();

        if (querySnapshot.isEmpty()) {
            recipe.setId();
            User user = this.userService.getUserbyEmail(recipe.getAuthorEmail());
            if (user == null) {
                return "User with email " + recipe.getAuthorEmail() + " does not exist.";
            }
            if(recipe.getIngredients().isEmpty())
            {
                return "Recipe must have at least one ingredient";
            }
            if(recipe.getPreparationMethod().equals("")){
                return "Recipe must have a preparation method";
            }
            if(recipe.getName().equals("")){
                return "Recipe must have a name";
            }
            if(recipe.getCategory()==null || recipe.getCategory().equals("")){
                recipe.setCategory("Other");
            }
            if(recipe.getCuisine()==null || recipe.getCategory().equals("")){
                recipe.setCuisine("Other");
            }
            if(recipe.getImageUrl()==null || recipe.getCategory().equals("")){
                recipe.setImageUrl("");
            }
            if(recipe.getVideoUrl()==null || recipe.getCategory().equals("")){
                recipe.setVideoUrl("");
            }
            if(recipe.getCommentId().isEmpty()){
                recipe.setCommentId(new ArrayList<>());
            }
            user.getMyRecipes().add(recipe.getId());
            this.userService.updateUser(recipe.getAuthorEmail(), user);
            ApiFuture<WriteResult> collectionsApiFuture = recipesCollection.document(recipe.getId()).set(recipe);
            return collectionsApiFuture.get().getUpdateTime().toString();

        } else {
            return  "Recipe with id " + recipe.getId() + " already exists.";
        }
    }

    public List<Recipe> getAllRecipes() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference recipesCollection = dbFirestore.collection(COLLECTION_NAME);
        ApiFuture<QuerySnapshot> querySnapshotApiFuture = recipesCollection.get();
        QuerySnapshot querySnapshot= querySnapshotApiFuture.get();

        List<Recipe> recipeList = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            Recipe recipe = document.toObject(Recipe.class);
            recipeList.add(recipe);
        }

        return recipeList;
    }

    public Recipe getRecipebyId(String id) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document;
        Recipe recipe = null;
        try {
            document = future.get();
            if (document.exists()) {
                recipe = document.toObject(Recipe.class);
                return recipe;
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Recipe> getRecipesOfUser(String email) {
        User user = this.userService.getUserbyEmail(email);
        if (user == null) {
            return new ArrayList<>(); // Returnează o listă goală dacă utilizatorul nu există
        }

        List<String> recipeIds = user.getMyRecipes();
        if(recipeIds.isEmpty()) {
            return new ArrayList<>(); // Returnează o listă goală dacă utilizatorul nu are rețete
        }

        List<Recipe> recipes = new ArrayList<>();
        for (String recipeId : recipeIds) {
            Recipe recipe = this.getRecipebyId(recipeId);
            if (recipe != null) {
                recipes.add(recipe);
            }
        }
        return recipes;
    }


    public String updateRecipe(String id, Recipe recipe) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> future = documentReference.get();

        try{
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                recipe.setId(id);
                if(recipe.getAuthorEmail().equals("string")){
                    recipe.setAuthorEmail(getRecipebyId(id).getAuthorEmail());
                }
                if(recipe.getName().equals("string")){
                    recipe.setName(getRecipebyId(id).getName());
                }
                if(recipe.getIngredients().size()==1 && recipe.getIngredients().get(0).equals("string")){
                    recipe.setIngredients(getRecipebyId(id).getIngredients());
                }
                if(recipe.getPreparationMethod().equals("string")){
                    recipe.setPreparationMethod(getRecipebyId(id).getPreparationMethod());
                }
                if(recipe.getImageUrl().equals("string")){
                    recipe.setImageUrl(getRecipebyId(id).getImageUrl());
                }
                if(recipe.getCategory().equals("string")){
                    recipe.setCategory(getRecipebyId(id).getCategory());
                }
                if(recipe.getCuisine().equals("string")){
                    recipe.setCuisine(getRecipebyId(id).getCuisine());
                }
                if(recipe.getVideoUrl().equals("string")){
                    recipe.setVideoUrl(getRecipebyId(id).getVideoUrl());
                }
                if(recipe.getCommentId().size()==1 && recipe.getCommentId().get(0).equals("string")){
                    recipe.setCommentId(getRecipebyId(id).getCommentId());
                }
                ApiFuture<WriteResult> writeResultApiFuture = documentReference.set(recipe);
                return writeResultApiFuture.get().getUpdateTime().toString();
            } else {
                return "Recipe with id " + id + " does not exist";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String deleteRecipe(String id) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> future = documentReference.get();

        try {
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                ApiFuture<WriteResult> writeResultApiFuture = documentReference.delete();
                return "Document with Recipe ID " + id + " has been deleted";
            } else {
                return "Document with Recipe ID " + id + " does not exist";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String addRecipeToFavorite(String email, String recipeId) {
        User user = this.userService.getUserbyEmail(email);
        if (user == null) {
            return "User with email " + email + " does not exist.";
        }
        else{
            Recipe recipe = this.getRecipebyId(recipeId);
            if (recipe == null) {
                return "Recipe with id " + recipeId + " does not exist.";
            }
            else{
                user.getMyFavoriteRecipes().add(recipeId);
                return this.userService.updateUser(email, user);
            }
        }
    }

    public List<Recipe> getFavoriteRecipesOfUser(String email) {
        User user = this.userService.getUserbyEmail(email);
        if (user == null) {
            return new ArrayList<>(); // Returnează o listă goală dacă utilizatorul nu există
        }

        List<String> recipeIds = user.getMyFavoriteRecipes();
        if(recipeIds.isEmpty()) {
            return new ArrayList<>(); // Returnează o listă goală dacă utilizatorul nu are rețete favorite
        }

        List<Recipe> recipes = new ArrayList<>();
        for (String recipeId : recipeIds) {
            Recipe recipe = this.getRecipebyId(recipeId);
            if (recipe != null) {
                recipes.add(recipe);
            }
        }
        return recipes;
    }
}
