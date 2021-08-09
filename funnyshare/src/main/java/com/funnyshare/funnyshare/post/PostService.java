package com.funnyshare.funnyshare.post;

import com.funnyshare.funnyshare.user.User;
import com.funnyshare.funnyshare.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
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

    public Page<Post> getOldPosts(long id, String username, Pageable pageable) {
        Specification<Post> spec = Specification.where(idLessThan(id));

        if (username != null) {
            User inDB = userService.getByUsername(username);
            spec = spec.and(userIs(inDB));
        }

        return postRepository.findAll(spec, pageable);
    }

    public List<Post> getNewPosts(long id, String username, Pageable pageable) {
        Specification<Post> spec = Specification.where(idGreaterThan(id));

        if (username != null) {
            User inDB = userService.getByUsername(username);
            spec = spec.and(userIs(inDB));
        }

        return postRepository.findAll(spec, pageable.getSort());
    }

    public long getNewPostsCount(long id, String username) {
        Specification<Post> spec = Specification.where(idGreaterThan(id));

        if (username != null) {
            User inDB = userService.getByUsername(username);
            spec = spec.and(userIs(inDB));
        }

        return postRepository.count(spec);
    }

    private Specification<Post> userIs(User user) {
        return (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.equal(root.get("user"), user);
    }

    private Specification<Post> idLessThan(long id) {
        return (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.lessThan(root.get("id"), id);
    }

    private Specification<Post> idGreaterThan(long id) {
        return (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.greaterThan(root.get("id"), id);
    }

}
