package com.chat.ChatApplication.config;

import com.chat.ChatApplication.service.OnlineUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener
{
    @Autowired
    private OnlineUserService onlineUserService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(
            SessionDisconnectEvent event
    )
    {
        StompHeaderAccessor headerAccessor =
                StompHeaderAccessor.wrap(
                        event.getMessage()
                );

        String username =
                (String) headerAccessor
                        .getSessionAttributes()
                        .get("username");

        if(username != null)
        {
            onlineUserService.removeUser(username);

            messagingTemplate.convertAndSend(
                    "/topic/online-users",
                    onlineUserService.getOnlineUsers()
            );

            System.out.println(
                    username + " disconnected"
            );
        }
    }
}