package com.funnyshare.funnyshare;

import com.funnyshare.funnyshare.configuration.AppConfiguration;
import com.funnyshare.funnyshare.error.ApiError;
import com.funnyshare.funnyshare.file.FileAttachment;
import com.funnyshare.funnyshare.file.FileAttachmentRepository;
import com.funnyshare.funnyshare.file.FileService;
import com.funnyshare.funnyshare.post.Post;
import com.funnyshare.funnyshare.post.PostRepository;
import com.funnyshare.funnyshare.post.PostService;
import com.funnyshare.funnyshare.post.vm.PostVM;
import com.funnyshare.funnyshare.shared.GenericResponse;
import com.funnyshare.funnyshare.user.User;
import com.funnyshare.funnyshare.user.UserRepository;
import com.funnyshare.funnyshare.user.UserService;
import org.apache.commons.io.FileUtils;
import org.hibernate.internal.build.AllowSysOut;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.transaction.TestTransaction;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;
import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

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

    @Autowired
    PostService postService;

    @Autowired
    FileAttachmentRepository fileAttachmentRepository;

    @Autowired
    FileService fileService;

    @Autowired
    AppConfiguration appConfiguration;

    @PersistenceUnit
    private EntityManagerFactory entityManagerFactory;

    @BeforeEach
    public void cleanup() throws IOException {
        fileAttachmentRepository.deleteAll();
        postRepository.deleteAll();
        userRepository.deleteAll();
        testRestTemplate.getRestTemplate().getInterceptors().clear();
        FileUtils.cleanDirectory(new File(appConfiguration.getFullAttachmentsPath()));
    }

    @Test
    public void postPost_whenPostIsValidAndUserIsAuthorized_receiveOk() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = TestUtil.createValidPost();

        ResponseEntity<Object> response = postPost(post, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void postPost_whenPostIsValidAndUserIsUnauthorized_receiveUnauthorized() {
        Post post = TestUtil.createValidPost();
        ResponseEntity<Object> response = postPost(post, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    public void postPost_whenPostIsValidAndUserIsUnauthorized_receiveApiError() {
        Post post = TestUtil.createValidPost();
        ResponseEntity<ApiError> response = postPost(post, ApiError.class);
        assertThat(response.getBody().getStatus()).isEqualTo(HttpStatus.UNAUTHORIZED.value());
    }

    @Test
    public void postPost_whenPostIsValidAndUserIsAuthorized_postSavedToDatabase() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = TestUtil.createValidPost();

        postPost(post, Object.class);

        assertThat(postRepository.count()).isEqualTo(1);
    }

    @Test
    public void postPost_whenPostIsValidAndUserIsAuthorized_postSavedToDatabaseWithTimestamp() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = TestUtil.createValidPost();

        postPost(post, Object.class);

        Post inDB = postRepository.findAll().get(0);

        assertThat(inDB.getTimestamp()).isNotNull();
    }

    @Test
    public void postPost_whenPostContentNullAndUserIsAuthorized_receiveBadRequest() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = new Post();

        ResponseEntity<Object> response = postPost(post, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postPost_whenPostContentLessThan10CharactersAndUserIsAuthorized_receiveBadRequest() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = new Post();
        post.setContent("123456789");

        ResponseEntity<Object> response = postPost(post, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postPost_whenPostContentIs5000CharactersAndUserIsAuthorized_receiveOk() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = new Post();

        String content = IntStream.rangeClosed(1, 5000)
                .mapToObj(i -> "x")
                .collect(Collectors.joining());

        post.setContent(content);

        ResponseEntity<Object> response = postPost(post, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void postPost_whenPostContentMoreThan5000CharactersAndUserIsAuthorized_receiveBadRequest() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = new Post();

        String content = IntStream.rangeClosed(1, 5001)
                .mapToObj(i -> "x")
                .collect(Collectors.joining());

        post.setContent(content);

        ResponseEntity<Object> response = postPost(post, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postPost_whenPostContentNullAndUserIsAuthorized_receiveApiErrorWithValidationErrors() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = new Post();

        ResponseEntity<ApiError> response = postPost(post, ApiError.class);
        Map<String, String> validationErrors = response.getBody().getValidationErrors();

        assertThat(validationErrors.get("content")).isNotNull();
    }

    @Test
    public void postPost_whenPostIsValidAndUserIsAuthorized_postSavedToDatabaseWithAuthUserInfo() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = TestUtil.createValidPost();

        postPost(post, Object.class);

        Post inDB = postRepository.findAll().get(0);

        assertThat(inDB.getUser().getUsername()).isEqualTo("user1");
    }

    @Test
    public void postPost_whenPostIsValidAndUserIsAuthorized_getPostFromUser() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = TestUtil.createValidPost();

        postPost(post, Object.class);

        EntityManager entityManager = entityManagerFactory.createEntityManager();

        User inDBUser = entityManager.find(User.class, user.getId());
        assertThat(inDBUser.getPosts().size()).isEqualTo(1);
    }

    @Test
    public void postPost_whenPostIsValidAndUserIsAuthorized_receivePostVM() {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = TestUtil.createValidPost();

        ResponseEntity<PostVM> response = postPost(post, PostVM.class);
        assertThat(response.getBody().getUser().getUsername()).isEqualTo("user1");
    }

    @Test
    public void getPosts_whenThereAreNoPosts_receiveOk() {
        ResponseEntity<Object> response = getPosts(new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void getPosts_whenThereAreNoPosts_receivePageWithZeroItems() {
        ResponseEntity<TestPage<Object>> response = getPosts(new ParameterizedTypeReference<TestPage<Object>>() {});
        assertThat(response.getBody().getTotalElements()).isEqualTo(0);
    }

    @Test
    public void getPosts_whenThereArePosts_receivePageWithItems() {
        User user = userService.save(TestUtil.createValidUser("user1"));

        IntStream.rangeClosed(1, 3).forEach(i -> postService.save(user, TestUtil.createValidPost()));

        ResponseEntity<TestPage<Object>> response = getPosts(new ParameterizedTypeReference<TestPage<Object>>() {});
        assertThat(response.getBody().getTotalElements()).isEqualTo(3);
    }

    @Test
    public void getPosts_whenThereArePosts_receivePageWithPostVM() {
        User user = userService.save(TestUtil.createValidUser("user1"));

        postService.save(user, TestUtil.createValidPost());

        ResponseEntity<TestPage<PostVM>> response = getPosts(new ParameterizedTypeReference<TestPage<PostVM>>() {});
        PostVM storedPost = response.getBody().getContent().get(0);
        assertThat(storedPost.getUser().getUsername()).isEqualTo(user.getUsername());
    }

    @Test
    public void getPostsOfUser_whenUserExists_receivesOk() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        postService.save(user, TestUtil.createValidPost());

        ResponseEntity<Object> response = getPostsOfUser(user.getUsername(), new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void getPostsOfUser_whenUserDoesNotExists_receivesNotFound() {
        ResponseEntity<Object> response = getPostsOfUser("unknown-user", new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void getPostsOfUser_whenUserExists_receivesPageWithZeroPosts() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        ResponseEntity<TestPage<Object>> response = getPostsOfUser(user.getUsername(), new ParameterizedTypeReference<TestPage<Object>>() {});
        assertThat(response.getBody().getTotalElements()).isEqualTo(0);
    }

    @Test
    public void getPostsOfUser_whenUserExistsWithPosts_receivePageWithPostVM() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        postService.save(user, TestUtil.createValidPost());

        ResponseEntity<TestPage<PostVM>> response = getPostsOfUser(user.getUsername(), new ParameterizedTypeReference<TestPage<PostVM>>() {});
        PostVM storedPost = response.getBody().getContent().get(0);
        assertThat(storedPost.getUser().getUsername()).isEqualTo(user.getUsername());
    }

    @Test
    public void getOldPosts_whenThereAreNoPosts_receiveOk() {
        ResponseEntity<Object> response = getOldPosts(5, new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void getOldPosts_whenThereArePosts_receivePageWithItemsProvidedId() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        Post fourth = postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());

        ResponseEntity<TestPage<Object>> response = getOldPosts(fourth.getId(), new ParameterizedTypeReference<TestPage<Object>>() {});
        assertThat(response.getBody().getTotalElements()).isEqualTo(3);
    }

    @Test
    public void getOldPosts_whenThereArePosts_receivePageWithPostVMBeforeProvidedId() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        Post fourth = postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());

        ResponseEntity<TestPage<PostVM>> response = getOldPosts(fourth.getId(), new ParameterizedTypeReference<TestPage<PostVM>>() {});
        assertThat(response.getBody().getTotalElements()).isEqualTo(3);
    }

    @Test
    public void getOldPosts_whenUserExistsThereAreNoPosts_receiveOk() {
        userService.save(TestUtil.createValidUser("user1"));
        ResponseEntity<Object> response = getOldPostsOfUser(5, "user1", new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void getOldPostsOfUser_whenUserExistAndThereArePosts_receivePageWithItemsBeforeProvidedId() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        Post fourth = postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());

        ResponseEntity<TestPage<Object>> response = getOldPostsOfUser(fourth.getId(), "user1", new ParameterizedTypeReference<TestPage<Object>>() {});
        assertThat(response.getBody().getTotalElements()).isEqualTo(3);
    }

    @Test
    public void getOldPostsOfUser_whenUserDoesNotExistThereAreNoPosts_receiveNotFound() {
        ResponseEntity<Object> response = getOldPostsOfUser(5, "user1", new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void getOldPostsOfUser_whenUserExistAndThereAreNoPosts_receivePageWithZeroItemsBeforeProvidedId() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        Post fourth = postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());

        userService.save(TestUtil.createValidUser("user2"));

        ResponseEntity<TestPage<PostVM>> response = getOldPostsOfUser(fourth.getId(), "user2", new ParameterizedTypeReference<TestPage<PostVM>>() {});
        assertThat(response.getBody().getTotalElements()).isEqualTo(0);
    }

    @Test
    public void getNewPosts_whenThereArePosts_receiveListOfItemsAfterProvidedId() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        Post fourth = postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());

        ResponseEntity<List<Object>> response = getNewPosts(fourth.getId(), new ParameterizedTypeReference<List<Object>>() {});
        assertThat(response.getBody().size()).isEqualTo(1);
    }

    @Test
    public void getNewPosts_whenThereArePosts_receiveListOfPostVMAfterProvidedId() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        Post fourth = postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());

        ResponseEntity<List<PostVM>> response = getNewPosts(fourth.getId(), new ParameterizedTypeReference<List<PostVM>>() {});
        assertThat(response.getBody().get(0).getDate()).isGreaterThan(0);
    }

    @Test
    public void getNewPostsOfUser_whenUserExistThereAreNoHoaxes_receiveOk() {
        userService.save(TestUtil.createValidUser("user1"));
        ResponseEntity<Object> response = getNewPostsOfUser(5, "user1", new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void getNewPostsOfUser_whenUserExistAndThereArePosts_receiveListWithItemsAfterProvidedId() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        Post fourth = postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());

        ResponseEntity<List<Object>> response = getNewPostsOfUser(fourth.getId(), "user1", new ParameterizedTypeReference<List<Object>>() {});
        assertThat(response.getBody().size()).isEqualTo(1);
    }

    @Test
    public void getNewPostsOfUser_whenUserExistAndThereArePosts_receiveListWithPostVMAfterProvidedId() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        Post fourth = postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());

        ResponseEntity<List<PostVM>> response = getNewPostsOfUser(fourth.getId(), "user1", new ParameterizedTypeReference<List<PostVM>>() {});
        assertThat(response.getBody().get(0).getDate()).isGreaterThan(0);
    }


    @Test
    public void getNewPostsOfUser_whenUserDoesNotExistThereAreNoPosts_receiveNotFound() {
        ResponseEntity<Object> response = getNewPostsOfUser(5, "user1", new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void getNewPostsOfUser_whenUserExistAndThereAreNoPosts_receiveListWithZeroItemsAfterProvidedId() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        Post fourth = postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());

        userService.save(TestUtil.createValidUser("user2"));

        ResponseEntity<List<PostVM>> response = getNewPostsOfUser(fourth.getId(), "user2", new ParameterizedTypeReference<List<PostVM>>() {});
        assertThat(response.getBody().size()).isEqualTo(0);
    }

    @Test
    public void getNewPostCount_whenThereArePosts_receiveCountAfterProvidedId() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        Post fourth = postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());

        ResponseEntity<Map<String, Long>> response = getNewPostCount(fourth.getId(), new ParameterizedTypeReference<Map<String, Long>>() {});
        assertThat(response.getBody().get("count")).isEqualTo(1);
    }

    @Test
    public void getNewPostCountOfUser_whenThereArePosts_receiveCountAfterProvidedId() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());
        Post fourth = postService.save(user, TestUtil.createValidPost());
        postService.save(user, TestUtil.createValidPost());

        ResponseEntity<Map<String, Long>> response = getNewPostCountOfUser(fourth.getId(), "user1", new ParameterizedTypeReference<Map<String, Long>>() {});
        assertThat(response.getBody().get("count")).isEqualTo(1);
    }

    @Test
    public void postPost_whenPostHasFileAttachmentAndUserIsAuthorized_fileAttachmentPostRelationIsUpdatedInDatabase() throws IOException {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");

        MultipartFile file = createFile();

        FileAttachment savedFile = fileService.saveAttachment(file);

        Post post = TestUtil.createValidPost();
        post.setAttachment(savedFile);
        ResponseEntity<PostVM> response = postPost(post, PostVM.class);

        FileAttachment inDB = fileAttachmentRepository.findAll().get(0);
        assertThat(inDB.getPost().getId()).isEqualTo(response.getBody().getId());
    }

    @Test
    public void postPost_whenPostHasFileAttachmentAndUserIsAuthorized_receivePostVMWithAttachment() throws IOException {
        userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");

        MultipartFile file = createFile();

        FileAttachment savedFile = fileService.saveAttachment(file);

        Post post = TestUtil.createValidPost();
        post.setAttachment(savedFile);
        ResponseEntity<PostVM> response = postPost(post, PostVM.class);

        assertThat(response.getBody().getAttachment().getName()).isEqualTo(savedFile.getName());
    }

    @Test
    public void deletePost_whenUserIsAuthorized_receiveOk() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = postService.save(user, TestUtil.createValidPost());

        ResponseEntity<Object> response = deletePost(post.getId(), Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

    }

    @Test
    public void deletePost_whenUserIsAuthorized_receiveGenericResponse() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = postService.save(user, TestUtil.createValidPost());

        ResponseEntity<GenericResponse> response = deletePost(post.getId(), GenericResponse.class);
        assertThat(response.getBody().getMessage()).isNotNull();

    }

    @Test
    public void deletePost_whenUserIsAuthorized_hoaxRemovedFromDatabase() {
        User user = userService.save(TestUtil.createValidUser("user1"));
        authenticate("user1");
        Post post = postService.save(user, TestUtil.createValidPost());

        deletePost(post.getId(), Object.class);
        Optional<Post> inDB = postRepository.findById(post.getId());
        assertThat(inDB.isPresent()).isFalse();

    }

    @Test
    public void deletePost_whenUserIsUnAuthorized_receiveUnauthorized() {
        ResponseEntity<Object> response = deletePost(555, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    public <T> ResponseEntity<T> deletePost(long postId, Class<T> responseType){
        return testRestTemplate.exchange(API_1_0_POSTS + "/" + postId, HttpMethod.DELETE, null, responseType);
    }

    public <T> ResponseEntity<T> getNewPostCountOfUser(long hoaxId, String username, ParameterizedTypeReference<T> responseType){
        String path = "/api/1.0/users/" + username + "/posts/" + hoaxId +"?direction=after&count=true";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }


    public <T> ResponseEntity<T> getNewPostCount(long hoaxId, ParameterizedTypeReference<T> responseType){
        String path = API_1_0_POSTS + "/" + hoaxId +"?direction=after&count=true";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    public <T> ResponseEntity<T> getNewPostsOfUser(long hoaxId, String username, ParameterizedTypeReference<T> responseType){
        String path = "/api/1.0/users/" + username + "/posts/" + hoaxId +"?direction=after&sort=id,desc";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    public <T> ResponseEntity<T> getNewPosts(long postId, ParameterizedTypeReference<T> responseType){
        String path = API_1_0_POSTS + "/" + postId +"?direction=after&sort=id,desc";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getOldPosts(long postId, ParameterizedTypeReference<T> responseType) {
        String path = API_1_0_POSTS + "/" + postId + "?direction=before&page=0&size=5&sort=id,desc";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getOldPostsOfUser(long postId, String username, ParameterizedTypeReference<T> responseType) {
        String path = "/api/1.0/users/" + username + "/posts/" + postId + "?direction=before&page=0&size=5&sort=id,desc";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getPostsOfUser(String username, ParameterizedTypeReference<T> responseType) {
        String path = "/api/1.0/users/" + username + "/posts";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getPosts(ParameterizedTypeReference<T> responseType) {
        return testRestTemplate.exchange(API_1_0_POSTS, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> postPost(Post post, Class<T> responseType) {
        return testRestTemplate.postForEntity(API_1_0_POSTS, post, responseType);
    }

    public void authenticate(String username) {
        testRestTemplate.getRestTemplate().getInterceptors().add(new BasicAuthenticationInterceptor(username, "P4ssword"));
    }

    private MultipartFile createFile() throws IOException {
        ClassPathResource imageResource = new ClassPathResource("profile.png");
        byte[] fileAsByte = FileUtils.readFileToByteArray(imageResource.getFile());

        MultipartFile file = new MockMultipartFile("profile.png", fileAsByte);
        return file;
    }

    @AfterEach
    public void cleanupAfter() {
        fileAttachmentRepository.deleteAll();
        postRepository.deleteAll();
    }

}
