package com.sliit.skillsharingplatform.repository;

import com.sliit.skillsharingplatform.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post, String> {
}