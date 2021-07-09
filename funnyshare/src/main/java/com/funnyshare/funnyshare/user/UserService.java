package com.funnyshare.funnyshare.user;

import com.funnyshare.funnyshare.error.NotFoundException;
import com.funnyshare.funnyshare.file.FileService;
import com.funnyshare.funnyshare.user.vm.UserUpdateVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.UUID;

@Service
public class UserService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private FileService fileService;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, FileService fileService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileService = fileService;
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

        if (userUpdate.getImage() != null) {
            String savedImageName = null;
            try {
                savedImageName = fileService.saveProfileImage(userUpdate.getImage());
                fileService.deleteProfileImage(userInDB.getImage());
                userInDB.setImage(savedImageName);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return userRepository.save(userInDB);
    }
}
