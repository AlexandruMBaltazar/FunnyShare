package com.funnyshare.funnyshare;

import com.funnyshare.funnyshare.post.Post;
import com.funnyshare.funnyshare.user.User;

public class TestUtil {

    public static User createValidUser() {
        User user = new User();

        user.setUsername("test-user");
        user.setDisplayName("test-display");
        user.setPassword("P4ssword");
        user.setImage("profile-image.png");

        return user;
    }

    public static User createValidUser(String username) {
        User user = new User();
        user.setUsername(username);
        user.setDisplayName("test-display");
        user.setPassword("P4ssword");
        user.setImage("profile-image.png");
        return user;
    }

    public static Post createValidPost() {
        Post post = new Post();
        post.setContent("test content for test post");
        return post;
    }
}
