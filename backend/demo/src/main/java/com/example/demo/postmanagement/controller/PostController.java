package com.example.demo.postmanagement.controller;

import com.example.demo.postmanagement.model.Post;
import com.example.demo.postmanagement.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public Post createPost(@RequestBody Post post) {
        return postService.createPost(post);
    }

    @PostMapping("/upload")
    public Post createPostWithFile(
            @RequestParam("userId") String userId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        return postService.createPostWithFile(userId, title, description, file);
    }


    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{postId}")
    public Post getPostById(@PathVariable String postId) {
        return postService.getPostById(postId);
    }

    // Update Post (only text fields) - JSON Body
    @PutMapping("/{postId}")
    public Post updatePost(
            @PathVariable String postId,
            @RequestBody Post updatedPost) {
        return postService.updatePost(postId, updatedPost);
    }

    // Update Post (text + file) - Form-Data Body
    @PutMapping("/update-with-file/{postId}")
    public Post updatePostWithFile(
            @PathVariable String postId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        return postService.updatePostWithFile(postId, title, description, file);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId) {
        postService.deletePost(postId);
        return ResponseEntity.ok().body("{\"message\": \"Post deleted successfully.\"}");
    }
}