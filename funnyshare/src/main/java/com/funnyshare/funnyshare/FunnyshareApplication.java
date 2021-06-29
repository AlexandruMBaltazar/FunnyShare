package com.funnyshare.funnyshare;

import com.funnyshare.funnyshare.user.User;
import com.funnyshare.funnyshare.user.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

import java.util.stream.IntStream;

@SpringBootApplication
public class FunnyshareApplication {

    public static void main(String[] args) {
        SpringApplication.run(FunnyshareApplication.class, args);
    }

    @Bean
    @Profile("!test")
    CommandLineRunner run(UserService userService) {
        return args -> IntStream.rangeClosed(1, 15)
                .mapToObj(i -> {
                    User user = new User();
                    user.setUsername("user" + i);
                    user.setDisplayName("display" + i);
                    user.setPassword("P4ssword");

                    return user;
                })
                .forEach(userService::save);
    }

}
