package com.funnyshare.funnyshare.user;

import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername, String> {

    @Autowired
    UserRepository userRepository;


    @Override
    public boolean isValid(String username, ConstraintValidatorContext constraintValidatorContext) {

        User inDB = userRepository.findByUsername(username);

        if (inDB == null) {
            return  true;
        }

        return false;
    }
}
