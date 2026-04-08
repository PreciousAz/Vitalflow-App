
var appiontmentList = [];
var contactList = [];
var messageLists = [];

function loadUsers(tmpUsers) {
    const list = document.querySelector('.contacts');
    list.innerHTML = '';
    if (tmpUsers.length > 0) {
        tmpUsers.forEach((user, index) => {
            const li = document.createElement('li');
            li.className = 'contact' + (index === 0 ? ' active' : '');
            li.innerHTML = `
      <img src="http://localhost:8000${user?.profile_image_url}" />
      <div>
        <p class="name">${user?.doctor_name}</p>
        <p class="preview">${shortenText(user?.last_message, 15)}</p>
      </div>
      <span class="time">${formatChatTime(user?.last_message_time)}</span>
      ${user?.online ? '<span class="status-dot green"></span>' : ''}
    `;
            li.addEventListener('click', () => switchUser(index));
            list.appendChild(li);
        });
    }

}

/* function loadUsers(tmpUsers) {
    const list = document.querySelector('.contacts');
    list.innerHTML = '';
    tmpUsers.forEach((user, index) => {
        const li = document.createElement('li');
        li.className = 'contact' + (index === 0 ? ' active' : '');
        li.innerHTML = `
      <img src="${user.avatar}" />
      <div>
        <p class="name">${user.name}</p>
        <p class="preview">${user.lastMessage}</p>
      </div>
      <span class="time">${user.lastSeen}</span>
      ${user.online ? '<span class="status-dot green"></span>' : ''}
    `;
        li.addEventListener('click', () => switchUser(index));
        list.appendChild(li);
    });
} */

async function fetchMessagesByUser(userId) {
    const response = await fetch(`${globalVariables.apiUrl}chat/user/${userId}`);
    const chatList = await response.json();
    if (chatList.success) {
        const tempList = chatList.data;
        return tempList
    } else {
        return [];
    }
}

async function loadUserAppointment(userId) {
    const response = await fetch(`${globalVariables.apiUrl}appointment/user/${userId}/doctor`);
    const result = await response.json();
    if (result.success) {
        return result.data;
    } else {
        return [];
    }
}

async function loadUserAllMessages(userId) {
    const response = await fetch(`${globalVariables.apiUrl}chat/all/${userId}`);
    const chats = await response.json();
    if (chats.success) {
        return chats.data;
    } else {
        return [];
    }
}

async function loadUserList() {
    try {
        const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
        if (user) {
            const appointList = await loadUserAppointment(user.id);
            const chatList = await fetchMessagesByUser(user.id);
            const allMes = await loadUserAllMessages(user.id);
            contactList = appointList.map(apt => {
                const filtered = allMes.filter(x => x.sender_id === apt.doctor_id);
                if (filtered.length > 0) {
                    const relatedChat = chatList.find(chat => chat.other_user_id === apt.doctor_id);

                    return {
                        ...apt,
                        ...(relatedChat || {}),
                        online: false,
                        lastSeen: apt.last_message_time,
                    };
                }
                return null

            }).filter(item => item !== null);
            if (contactList.length > 0) {
                loadUsers(contactList);
                //contactList = mergedList;
                loadMessages(0);
                scrollToBottom();
            }
        }

    } catch (error) {
        console.log('user list error', error)
    }
}

/* document.getElementById('search').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const filtered = users.filter(user => user.name.toLowerCase().includes(query) ||
        user.lastMessage.toLowerCase().includes(query));
    loadUsers(filtered);
}); */

document.getElementById('search').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const filtered = contactList.filter(user => user.doctor_name.toLowerCase().includes(query) ||
        user.last_message.toLowerCase().includes(query));
    loadUsers(filtered);
});

/* function loadMessages(index) {
    const chatBox = document.getElementById('chatMessages');
    const user = users[index];
    chatBox.innerHTML = '';
    user.messages.forEach(msg => {
        const div = document.createElement('div');
        const isSent = msg.from === "You";
        div.className = 'message ' + (isSent ? 'sent' : 'received');
        div.innerHTML = `<p>${msg.text}</p><span>${msg.time}</span>`;
        chatBox.appendChild(div);
    });

    document.querySelector('.chat-header .chat-name').textContent = user.name;
    document.querySelector('.chat-header .status').textContent = user.online ? "Online" : "Offline";
    document.querySelector('.chat-header img').src = user.avatar;
} */

async function loadMessages(index) {
    const chatBox = document.getElementById('chatMessages');
    const tmpUser = contactList[index];
    const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
    if (tmpUser) {
        messageLists = await loadUserChats(tmpUser.doctor_id);
        chatBox.innerHTML = '';
        messageLists.forEach(msg => {
            const div = document.createElement('div');
            const isSent = msg.sender_id === user.id;
            div.className = 'message ' + (isSent ? 'sent' : 'received');
            div.innerHTML = `<p>${msg.content}</p><span>${formatChatTime(msg.timestamp)}</span>`;
            chatBox.appendChild(div);
        });

        document.querySelector('.chat-header .chat-name').textContent = tmpUser.doctor_name;
        document.querySelector('.chat-header .status').textContent = tmpUser.online ? "Online" : "Offline";
        document.querySelector('.chat-header img').src = `http://localhost:8000${tmpUser.profile_image_url}`;
    }

}

function switchUser(index) {
    currentUserIndex = index;
    document.querySelectorAll('.contact').forEach((c, i) => {
        c.classList.toggle('active', i === index);
    });
    loadMessages(index);
}

async function loadUserChats(userId) {
    const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
    if (user) {
        const response = await fetch(`${globalVariables.apiUrl}chat/${user.id}/${userId}`);
        const chatList = await response.json();
        if (chatList.success) {
            const tempList = chatList.data;
            //console.log('tempList', tempList)
            return tempList
        } else {
            return [];
        }
    }
}

/* function appendMessage(message) {
    const time = getTime();
    const msg = { from: "You", text: message, time };
    users[currentUserIndex].messages.push(msg);
    users[currentUserIndex].lastMessage = message;
    users[currentUserIndex].lastSeen = time;

    loadMessages(currentUserIndex);
    loadUsers();
    scrollToBottom();
} */

async function appendMessage(message) {
    try {
        const time = getTime();
        const targetUser = contactList[currentUserIndex];
        if (targetUser) {
            const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
            const response = await fetch(`${globalVariables.apiUrl}chat/create`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sender_id: user.id,
                    receiver_id: targetUser.doctor_id,
                    content: message,
                })
            });
            const chatMsg = await response.json();
            if (chatMsg.success) {
                const chat = chatMsg.data;
                //messageLists.push(chat);
                contactList[currentUserIndex].last_message = message;
                contactList[currentUserIndex].lastSeen = time;
                contactList[currentUserIndex].last_message_time = chat.timestamp;

                loadMessages(currentUserIndex);
                loadUsers(contactList);
                scrollToBottom();
            }
            //console.log('chatMsg', chatMsg)
        } else {
             await showDialog('No message list available.', '', 'Dismiss');
        }
    } catch (error) {
        await showDialog(error.message, '', 'Dismiss');
    }

}

function scrollToBottom() {
    const chatBox = document.getElementById('chatMessages');
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

document.getElementById('sendBtn').addEventListener('click', async () => {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (message) {
        await appendMessage(message);
        input.value = '';
    }
});

function formatChatTime(dateString) {
    const date = new Date(dateString.replace(" ", "T")); // Ensure it's valid for Date()

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

    if (isToday) {
        return date.toLocaleTimeString([], timeOptions); // e.g. 5:35 PM
    } else if (isYesterday) {
        return `Yesterday ${date.toLocaleTimeString([], timeOptions)}`;
    } else {
        return date.toLocaleDateString([], { day: 'numeric', month: 'short' }) +
            " " + date.toLocaleTimeString([], timeOptions);
    }
}

function shortenText(text, maxLength) {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

function initSocketListner() {
    socket.on("newMessage", (msg) => {
        //console.log("📩 New message:", msg);
        // Show notification in app
        loadUserList();
    });
}

// Initial Load
loadUserList();
initSocketListner();