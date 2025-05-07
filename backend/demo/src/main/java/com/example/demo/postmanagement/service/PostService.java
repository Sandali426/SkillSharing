package com.example.demo.postmanagement.service;

import com.example.demo.postmanagement.model.Post;
import com.example.demo.postmanagement.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public Post createPost(Post post) {
        post.setCreatedAt(new Date());
        return postRepository.save(post);
    }

    public Post createPostWithFile(String userId, String title, String description, MultipartFile file) {
        String mediaUrl = null;

        if (file != null && !file.isEmpty()) {
            mediaUrl = saveUploadedFile(file);
        }

        Post post = new Post();
        post.setUserId(userId);
        post.setTitle(title);
        post.setDescription(description);
        post.setMediaUrl(mediaUrl);
        post.setCreatedAt(new Date());

        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(String postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    // Update Post (only title and description via JSON)
    public Post updatePost(String postId, Post updatedPost) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setTitle(updatedPost.getTitle());
        post.setDescription(updatedPost.getDescription());
        post.setMediaUrl(updatedPost.getMediaUrl());

        return postRepository.save(post);
    }

    // Update Post with new file (Form-Data)
    public Post updatePostWithFile(String postId, String title, String description, MultipartFile file) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setTitle(title);
        post.setDescription(description);

        if (file != null && !file.isEmpty()) {
            post.setMediaUrl(saveUploadedFile(file));
        }

        return postRepository.save(post);
    }

    // Save file method (used by both create and update)
    private String saveUploadedFile(MultipartFile file) {
        try {
            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;
            File uploadFolder = new File(uploadDir);
            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }

            String originalFilename = file.getOriginalFilename().replaceAll(" ", "_");
            String uniqueFileName = System.currentTimeMillis() + "_" + originalFilename;
            String filePath = uploadDir + uniqueFileName;
            file.transferTo(new File(filePath));

            return "/uploads/" + uniqueFileName;
        } catch (IOException e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    public void deletePost(String postId) {
        postRepository.deleteById(postId);
    }
}
