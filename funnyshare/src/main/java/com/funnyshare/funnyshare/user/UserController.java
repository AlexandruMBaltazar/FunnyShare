package com.funnyshare.funnyshare.user;

import com.fasterxml.jackson.annotation.JsonView;
import com.funnyshare.funnyshare.error.ApiError;
import com.funnyshare.funnyshare.shared.CurrentUser;
import com.funnyshare.funnyshare.shared.GenericResponse;
import com.funnyshare.funnyshare.user.vm.UserUpdateVM;
import com.funnyshare.funnyshare.user.vm.UserVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/1.0/users")
public class UserController {

    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public GenericResponse createUser(@Valid @RequestBody User user) {
        userService.save(user);
        return new GenericResponse("User Saved");
    }

    @GetMapping
    public Page<UserVM> getUsers(@CurrentUser User loggedInUser, Pageable pageable) {
       return userService.getUsers(loggedInUser, pageable).map(UserVM::new);
    }

    @GetMapping("/{username}")
    public UserVM getUserByName(@PathVariable String username) {
        User user = userService.getByUsername(username);
        return new UserVM(user);
    }

    @PutMapping("/{id:[0-9]+}")
    @PreAuthorize("#id == principal.id")
    public UserVM updateUser(@PathVariable long id, @Valid @RequestBody(required = false) UserUpdateVM userUpdate) {
        User updatedUser = userService.update(id, userUpdate);
        return new UserVM(updatedUser);
    }

    @ExceptionHandler({MethodArgumentNotValidException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleValidationException(MethodArgumentNotValidException exception, HttpServletRequest request) {
        ApiError apiError = new ApiError(400, "Validation Error", request.getServletPath());

        BindingResult bindingResult = exception.getBindingResult();

        Map<String, String> validationErrors = new HashMap<>();

        for (FieldError fieldError : bindingResult.getFieldErrors()) {
            validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        apiError.setValidationErrors(validationErrors);

        return apiError;
    }

}
