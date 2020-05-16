package com.hansung.web.dto;

import javax.validation.constraints.NotBlank;

import lombok.ToString;

@ToString
public class LoginRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.username = usernameOrEmail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}