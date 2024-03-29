package com.scancuisine.scancuisine_back.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.scancuisine.scancuisine_back.entity.Recipe;
import com.scancuisine.scancuisine_back.entity.RecipeComment;
import com.scancuisine.scancuisine_back.entity.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

import java.util.concurrent.ExecutionException;

@Service
public class RecipeCommentService {
    private static final String COLLECTION_NAME = "recipe-comments";
    @Autowired
    private RecipeService recipeService;

    @Autowired
    private UserService userService;

    public String createRecipeComment(RecipeComment recipeComment) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference recipeCommentsCollection = dbFirestore.collection(COLLECTION_NAME);

        Query query = dbFirestore.collection(COLLECTION_NAME).whereEqualTo("id", recipeComment.getId());
        ApiFuture<QuerySnapshot> querySnapshotApiFuture = query.get();
        QuerySnapshot querySnapshot = querySnapshotApiFuture.get();

        if(querySnapshot.isEmpty())
        {
            recipeComment.setId();
            User user= userService.getUserbyEmail(recipeComment.getAuthorEmail());
            if(user==null)
            {
                return "User with email "+recipeComment.getAuthorEmail()+" does not exist.";
            }
            else
            {
                Recipe recipe = recipeService.getRecipebyId(recipeComment.getRecipeId());
                if(recipe==null)
                {
                    return "Recipe with id "+recipeComment.getRecipeId()+" does not exist.";
                }
                else {
                    ApiFuture<WriteResult> collectionsApiFuture = recipeCommentsCollection.document(recipeComment.getId()).set(recipeComment);
                    return collectionsApiFuture.get().getUpdateTime().toString();
                }
            }
        }
        else{
            return "Recipe Comment with id "+recipeComment.getId()+" already exists.";
        }
    }

    public  List<RecipeComment> getAllRecipeComments() throws ExecutionException, InterruptedException {
       Firestore dbFirestore = FirestoreClient.getFirestore();
       CollectionReference recipeCommentsCollection = dbFirestore.collection(COLLECTION_NAME);
       ApiFuture<QuerySnapshot> querySnapshotApiFuture = recipeCommentsCollection.get();
       QuerySnapshot querySnapshot = querySnapshotApiFuture.get();

       List<RecipeComment> recipeCommentList = new ArrayList<>();
       for (DocumentSnapshot document : querySnapshot.getDocuments()) {
           RecipeComment recipeComment = document.toObject(RecipeComment.class);
           recipeCommentList.add(recipeComment);
       }
       return recipeCommentList;
    }

    public RecipeComment getRecipeCommentById(String id) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document;
        RecipeComment recipeComment = null;
        try {
            document = future.get();
            if (document.exists()) {
                recipeComment = document.toObject(RecipeComment.class);
                return recipeComment;
            } else {
                return null;
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String updateRecipeComment(String id, RecipeComment recipeComment) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> future = documentReference.get();

        try {
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                recipeComment.setId(id);
                if (recipeComment.getAuthorEmail().equals("string")) {
                    recipeComment.setAuthorEmail(getRecipeCommentById(id).getAuthorEmail());
                }
                if (recipeComment.getRecipeId().equals("string")) {
                    recipeComment.setRecipeId(getRecipeCommentById(id).getRecipeId());
                }
                if (recipeComment.getComment().equals("string")) {
                    recipeComment.setComment(getRecipeCommentById(id).getComment());
                }
                if(recipeComment.getLikesCount()==0)
                {
                    recipeComment.setLikesCount(getRecipeCommentById(id).getLikesCount());
                }
                if(recipeComment.getDislikesCount()==0)
                {
                    recipeComment.setDislikesCount(getRecipeCommentById(id).getDislikesCount());
                }
                ApiFuture<WriteResult> writeResultApiFuture = documentReference.set(recipeComment);
                return writeResultApiFuture.get().getUpdateTime().toString();
            } else {
                return "Recipe Comment with id " + id + " does not exist.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String deleteRecipeComment(String id) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> future = documentReference.get();

        try{
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                ApiFuture<WriteResult> writeResultApiFuture = documentReference.delete();
                return "Document with ID " + id + " has been deleted";
            } else {
                return "Document with ID " + id + " does not exist.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
