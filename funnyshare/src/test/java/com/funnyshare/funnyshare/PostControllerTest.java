package com.funnyshare.funnyshare;

import com.funnyshare.funnyshare.error.ApiError;
import com.funnyshare.funnyshare.post.Post;
import com.funnyshare.funnyshare.post.PostRepository;
import com.funnyshare.funnyshare.user.UserRepository;
import com.funnyshare.funnyshare.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import static org.assertj.core.api.Assertions.*;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class PostControllerTest {

    public static final String API_1_0_POSTS = "/api/1.0/posts";

    @Autowired
    TestRestTemplate testRestTemplate;

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PostRepository postRepository;

    @BeforeEach
    public void cleanup() {
        postRepository.deleteAll();
        userRepository.deleteAll();
        testRestTemplate.getRestTemplate().getInterceptors().clear();
    }

    @Test
    public void postHoax_whenPostIsValidAndUserIsAuthorized_receiveOk() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = TestUtil.createValidPost();

        ResponseEntity<Object> response = postPost(post, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void postHoax_whenPostIsValidAndUserIsUnauthorized_receiveUnauthorized() {
        Post post = TestUtil.createValidPost();
        ResponseEntity<Object> response = postPost(post, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    public void postHoax_whenPostIsValidAndUserIsUnauthorized_receiveApiError() {
        Post post = TestUtil.createValidPost();
        ResponseEntity<ApiError> response = postPost(post, ApiError.class);
        assertThat(response.getBody().getStatus()).isEqualTo(HttpStatus.UNAUTHORIZED.value());
    }

    @Test
    public void postHoax_whenPostIsValidAndUserIsAuthorized_hoaxSavedToDatabase() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = TestUtil.createValidPost();

        postPost(post, Object.class);

        assertThat(postRepository.count()).isEqualTo(1);
    }

    @Test
    public void postHoax_whenPostIsValidAndUserIsAuthorized_hoaxSavedToDatabaseWithTimestamp() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = TestUtil.createValidPost();

        postPost(post, Object.class);

        Post inDB = postRepository.findAll().get(0);

        assertThat(inDB.getTimestamp()).isNotNull();
    }

    private <T> ResponseEntity<T> postPost(Post post, Class<T> responseType) {
        return testRestTemplate.postForEntity(API_1_0_POSTS, post, responseType);
    }

    public void authenticate(String username) {
        testRestTemplate.getRestTemplate().getInterceptors().add(new BasicAuthenticationInterceptor(username, "P4ssword"));
    }

}
