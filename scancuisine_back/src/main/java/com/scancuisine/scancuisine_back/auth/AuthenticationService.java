package com.scancuisine.scancuisine_back.auth;

import com.scancuisine.scancuisine_back.config.JwtService;
import com.scancuisine.scancuisine_back.entity.user.Role;
import com.scancuisine.scancuisine_back.entity.user.User;
import com.scancuisine.scancuisine_back.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest registerRequest) throws ExecutionException, InterruptedException {
        // Create a new instance of your application's User entity
        User user = new User();
        if(registerRequest.getEmail().equals("") || registerRequest.getFirstName().equals("") || registerRequest.getLastName().equals("") || registerRequest.getPassword().equals("")){
            return AuthenticationResponse.builder().errorMessage("All fields must be filled!").build();
        }
        if(registerRequest.getEmail().contains(" ") || !(registerRequest.getEmail().contains("@") && registerRequest.getEmail().contains("."))){
            return AuthenticationResponse.builder().errorMessage("Incorrect email!").build();
        }
        user.setEmail(registerRequest.getEmail());
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(Role.USER);

        userService.createUser(user);

        // Generate JWT token
        String jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        try {

            User user = userService.getUserbyEmail(authenticationRequest.getEmail());
            if (user == null) {
                return AuthenticationResponse.builder().errorMessage("User not found").build();
            }
            if (!passwordEncoder.matches(authenticationRequest.getPassword(), user.getPassword())) {
                return AuthenticationResponse.builder().errorMessage(" Incorrect password ").build();
            }

            // Authenticate the user

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authenticationRequest.getEmail(),
                            authenticationRequest.getPassword()
                    )
            );

            // Retrieve the UserDetails from the authentication
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Generate JWT token
            String jwtToken = jwtService.generateToken(userDetails);

            return AuthenticationResponse.builder().token(jwtToken).build();
        } catch (Exception e) {
            e.printStackTrace();
            return AuthenticationResponse.builder().errorMessage("Authentication failed").build();
        }
    }
}
