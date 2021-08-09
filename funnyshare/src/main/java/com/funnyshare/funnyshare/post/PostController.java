package com.funnyshare.funnyshare.post;

import com.funnyshare.funnyshare.post.vm.PostVM;
import com.funnyshare.funnyshare.shared.CurrentUser;
import com.funnyshare.funnyshare.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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

    @GetMapping({"/posts/{id:[0-9]+}", "/users/{username}/posts/{id:[0-9]+}"})
    public ResponseEntity<?> getPostsRelative(@PathVariable long id, Pageable pageable,
                                              @PathVariable(required = false) String username,
                                              @RequestParam(name = "direction", defaultValue = "after") String direction,
                                              @RequestParam(name = "count", defaultValue = "false", required = false) boolean count
    ) {
        if (!direction.equalsIgnoreCase("after")) {
            return ResponseEntity.ok(postService.getOldPosts(id, username, pageable).map(PostVM::new));
        }

        if (count) {
            long newPostCount = postService.getNewPostsCount(id, username);
            return  ResponseEntity.ok(Collections.singletonMap("count", newPostCount));
        }

        List<PostVM> newPosts = postService.getNewPosts(id, username, pageable)
                .stream()
                .map(PostVM::new).collect(Collectors.toList());

        return ResponseEntity.ok(newPosts);
    }
}
