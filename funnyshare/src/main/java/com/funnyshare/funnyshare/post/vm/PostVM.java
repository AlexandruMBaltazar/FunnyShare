package com.funnyshare.funnyshare.post.vm;

import com.funnyshare.funnyshare.post.Post;
import com.funnyshare.funnyshare.user.vm.UserVM;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PostVM {

    private long id;

    private String content;

    private long date;

    private UserVM user;

    public PostVM(Post post) {
        this.setId(post.getId());
        this.setContent(post.getContent());
        this.setDate(post.getTimestamp().getTime());
        this.setUser(new UserVM(post.getUser()));
    }
}
