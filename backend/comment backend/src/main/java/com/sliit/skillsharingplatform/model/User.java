package com.sliit.skillsharingplatform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private List<String> followers = new ArrayList<>();
    private List<String> following = new ArrayList<>();

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public List<String> getFollowers() { return followers; }
    public void setFollowers(List<String> followers) { this.followers = followers; }
    public List<String> getFollowing() { return following; }
    public void setFollowing(List<String> following) { this.following = following; }
}