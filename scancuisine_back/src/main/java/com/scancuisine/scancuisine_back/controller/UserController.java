package com.scancuisine.scancuisine_back.controller;

import com.scancuisine.scancuisine_back.config.JwtService;
import com.scancuisine.scancuisine_back.entity.user.User;
import com.scancuisine.scancuisine_back.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;

    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody User user) throws ExecutionException, InterruptedException {
        try {
            String result = userService.createUser(user);
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating user: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<String> getAllUsers() throws ExecutionException, InterruptedException {
       try {
           String result = userService.getAllUsers().toString();
           return ResponseEntity.ok(result);
       } catch (ExecutionException | InterruptedException e) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error getting all users: " + e.getMessage());
       }
    }

    @GetMapping("/token/{token}")
    public ResponseEntity<User> getUserbyToken(@PathVariable String token) throws ExecutionException, InterruptedException {
        String email = jwtService.extractUsername(token);
        String result = String.valueOf(userService.getUserbyEmail(email));
        return ResponseEntity.ok(userService.getUserbyEmail(email));
    }


    @GetMapping("/{email}")
    public ResponseEntity<User> getUserbyEmail(@PathVariable String email) throws ExecutionException, InterruptedException {
        String result = String.valueOf(userService.getUserbyEmail(email));
        return ResponseEntity.ok(userService.getUserbyEmail(email));
    }

    @PutMapping("/{email}")
    public ResponseEntity<String> updateUser(@PathVariable String email, @RequestBody User user) throws ExecutionException, InterruptedException {
        String result = userService.updateUser(email, user);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<String> deleteUser(@PathVariable String email) throws ExecutionException, InterruptedException {
        String result = userService.deleteUser(email);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/followedPeople/{email}")
    public List<User> getFollowedPeople(@PathVariable String email) throws ExecutionException, InterruptedException {
        return userService.getFollowedPeople(email);
    }
    @PutMapping("/{email}/follow/{followerEmail}")
    public ResponseEntity<String> followUser(@PathVariable String email, @PathVariable String followerEmail) throws ExecutionException, InterruptedException {
        String result = userService.followUser(email, followerEmail);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{email}/addFavoriteRecipe/{recipeId}")
    public ResponseEntity<String> addRecipeToFavorite(@PathVariable String email, @PathVariable String recipeId) throws ExecutionException, InterruptedException {
        String result = userService.addRecipeToFavorite(email, recipeId);
        return ResponseEntity.ok(result);
    }

}
