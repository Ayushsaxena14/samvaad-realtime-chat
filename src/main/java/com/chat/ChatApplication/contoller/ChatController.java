package com.chat.ChatApplication.contoller;

import com.chat.ChatApplication.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import com.chat.ChatApplication.service.OnlineUserService;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Controller
public class ChatController
{
    private final OnlineUserService onlineUserService;

    private final SimpMessagingTemplate messagingTemplate;
    public ChatController(
            OnlineUserService onlineUserService,
            SimpMessagingTemplate messagingTemplate
    )
    {
        this.onlineUserService = onlineUserService;
        this.messagingTemplate = messagingTemplate;
    }
    @MessageMapping("/sendMessages")
    @SendTo("/topic/messages")
    public ChatMessage send(ChatMessage message)
    {
        return message;
    }
    @MessageMapping("/private-message")
    @SendTo("/topic/private-messages")
    public ChatMessage privateMessage(
            ChatMessage message
    )
    {
        System.out.println(
                "PRIVATE MESSAGE : "
                        + message.getSenderName()
                        + " -> "
                        + message.getReceiverName()
        );

        return message;
    }

    @GetMapping("chat")
    public String chat()
    {
        return "Chat";
    }


    @MessageMapping("/userJoined")
    public void userJoined(
            ChatMessage message,
            SimpMessageHeaderAccessor headerAccessor
    )
    {
        System.out.println(
                "JOIN EVENT RECEIVED : "
                        + message.getSenderName()
        );

        headerAccessor
                .getSessionAttributes()
                .put(
                        "username",
                        message.getSenderName()
                );

        onlineUserService.addUser(
                message.getSenderName()
        );

        System.out.println(
                "ONLINE USERS : "
                        + onlineUserService.getOnlineUsers()
        );

        messagingTemplate.convertAndSend(
                "/topic/online-users",
                onlineUserService.getOnlineUsers()
        );
    }
    @MessageMapping("/typing")
    public void typing(ChatMessage message)
    {
//        System.out.println(
//                "TYPING EVENT : "
//                        + message.getSenderName()
//        );
        messagingTemplate.convertAndSend(
                "/topic/typing",
                message.getSenderName()
        );
    }
}


