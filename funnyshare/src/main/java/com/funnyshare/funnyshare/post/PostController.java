package com.funnyshare.funnyshare.post;

import com.funnyshare.funnyshare.post.vm.PostVM;
import com.funnyshare.funnyshare.shared.CurrentUser;
import com.funnyshare.funnyshare.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/1.0")
public class PostController {

    private PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping("/posts")
    public PostVM createPost(@RequestBody @Valid Post post, @CurrentUser User user) {
        return new PostVM(postService.save(user, post));
    }

    @GetMapping("/posts")
    public Page<PostVM> getAllPosts(Pageable pageable) {
        return postService.getAllPosts(pageable).map(PostVM::new);
    }

    @GetMapping("/users/{username}/posts")
    public Page<PostVM> getPostsOfUser(@PathVariable String username, Pageable pageable) {
        return postService.getPostsOfUser(username, pageable).map(PostVM::new);
    }

    @GetMapping("/posts/{id:[0-9]+}")
    public Page<PostVM> getPostsRelative(@PathVariable long id, Pageable pageable) {
        return postService.getOldPosts(id, pageable).map(PostVM::new);
    }

    @GetMapping("/users/{username}/posts/{id:[0-9]+}")
    public Page<PostVM> getPostsRelativeForUser(@PathVariable String username, @PathVariable long id, Pageable pageable) {
        return postService.getOldPostsOfUser(id, username, pageable).map(PostVM::new);
    }
}
