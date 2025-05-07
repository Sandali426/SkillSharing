package com.example.demo.postmanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

import lombok.Data;

@Data
@Document(collection = "posts")
public class Post {

    @Id
    private String id;

    private String userId;
    private String title;
    private String description;
    private String mediaUrl; // Optional: Image or Video link
    private Date createdAt = new Date();
}
