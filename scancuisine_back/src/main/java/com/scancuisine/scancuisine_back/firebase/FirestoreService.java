package com.scancuisine.scancuisine_back.firebase;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FirestoreService {

    private final Firestore firestore;

    public FirestoreService(Firestore firestore) {
        this.firestore = firestore;
    }

    public List<String> getDocumentsFromCollection(String collectionName) throws Exception {
        CollectionReference collection = firestore.collection(collectionName);
        return collection.get().get().getDocuments().stream()
                .map(DocumentSnapshot::getId)
                .collect(Collectors.toList());
    }
}