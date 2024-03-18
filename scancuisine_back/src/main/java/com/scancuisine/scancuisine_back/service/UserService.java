package com.scancuisine.scancuisine_back.service;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutures;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.scancuisine.scancuisine_back.entity.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class UserService {
    private static final String COLLECTION_NAME = "users";

    public String createUser(User user) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference usersCollection = dbFirestore.collection(COLLECTION_NAME);

        Query query = dbFirestore.collection(COLLECTION_NAME).whereEqualTo("email", user.getEmail());
        ApiFuture<QuerySnapshot> querySnapshotApiFuture = query.get();
        QuerySnapshot querySnapshot = querySnapshotApiFuture.get();

        if (querySnapshot.isEmpty()) {
            user.setId();
            user.setFollowedPeople(new ArrayList<>());
            user.setPassword(user.getPassword());
            ApiFuture<WriteResult> collectionsApiFuture = usersCollection.document(user.getEmail()).set(user);
            return collectionsApiFuture.get().getUpdateTime().toString();
        } else {
            return "User with email " + user.getEmail() + " already exists.";
        }
    }

    public List<User> getAllUsers() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference usersCollection = dbFirestore.collection(COLLECTION_NAME);
        ApiFuture<QuerySnapshot> querySnapshotApiFuture = usersCollection.get();
        QuerySnapshot querySnapshot = querySnapshotApiFuture.get();

        List<User> userList = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            User user = document.toObject(User.class);
            userList.add(user);
        }

        return userList;
    }

    public User getUserbyEmail(String email) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(email);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document;
        User user = null;
        try {
            document = future.get();
            if (document.exists()) {
                user = document.toObject(User.class);
                return user;
            } else {
                return null;
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String updateUser(String email, User user) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(email);
        ApiFuture<DocumentSnapshot> future = documentReference.get();

        try {
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                user.setId(getUserbyEmail(email).getId());
                if (user.getFirstName().equals("string")) {
                    user.setFirstName(getUserbyEmail(email).getFirstName());
                }
                if (user.getLastName().equals("string")) {
                    user.setLastName(getUserbyEmail(email).getLastName());
                }
                if (user.getEmail().equals("string")) {
                    user.setEmail(getUserbyEmail(email).getEmail());
                }
                if (user.getPassword().equals("string")) {
                    user.setPassword(getUserbyEmail(email).getPassword());
                }
                if (user.getRole().equals("string")) {
                    user.setRole(getUserbyEmail(email).getRole());
                }
                if (user.getImageUrl().equals("string")) {
                    user.setImageUrl(getUserbyEmail(email).getImageUrl());
                }
                if (user.getDescription().equals("string")) {
                    user.setDescription(getUserbyEmail(email).getDescription());
                }
                if(user.getMyRecipes().size()==1 && user.getMyRecipes().get(0).equals("string")){
                    user.setMyRecipes(getUserbyEmail(email).getMyRecipes());
                }
                if(user.getMyFavoriteRecipes().size()==1 && user.getMyFavoriteRecipes().get(0).equals("string")){
                    user.setMyFavoriteRecipes(getUserbyEmail(email).getMyFavoriteRecipes());
                }
                user.setFollowedPeople(getUserbyEmail(email).getFollowedPeople());

                ApiFuture<WriteResult> writeResultApiFuture = documentReference.set(user);
                return writeResultApiFuture.get().getUpdateTime().toString();
            } else {
                return "User with email " + email + " does not exist.";
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String deleteUser(String email) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(email);
        ApiFuture<WriteResult> writeResultApiFuture = documentReference.delete();
        List<ApiFuture<WriteResult>> updateFutures = new ArrayList<>();
        try {
            List<User> allUsers = getAllUsers();

            for (User user : allUsers) {
                if (user.getFollowedPeople().contains(email)) {
                    user.getFollowedPeople().remove(email);
                    DocumentReference userDocRef = dbFirestore.collection(COLLECTION_NAME).document(user.getEmail());
                    ApiFuture<WriteResult> updateFuture = userDocRef.set(user);
                    updateFutures.add(updateFuture);
                }
            }

            ApiFutures.allAsList(updateFutures).get();

            return "Document with Email " + email + " has been deleted, and the user has been removed from other users' followedPeople lists.";
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String followUser(String email, String followerEmail) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(email);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document;
        User user = null;
        try {
            document = future.get();
            if (document.exists()) {
                user = document.toObject(User.class);
                assert user != null;
                User followedPeople = getUserbyEmail(followerEmail);
                if (followedPeople != null) {
                    user.getFollowedPeople().add(followerEmail);
                    ApiFuture<WriteResult> writeResultApiFuture = documentReference.set(user);
                    return writeResultApiFuture.get().getUpdateTime().toString();
                } else {
                    return "Follower with email " + followerEmail + " does not exist.";
                }
            } else {
                return "User with email " + email + " does not exist.";
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }
}