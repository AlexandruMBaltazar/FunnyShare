package com.funnyshare.funnyshare;

import com.funnyshare.funnyshare.user.User;
import com.funnyshare.funnyshare.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
public class UserRepositoryTest {

    @Autowired
    TestEntityManager testEntityManager;

    @Autowired
    UserRepository userRepository;

    @Test
    public void findByUsername_whenUserExists_returnsUser() {
        User user = createValidUser();

        testEntityManager.persist(user);

        User inDB = userRepository.findByUsername(user.getUsername());

        assertThat(inDB).isNotNull();
    }

    @Test
    public void findByUsername_whenUserDoesNotExists_returnsNull() {
        User user = createValidUser();

        User inDB = userRepository.findByUsername(user.getUsername());

        assertThat(inDB).isNull();
    }

    private User createValidUser() {
        User user = new User();

        user.setUsername("test-user");
        user.setDisplayName("test-display");
        user.setPassword("P4ssword");
        return user;
    }
}
