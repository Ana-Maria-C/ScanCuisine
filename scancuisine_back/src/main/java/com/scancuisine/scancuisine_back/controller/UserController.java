package com.scancuisine.scancuisine_back.controller;

import com.scancuisine.scancuisine_back.entity.user.User;
import com.scancuisine.scancuisine_back.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    @PostMapping
    public String createUser(@RequestBody User user) throws ExecutionException, InterruptedException {
        return userService.createUser(user);
    }

    @GetMapping("/all")
    public List<User> getAllUsers() throws ExecutionException, InterruptedException {
        return userService.getAllUsers();
    }

    @GetMapping("/{email}")
    public User getUserbyEmail(@PathVariable String email) throws ExecutionException, InterruptedException {
        return userService.getUserbyEmail(email);
    }

    @PutMapping("/{email}")
    public String updateUser(@PathVariable String email, @RequestBody User user) throws ExecutionException, InterruptedException {
        return userService.updateUser(email, user);
    }

    @DeleteMapping("/{email}")
    public String deleteUser(@PathVariable String email) throws ExecutionException, InterruptedException {
        return userService.deleteUser(email);
    }

    @PutMapping("/{email}/follow/{followerEmail}")
    public String followUser(@PathVariable String email, @PathVariable String followerEmail) throws ExecutionException, InterruptedException {
        return userService.followUser(email, followerEmail);
    }

}
