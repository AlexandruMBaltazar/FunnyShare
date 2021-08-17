package com.funnyshare.funnyshare.post;

import com.funnyshare.funnyshare.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class PostSecurityService {

    PostRepository postRepository;

    @Autowired
    public PostSecurityService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public boolean isAllowedToDelete(long postId, User loggedInUser) {
        Optional<Post> optionalPost = postRepository.findById(postId);

        if (optionalPost.isPresent()) {
            Post inDB = optionalPost.get();
            return inDB.getUser().getId() == loggedInUser.getId();
        }

        return false;
    }
}
