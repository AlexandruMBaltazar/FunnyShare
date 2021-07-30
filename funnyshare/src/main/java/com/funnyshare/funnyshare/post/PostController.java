package com.funnyshare.funnyshare.post;

import com.funnyshare.funnyshare.shared.CurrentUser;
import com.funnyshare.funnyshare.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/1.0/posts")
public class PostController {

    private PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public void createPost(@RequestBody @Valid Post post, @CurrentUser User user) {
        postService.save(user, post);
    }

    @GetMapping
    public Page<?> getAllPosts(Pageable pageable) {
        return postService.getAllPosts(pageable);
    }
}
