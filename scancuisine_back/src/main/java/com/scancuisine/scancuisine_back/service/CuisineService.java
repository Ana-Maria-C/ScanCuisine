package com.scancuisine.scancuisine_back.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.scancuisine.scancuisine_back.entity.Cuisine;
import com.scancuisine.scancuisine_back.entity.Recipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class CuisineService {

    @Autowired private RecipeService recipeService;

    private static final String COLLECTION_NAME = "cuisine";
    public String createCuisine(Cuisine cuisine) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference cuisineCollection = db.collection(COLLECTION_NAME);

        Query query = db.collection(COLLECTION_NAME).whereEqualTo("name", cuisine.getName());
        ApiFuture<QuerySnapshot> querySnapshotApiFuture = query.get();
        QuerySnapshot querySnapshot = querySnapshotApiFuture.get();

        if (querySnapshot.isEmpty()) {
            cuisine.setId();
            ApiFuture<WriteResult> collectionsApiFuture = cuisineCollection.document(cuisine.getName()).set(cuisine);
            return collectionsApiFuture.get().getUpdateTime().toString();
        } else {
            return "Cuisine with name " + cuisine.getName() + " already exists.";
        }
    }

    public List<Cuisine> getAllCuisines() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference cuisineCollection = db.collection(COLLECTION_NAME);

        ApiFuture<QuerySnapshot> querySnapshotApiFuture = cuisineCollection.get();
        QuerySnapshot querySnapshot = querySnapshotApiFuture.get();

        List<Cuisine> cuisineList = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            Cuisine cuisine = document.toObject(Cuisine.class);
            cuisineList.add(cuisine);
        }

        return cuisineList;
    }

    public Cuisine getCuisineByName(String name) {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference documentReference = db.collection(COLLECTION_NAME).document(name);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document;
        Cuisine cuisine = null;
        try {
            document = future.get();
            if(document.exists()){
                cuisine = document.toObject(Cuisine.class);
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        return cuisine;
    }

    public String updateCuisine(String name, String recipeId) {
            Firestore db = FirestoreClient.getFirestore();
            DocumentReference documentReference = db.collection(COLLECTION_NAME).document(name);
            ApiFuture<DocumentSnapshot> future = documentReference.get();

            try{
                DocumentSnapshot document = future.get();
                if(document.exists()){
                    Cuisine cuisine = document.toObject(Cuisine.class);
                    assert cuisine != null;
                    if(cuisine.getRecipeIds().contains(recipeId)){
                        return "Recipe with id " + recipeId + " already exists in cuisine " + name;
                    }
                    cuisine.getRecipeIds().add(recipeId);
                    ApiFuture<WriteResult> collectionsApiFuture = documentReference.set(cuisine);
                    return collectionsApiFuture.get().getUpdateTime().toString();
                } else {
                    return "Cuisine with name " + name + " does not exist.";
                }
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
                return null;
            }

    }

    public String deleteCuisine(String name) {

        Firestore db = FirestoreClient.getFirestore();
        DocumentReference documentReference = db.collection(COLLECTION_NAME).document(name);
        ApiFuture<DocumentSnapshot> future = documentReference.get();

        try {
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                ApiFuture<WriteResult> writeResult = documentReference.delete();
                return "Document with ID " + name + " has been deleted";
            } else {
                return "No such document found";
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Recipe> getRecipesByCuisine(String cuisineName) {
        Cuisine cuisine = getCuisineByName(cuisineName);
        List<Recipe> recipes = new ArrayList<>();
        if (cuisine != null) {
            for (String recipeId : cuisine.getRecipeIds()) {
                Recipe recipe = recipeService.getRecipebyId(recipeId);
                if (recipe != null) {
                    recipes.add(recipe);
                }
            }
        }
        return recipes;
    }
}
