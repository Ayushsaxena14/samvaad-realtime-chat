const token = localStorage.getItem("token");

if (!token)
{
    window.location.href = "index.html";
}

const username = localStorage.getItem("username");

document.getElementById("usernameText").innerText =
    username;

document.getElementById("avatar").innerText =
    username.charAt(0).toUpperCase();

let stompClient = null;

let typingTimeout;
let currentChat = "GLOBAL";
let globalMessages=[];
let conversations={};
let unreadCounts = {};
let unreadGlobalCount = 0;

//const socket =
//    new SockJS('http://localhost:8080/chat');
const socket =
    new SockJS('/chat');

stompClient =
    Stomp.over(socket);

stompClient.connect({}, function ()
{
    console.log("Connected");

    /* =========================
       CHAT MESSAGES
    ========================== */

    stompClient.subscribe(
        "/topic/messages",
        function(message)
        {
            const chatMessage =
                JSON.parse(
                    message.body
                );

            globalMessages.push(
                chatMessage
            );

            if(currentChat === "GLOBAL")
            {
                renderCurrentChat();
            }
            else if(
                chatMessage.senderName !==
                username
            )
            {
                unreadGlobalCount++;

                showNotification(
                    "🌍 Global Chat",
                    chatMessage.senderName + ": " + chatMessage.message
                );

                updateGlobalChatBadge();
            }
        }
    );
    stompClient.subscribe(
        "/topic/private-messages",
        function(message)
        {
            const chatMessage =
                JSON.parse(
                    message.body
                );

            const isForMe =
                chatMessage.senderName === username
                ||
                chatMessage.receiverName === username;

            if(!isForMe)
            {
                return;
            }

            const otherUser =
                chatMessage.senderName === username
                    ? chatMessage.receiverName
                    : chatMessage.senderName;

            if(!conversations[otherUser])
            {
                conversations[otherUser] = [];
            }

            conversations[otherUser].push(
                chatMessage
            );

            if(currentChat === otherUser)
            {
                renderCurrentChat();
            }
            else
            {
                unreadCounts[otherUser] =
                    (unreadCounts[otherUser] || 0) + 1;

                showNotification(
                    chatMessage.senderName,
                    chatMessage.message
                );

                renderOnlineUsers(
                    JSON.parse(
                        document.body.dataset.onlineUsers || "[]"
                    )
                );
            }
        }
    );


    /* =========================
       ONLINE USERS
    ========================== */

    stompClient.subscribe(
        "/topic/online-users",
        function (users)
        {
            const onlineUsers =
                JSON.parse(users.body);

            renderOnlineUsers(
                onlineUsers
            );
        }
    );

    /* =========================
       TYPING INDICATOR
    ========================== */

    stompClient.subscribe(
        "/topic/typing",
        function(response)
        {
            console.log(
                        "TYPING EVENT RECEIVED:",
                        response.body
                    );
            const typingUser =
                response.body;

            if(typingUser === username)
            {
                return;
            }

            showTypingIndicator(
                typingUser
            );
        }
    );

    /* =========================
       USER JOIN EVENT
    ========================== */

    setTimeout(() =>
    {
        stompClient.send(
            "/app/userJoined",
            {},
            JSON.stringify({
                senderName: username
            })
        );
    }, 500);
});

function renderCurrentChat()
{
    const chatBox =
        document.getElementById(
            "chat-box"
        );

    chatBox.innerHTML = "";

    let messages = [];

    if(currentChat === "GLOBAL")
    {
        messages =
            globalMessages;
    }
    else
    {
        messages =
            conversations[
                currentChat
            ] || [];
    }

    if(messages.length === 0)
    {
        chatBox.innerHTML =
        `
            <div class="empty-state">

                <div class="empty-icon">

                    💬

                </div>

                <h2>

                    No Messages Yet

                </h2>

            </div>
        `;

        return;
    }

    messages.forEach(
        msg =>
        {
            renderMessage(
                msg
            );
        }
    );

    scrollToBottom();
}

/* =========================
   SEND MESSAGE
========================== */

function sendMessage()
{
    const messageInput =
        document.getElementById("message");

    const message =
        messageInput.value;

    if(message.trim() === "")
    {
        return;
    }

    const chatMessage =
    {
        senderId:
            Math.floor(Math.random() * 1000),

        senderName:
            username,

        receiverName:
            currentChat === "GLOBAL"
                ? null
                : currentChat,

        message:
            message
    };

    if(currentChat === "GLOBAL")
    {
        stompClient.send(
            "/app/sendMessages",
            {},
            JSON.stringify(chatMessage)
        );
    }
    else
    {
        stompClient.send(
            "/app/private-message",
            {},
            JSON.stringify(chatMessage)
        );

    }

    messageInput.value = "";
}

/* =========================
   SHOW MESSAGE
========================== */

function renderMessage(chatMessage)
{
    const chatBox =
        document.getElementById(
            "chat-box"
        );

    const emptyState =
        document.getElementById(
            "emptyState"
        );

    if(emptyState)
    {
        emptyState.style.display =
            "none";
    }

    const messageDiv =
        document.createElement("div");

    const isOwnMessage =
        chatMessage.senderName ===
        username;

    messageDiv.classList.add(
        "message",
        isOwnMessage
            ? "sent"
            : "received"
    );

    const time =
        new Date()
            .toLocaleTimeString(
                [],
                {
                    hour:"2-digit",
                    minute:"2-digit"
                }
            );

    messageDiv.innerHTML = `

        ${
            !isOwnMessage
            ?
            `<div class="sender-name">
                ${chatMessage.senderName}
            </div>`
            :
            ""
        }

        <div class="message-text">

            ${chatMessage.message}

        </div>

        <div class="time">

            ${time}

        </div>

    `;

    chatBox.appendChild(
        messageDiv
    );

    scrollToBottom();
}

/* =========================
   ONLINE USERS
========================== */

function renderOnlineUsers(users)
{
    document.body.dataset.onlineUsers =
        JSON.stringify(users);
    const usersList =
        document.getElementById(
            "usersList"
        );

    const userCount =
        document.getElementById(
            "userCount"
        );

    const onlineCountText =
        document.getElementById(
            "onlineCountText"
        );

    usersList.innerHTML = "";

   if(userCount)
   {
       userCount.innerText =
           users.filter(
               user => user !== username
           ).length;
   }

    const otherUsersCount =
        users.filter(
            user => user !== username
        ).length;

    onlineCountText.innerText =
        otherUsersCount +
        (
            users.length === 1
            ? " User Online"
            : " Users Online"
        );

    users.forEach(user =>
    {
        if(user === username)
        {
            return;
        }
        const userDiv =
            document.createElement(
                "div"
            );

        userDiv.classList.add(
            "user-item"
        );
        userDiv.onclick = function()
        {
            currentChat = user;
            unreadCounts[user] = 0;
            renderOnlineUsers(users);
            renderCurrentChat();

            document
                .getElementById(
                    "chatTitle"
                )
                .innerText =
                    "Chat with " + user;

            document
                .querySelectorAll(
                    ".user-item"
                )
                .forEach(item =>
                    item.classList.remove(
                        "selected-chat"
                    ));

            document
                .getElementById(
                    "globalChat"
                )
                .classList.remove(
                    "selected-chat"
                );

            userDiv.classList.add(
                "selected-chat"
            );
        };

        userDiv.innerHTML = `
            <div class="user-dot"></div>

            <div class="user-name">
                ${user}
            </div>

            ${
                unreadCounts[user]
                ?
                `<div class="unread-badge">
                    ${unreadCounts[user]}
                 </div>`
                :
                ""
            }
        `;

        usersList.appendChild(
            userDiv
        );
    });
}

/* =========================
   TYPING EVENT
========================== */

document
    .getElementById("message")
    .addEventListener(
        "input",
        function()
        {
            stompClient.send(
                "/app/typing",
                {},
                JSON.stringify({
                    senderName:
                        username
                })
            );
        }
    );

/* =========================
   SHOW TYPING INDICATOR
========================== */

function showTypingIndicator(
    typingUser
)
{
    const typingIndicator =
        document.getElementById(
            "typingIndicator"
        );

    typingIndicator.innerText =
        typingUser +
        " is typing...";

    typingIndicator.style.display =
        "block";

    clearTimeout(
        typingTimeout
    );

    typingTimeout =
        setTimeout(
            () =>
            {
                typingIndicator.style.display =
                    "none";
            },
            10000
        );
}

function updateGlobalChatBadge()
{
    const globalChat =
        document.getElementById(
            "globalChat"
        );

    let badge =
        document.getElementById(
            "globalUnreadBadge"
        );

    if(!badge)
    {
        badge =
            document.createElement(
                "div"
            );

        badge.id =
            "globalUnreadBadge";

        badge.className =
            "unread-badge";

        globalChat.appendChild(
            badge
        );
    }

    if(unreadGlobalCount > 0)
    {
        badge.innerText =
            unreadGlobalCount;

        badge.style.display =
            "flex";
    }
    else
    {
        badge.style.display =
            "none";
    }
}

function showNotification(
    sender,
    message
)
{
    const container =
        document.getElementById(
            "notificationContainer"
        );

    const toast =
        document.createElement(
            "div"
        );

    toast.classList.add(
        "notification-toast"
    );

    toast.innerHTML = `
        <div class="notification-title">
            ${sender}
        </div>

        <div class="notification-message">
            ${message}
        </div>
    `;

    container.appendChild(
        toast
    );

    setTimeout(
        () =>
        {
            toast.remove();
        },
        8000
    );
}

/* =========================
   AUTO SCROLL
========================== */

function scrollToBottom()
{
    const chatBox =
        document.getElementById(
            "chat-box"
        );

    chatBox.scrollTop =
        chatBox.scrollHeight;
}

/* =========================
   LOGOUT
========================== */

function logout()
{
    localStorage.clear();

    sessionStorage.clear();

    window.location.href =
        "index.html";
}

/* =========================
   ENTER KEY SEND
========================== */

document
    .getElementById("message")
    .addEventListener(
        "keypress",
        function(event)
        {
            if(event.key === "Enter")
            {
                sendMessage();
            }
        }
    );

document
    .getElementById(
        "globalChat"
    )
    .onclick = function()
{
    currentChat =
        "GLOBAL";

    unreadGlobalCount = 0;

    updateGlobalChatBadge();

    renderCurrentChat();

    document
        .getElementById(
            "chatTitle"
        )
        .innerText =
            "Global Chat";

    document
        .querySelectorAll(
            ".user-item"
        )
        .forEach(item =>
            item.classList.remove(
                "selected-chat"
            ));

    this.classList.add(
        "selected-chat"
    );
};
