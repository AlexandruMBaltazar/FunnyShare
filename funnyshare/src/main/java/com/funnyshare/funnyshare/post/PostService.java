package com.funnyshare.funnyshare.post;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class PostService {

    private PostRepository postRepository;

    @Autowired
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public void save(Post post) {
        post.setTimestamp(new Date());
        postRepository.save(post);
    }
}
