package com.funnyshare.funnyshare.post;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/1.0/posts")
public class PostController {

    @PostMapping
    public void createPost() {

    }
}
