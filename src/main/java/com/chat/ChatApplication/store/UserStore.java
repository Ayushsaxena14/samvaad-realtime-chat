package com.chat.ChatApplication.store;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class UserStore
{
    private final Map<String, String> users = new HashMap<>();

    public void saveUser(String username, String password)
    {
        users.put(username, password);
    }

    public boolean userExists(String username)
    {
        return users.containsKey(username);
    }

    public boolean validateUser(String username, String password)
    {
        return users.containsKey(username)
                && users.get(username).equals(password);
    }
}