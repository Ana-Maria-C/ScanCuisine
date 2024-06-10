package com.scancuisine.scancuisine_back.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.scancuisine.scancuisine_back.entity.Recipe;
import com.scancuisine.scancuisine_back.entity.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class RecipeBasedOnIngredientsService {

    private static final String COLLECTION_NAME = "recipesBasedOnIngredients";
    @Autowired
    private UserService userService;
    public String postRecipeBasedOnIngredients(Recipe recipe) {
        try {
            Firestore dbFirestore = FirestoreClient.getFirestore();
            CollectionReference recipesCollection = dbFirestore.collection(COLLECTION_NAME);

            Query query = dbFirestore.collection(COLLECTION_NAME).whereEqualTo("id", recipe.getId());
            ApiFuture<QuerySnapshot> querySnapshotApiFuture = query.get();
            QuerySnapshot querySnapshot = querySnapshotApiFuture.get();


            recipe.setId();
            if (querySnapshot.isEmpty()) {
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
                if(recipe.getCuisine()==null || recipe.getCuisine().equals("")){
                    recipe.setCuisine("Other");
                }
                if(recipe.getImageUrl()==null || recipe.getImageUrl().equals("")){
                    recipe.setImageUrl("");
                }
                if(recipe.getVideoUrl()==null || recipe.getVideoUrl().equals("")){
                    recipe.setVideoUrl("");
                }
                if(recipe.getCommentId().isEmpty()){
                    recipe.setCommentId(new ArrayList<>());
                }
                recipe.setLikes(0);
                recipe.setDatePosted(new Date());

                ApiFuture<WriteResult> collectionsApiFuture = recipesCollection.document(recipe.getId()).set(recipe);
                return collectionsApiFuture.get().getUpdateTime().toString();

            } else {
                return  "Recipe with id " + recipe.getId() + " already exists.";
            }
        } catch (Exception e) {
            return "A apărut o eroare: " + e.getMessage();
        }
    }


    public List<Recipe> getAllRecipeBasedOnIngredients() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference recipesCollection = dbFirestore.collection(COLLECTION_NAME);
        ApiFuture<QuerySnapshot> querySnapshotApiFuture = recipesCollection.get();
        QuerySnapshot querySnapshot= querySnapshotApiFuture.get();

        List<Recipe> recipeList = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            Recipe recipe = document.toObject(Recipe.class);
            assert recipe != null;
            if(recipe.getCategory().indexOf('@') == -1)
            {
                recipeList.add(recipe);
            }
        }

        return recipeList;
    }

    public List<Recipe> getRecipeBasedOnIngredientsByAuthor(String authorEmail) throws ExecutionException, InterruptedException {
        List<Recipe> recipes = new ArrayList<>();
        if(userService.getUserbyEmail(authorEmail) == null) {
            return new ArrayList<>(); // Returnează o listă goală dacă utilizatorul nu exista
        }

        List<Recipe> allRecipes = this.getAllRecipeBasedOnIngredients();
        for(Recipe recipe : allRecipes) {
            if (recipe.getAuthorEmail().equals(authorEmail)) {
                recipes.add(recipe);
            }
        }
        return recipes;
    }

    public String deleteRecipeBasedOnIngredientsByAuthor(String authorEmail) {
        try {
            Firestore dbFirestore = FirestoreClient.getFirestore();
            CollectionReference recipesCollection = dbFirestore.collection(COLLECTION_NAME);
            List<Recipe> recipes = this.getRecipeBasedOnIngredientsByAuthor(authorEmail);
            for(Recipe recipe : recipes) {
                ApiFuture<WriteResult> writeResult = recipesCollection.document(recipe.getId()).delete();
            }
            return "All recipes of author with email " + authorEmail + " have been deleted.";
        } catch (Exception e) {
            return "An error occurred: " + e.getMessage();
        }
    }

    public Recipe getRecipeBasedOnIngredientsById(String id) {
        try {
            Firestore dbFirestore = FirestoreClient.getFirestore();
            DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(id);
            ApiFuture<DocumentSnapshot> future = documentReference.get();
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                return document.toObject(Recipe.class);
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }
}
