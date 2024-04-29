package com.scancuisine.scancuisine_back.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.scancuisine.scancuisine_back.entity.Category;
import com.scancuisine.scancuisine_back.entity.Recipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class CategoryService {
    @Autowired private RecipeService recipeService;

    private static final String COLLECTION_NAME = "category";
    public String createCategory(Category category) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference categoryCollection = dbFirestore.collection(COLLECTION_NAME);

        Query query = dbFirestore.collection(COLLECTION_NAME).whereEqualTo("name", category.getName());
        ApiFuture<QuerySnapshot> querySnapshotApiFuture = query.get();
        QuerySnapshot querySnapshot = querySnapshotApiFuture.get();

        if (querySnapshot.isEmpty()) {
            category.setId();
            if(category.getRecipeIds().isEmpty()){
                category.setRecipeIds(new ArrayList<>());
            }
            ApiFuture<WriteResult> collectionsApiFuture = categoryCollection.document(category.getName()).set(category);
            // return the category
            return category.toString();
        } else {
            return "Category with name " + category.getName() + " already exists.";
        }
    }

    public List<Category> getAllCategories() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference categoryCollection = dbFirestore.collection(COLLECTION_NAME);

        ApiFuture<QuerySnapshot> querySnapshotApiFuture = categoryCollection.get();
        QuerySnapshot querySnapshot = querySnapshotApiFuture.get();

        List<Category> categoryList = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            Category category = document.toObject(Category.class);
            categoryList.add(category);
        }

        return categoryList;
    }

    public Category getCategoryByName(String name) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(name);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document;
        Category category = null;
        try {
            document = future.get();
            if(document.exists()){
                category = document.toObject(Category.class);
                return category;
            }
            else{
                return null;
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String updateCategory(String name) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(name);
        ApiFuture<DocumentSnapshot> future = documentReference.get();

        try {
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                Category category = document.toObject(Category.class);
                assert category != null;
                // add to category all the recipe ids that are not already in the category
                for (Recipe recipe : recipeService.getAllRecipes()) {
                    if (!category.getRecipeIds().contains(recipe.getId()) && recipe.getCategory().equals(name)) {
                        category.getRecipeIds().add(recipe.getId());
                    }
                }
                ApiFuture<WriteResult> collectionsApiFuture = documentReference.set(category);
                return document.toObject(Category.class).toString();
            } else {
                return "Category with name " + name + " does not exist.";
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String deleteCategory(String name) {

        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(name);
        ApiFuture<DocumentSnapshot> future = documentReference.get();

        try {
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                ApiFuture<WriteResult> writeResult = documentReference.delete();
                return "Document with ID " + name + " has been deleted";
            } else {
                return "No such document with ID " + name;
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Recipe> getRecipesByCategory(String categoryName) throws ExecutionException, InterruptedException {
        Category category = getCategoryByName(categoryName);
        List<Recipe> recipes = new ArrayList<>();
        if (category != null) {
            for (Recipe recipe : recipeService.getAllRecipes()) {
                if (recipe.getCategory().trim().equals(categoryName.trim())) {
                    recipes.add(recipe);
                }
            }
        }
        return recipes;
    }
}
