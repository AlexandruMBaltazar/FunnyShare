package com.funnyshare.funnyshare.user;

import com.funnyshare.funnyshare.error.NotFoundException;
import com.funnyshare.funnyshare.user.vm.UserUpdateVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Page<User> getUsers(User loggedInUser, Pageable pageable) {

        if (loggedInUser != null) {
            return userRepository.findByUsernameIsNot(loggedInUser.getUsername(), pageable);
        }

        return userRepository.findAll(pageable);
    }

    public User getByUsername(String username) {
        User user =  userRepository.findByUsername(username);

        if (user == null) {
            throw new NotFoundException(username + " not found");
        }

        return user;
    }

    public User update(long id, UserUpdateVM userUpdate) {
        User userInDB = userRepository.getOne(id);

        userInDB.setDisplayName(userUpdate.getDisplayName());

        String savedImageName = userInDB.getUsername() + UUID.randomUUID().toString().replaceAll("-", "");
        userInDB.setImage(savedImageName);

        return userRepository.save(userInDB);
    }
}
