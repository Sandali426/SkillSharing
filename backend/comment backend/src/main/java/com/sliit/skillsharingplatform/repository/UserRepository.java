package com.sliit.skillsharingplatform.repository;

import com.sliit.skillsharingplatform.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}