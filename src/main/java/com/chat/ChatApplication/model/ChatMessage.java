package com.chat.ChatApplication.model;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChatMessage
{
    public int senderId;
    public String senderName;
    public String message;
    public String receiverName;
    public String messageType;
}


