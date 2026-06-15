# Samvaad - Real-Time Chat Application

## Overview

Samvaad is a real-time chat application built using Spring Boot, WebSocket, STOMP, JWT Authentication, HTML, CSS, and JavaScript. The application enables users to communicate instantly through both global and private chats while providing a modern and responsive user experience.

The project demonstrates real-time bidirectional communication using WebSockets and includes features commonly found in modern messaging platforms such as online user tracking, typing indicators, unread message notifications, and toast alerts.

---

## Features

### Authentication

* User Signup
* User Login
* JWT Token Generation
* Session-based Authentication

### Real-Time Messaging

* Global Chat Room
* Private One-to-One Messaging
* Instant Message Delivery using WebSockets
* STOMP-based Messaging Architecture

### User Presence

* Real-Time Online User Tracking
* User Join Notifications
* User Disconnect Handling

### User Experience Enhancements

* Typing Indicators
* Unread Message Counters
* Global Chat Unread Badge
* Real-Time Toast Notifications
* Responsive Modern UI
* Glassmorphism Design

### Chat Management

* Separate Conversation View for Each User
* Global Chat Message History
* Private Chat Message History During Active Session

---

## Technology Stack

### Backend

* Java 17
* Spring Boot
* Spring WebSocket
* Spring Security
* STOMP Messaging
* JWT Authentication

### Frontend

* HTML5
* CSS3
* JavaScript
* SockJS
* STOMP.js

### Deployment

* Render
* Docker

---

## Architecture

Client Browser
->
SockJS Connection
->
STOMP Protocol
->
Spring WebSocket Endpoint
->
Message Broker
->
Connected Clients

---

## Implemented Functionalities

### Global Chat

Users can participate in a common chat room where messages are instantly broadcast to all connected users.

### Private Chat

Users can send direct messages to specific online users without exposing the conversation to others.

### Typing Indicator

Users receive real-time typing notifications whenever another user is composing a message.

### Online User Tracking

The application maintains a live list of currently connected users and updates all clients when users join or disconnect.

### Notifications

Unread message badges and toast notifications inform users about new messages even when they are viewing another conversation.

---

## Future Enhancements

* Message Persistence using PostgreSQL
* Redis-based Online User Tracking
* Message Read Receipts
* User Profile Pictures
* Group Chats
* File Sharing
* Chat Search Functionality
* Push Notifications

---

## Learning Outcomes

This project helped in understanding:

* WebSocket Communication
* STOMP Messaging Protocol
* Real-Time Event Handling
* Spring Security Basics
* JWT Authentication
* Frontend and Backend Integration
* Deployment using Docker and Render
* Real-Time UI Updates

---

## Author

Ayush Saxena

Software Developer | Java | Spring Boot | WebSocket | REST APIs
