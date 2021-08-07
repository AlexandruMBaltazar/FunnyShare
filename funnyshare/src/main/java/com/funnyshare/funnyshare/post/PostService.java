package com.funnyshare.funnyshare.post;

import com.funnyshare.funnyshare.user.User;
import com.funnyshare.funnyshare.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class PostService {

    private PostRepository postRepository;
    private UserService userService;

    @Autowired
    public PostService(PostRepository postRepository, UserService userService) {
        this.postRepository = postRepository;
        this.userService = userService;
    }

    public Post save(User user, Post post) {
        post.setUser(user);
        post.setTimestamp(new Date());
        return postRepository.save(post);
    }

    public Page<Post> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    public Page<Post> getPostsOfUser(String username, Pageable pageable) {
        User inDB = userService.getByUsername(username);
        return postRepository.findByUser(inDB, pageable);
    }

    public Page<Post> getOldPosts(long id, Pageable pageable) {
        return postRepository.findByIdLessThan(id, pageable);
    }

    public Page<Post> getOldPostsOfUser(long id, String username, Pageable pageable) {
        User inDB = userService.getByUsername(username);
        return postRepository.findByIdLessThanAndUser(id, inDB, pageable);
    }

    public List<Post> getNewPosts(long id, Pageable pageable) {
        return postRepository.findByIdGreaterThan(id, pageable.getSort());
    }
}
