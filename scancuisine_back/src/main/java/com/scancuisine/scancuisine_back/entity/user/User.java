package com.scancuisine.scancuisine_back.entity.user;

import com.google.firebase.database.PropertyName;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Data
public class User implements UserDetails {
    private String id;
    private String firstName;
    private String lastName;
    private String description;
    @PropertyName("username")
    private String email;
    private String password;
    private String imageUrl;
    private List<String> myRecipes = new ArrayList<>();
    private List<String> myFavoriteRecipes = new ArrayList<>();
    private List<String> followedPeople = new ArrayList<>();
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    public void setId() {
        this.id = UUID.randomUUID().toString();
    }

    public boolean checkPassword(String candidatePassword) {
        return BCrypt.checkpw(candidatePassword, this.password);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void addRecipe(String recipe) {
        if (recipe != null && !recipe.isEmpty()) {
            myRecipes.add(recipe);
        }
    }

    public void addFavoriteRecipe(String recipe) {
        if (recipe != null && !recipe.isEmpty()) {
            myFavoriteRecipes.add(recipe);
        }
    }

    public void addFollowedPerson(String person) {
        if (person != null && !person.isEmpty()) {
            followedPeople.add(person);
        }
    }


}