package com.chat.ChatApplication.contoller;

import com.chat.ChatApplication.dto.UserRequest;
import com.chat.ChatApplication.security.JwtUtil;
import com.chat.ChatApplication.store.UserStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin("*")
public class AuthController
{
    private final UserStore userStore;
    private final JwtUtil jwtUtil;

    public AuthController(UserStore userStore, JwtUtil jwtUtil)
    {
        this.userStore = userStore;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/api/signup")
    public ResponseEntity<?> signup(@RequestBody UserRequest request)
    {
        if(userStore.userExists(request.getUsername()))
        {
            return ResponseEntity.badRequest().body("User already exists");
        }

        userStore.saveUser(request.getUsername(), request.getPassword());

        return ResponseEntity.ok("Signup Successful");
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody UserRequest request)
    {
        boolean valid = userStore.validateUser(
                request.getUsername(),
                request.getPassword()
        );

        if(!valid)
        {
            return ResponseEntity.badRequest().body("Invalid Credentials");
        }

        String token = jwtUtil.generateToken(request.getUsername());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("username", request.getUsername());

        return ResponseEntity.ok(response);
    }
}