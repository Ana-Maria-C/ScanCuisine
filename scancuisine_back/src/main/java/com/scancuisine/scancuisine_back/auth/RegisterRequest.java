package com.scancuisine.scancuisine_back.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String firtsName;
    private String lastName;
    private String email;
    private String password;
}
