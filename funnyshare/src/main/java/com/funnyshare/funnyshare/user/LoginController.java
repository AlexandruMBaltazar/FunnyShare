package com.funnyshare.funnyshare.user;

import com.fasterxml.jackson.annotation.JsonView;
import com.funnyshare.funnyshare.error.ApiError;
import com.funnyshare.funnyshare.shared.CurrentUser;
import com.funnyshare.funnyshare.user.vm.UserVM;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/1.0/login")
public class LoginController {

    @PostMapping
    public UserVM handleLogin(@CurrentUser User loggedInUser) {
        return new UserVM(loggedInUser);
    }

    @ExceptionHandler({AccessDeniedException.class})
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiError handleAccessDeniedException() {
        return new ApiError(401, "Access error", "/api/1.0/login");
    }

}
