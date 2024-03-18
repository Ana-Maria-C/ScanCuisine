package com.scancuisine.scancuisine_back.entity;

import lombok.Data;
import org.mindrot.jbcrypt.BCrypt;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class User {
    private String id;
    private String firstName;
    private String lastName;
    private String description;
    private String email;
    private String password;
    private String role;
    private String imageUrl;
    private List<String> myRecipes = new ArrayList<>();
    private List<String> myFavoriteRecipes = new ArrayList<>();
    private List<String> followedPeople = new ArrayList<>();

    public void setId() {
        this.id = UUID.randomUUID().toString();
    }
    public void setPassword(String password) {
        // Hash the password
        this.password = BCrypt.hashpw(password, BCrypt.gensalt());
    }

    public boolean checkPassword(String candidatePassword) {
        return BCrypt.checkpw(candidatePassword, this.password);
    }

}
