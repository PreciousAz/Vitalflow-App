
var appiontmentList = [];
var contactList = [];
var messageLists = []


function loadUsers(tmpUsers) {
    const list = document.querySelector('.contacts');
    list.innerHTML = '';
    if (tmpUsers.length > 0) {
        tmpUsers.forEach((user, index) => {
            const li = document.createElement('li');
            li.className = 'contact' + (index === 0 ? ' active' : '');
            li.innerHTML = `
            <img src="http://localhost:8000${user.purl}" />
            <div>
                <p class="name">${user.name}</p>
                <p class="preview">${shortenText(user.last_message, 15)}</p>
            </div>
            <span class="time">${formatChatTime(user.last_message_time)}</span>
            ${user.online ? '<span class="status-dot green"></span>' : ''}
            `;
            li.addEventListener('click', () => switchUser(index));
            list.appendChild(li);
        });
    }

}

async function fetchAppointmentsByUser(userId) {
    const response = await fetch(`${globalVariables.apiUrl}appointment/doctor/${userId}/user`);
    const appointments = await response.json();
    if (appointments.success) {
        const filteredList = appointments.data.filter(appointment => appointment.status === 'accepted');
        const tempList = filteredList.filter(
            (appt, index, self) =>
                index === self.findIndex(a => a.user_id === appt.user_id)
        );
        return tempList
    } else {
        return [];
    }
}

async function fetchMessagesByUser(userId) {
    const response = await fetch(`${globalVariables.apiUrl}chat/user/${userId}`);
    const chatList = await response.json();
    if (chatList.success) {
        const tempList = chatList.data;
        //console.log('tempList fetch', tempList)
        return tempList
    } else {
        return [];
    }
}

async function loadUserList() {
    try {
        const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
        if (user) {
            const appointList = await fetchAppointmentsByUser(user.id);
            const chatList = await fetchMessagesByUser(user.id)
            contactList = appointList.map(apt => {
                const relatedChat = chatList.find(chat => chat.other_user_id === apt.user_id);
                if (relatedChat) {
                    return {
                        ...apt,
                        ...(relatedChat || {}),
                        online: false,
                        lastSeen: apt.last_message_time,
                    };
                }
                return null;

            }).filter(item => item !== null);
            if (contactList.length > 0) {
                loadUsers(contactList);
                //contactList = mergedList;
                loadMessages(0);
            }

            //console.log('mergedList', contactList);
        }

    } catch (error) {
        console.log('user list error', error)
    }
}



document.getElementById('search').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const filtered = contactList.filter(user => user.name.toLowerCase().includes(query) ||
        user.last_message.toLowerCase().includes(query));
    loadUsers(filtered);
});

async function loadMessages(index) {
    const chatBox = document.getElementById('chatMessages');
    const tmpUser = contactList[index];
    const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
    if (tmpUser) {
        messageLists = await loadUserChats(tmpUser.user_id);
        chatBox.innerHTML = '';
        messageLists.forEach(msg => {
            const div = document.createElement('div');
            const isSent = msg.sender_id === user.id;
            div.className = 'message ' + (isSent ? 'sent' : 'received');
            div.innerHTML = `<p>${msg.content}</p><span>${formatChatTime(msg.timestamp)}</span>`;
            chatBox.appendChild(div);
        });

        document.querySelector('.chat-header .chat-name').textContent = tmpUser.name;
        document.querySelector('.chat-header .status').textContent = tmpUser.online ? "Online" : "Offline";
        document.querySelector('.chat-header img').src = `http://localhost:8000${tmpUser?.purl}`;
    }

}

function switchUser(index) {
    currentUserIndex = index;
    document.querySelectorAll('.contact').forEach((c, i) => {
        c.classList.toggle('active', i === index);
    });
    loadMessages(index);
}

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
                    receiver_id: targetUser.user_id,
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

async function sendChat(senderId, receiverId, message) {
    try {
        const response = await fetch(`${globalVariables.apiUrl}chat/${user.id}/${userId}`);
        const chatMsg = await response.json();
    } catch (error) {
        await showDialog(error.message, '', 'Dismiss');
    }
}

function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

document.getElementById('sendBtn').addEventListener('click', () => {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (message) {
        appendMessage(message);
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
//loadUsers();
loadUserList();
initSocketListner();
