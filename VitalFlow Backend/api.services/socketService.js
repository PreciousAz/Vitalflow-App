
const { Server } = require("socket.io");

// Store online users
let io;
let onlineUsers = new Map();

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*", // allow all for now
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("🔌 New client connected:", socket.id);

        // Register user
        socket.on("register", (userId) => {
            if (onlineUsers.has(userId)) {
                onlineUsers.get(userId).push(socket.id);
            } else {
                onlineUsers.set(userId, [socket.id]);
            }
            console.log(`✅ User ${userId} registered with socket ${socket.id}`);
        });

        // Disconnect cleanup
        socket.on("disconnect", () => {
            for (let [userId, sockets] of onlineUsers) {
                onlineUsers.set(userId, sockets.filter(id => id !== socket.id));
                if (onlineUsers.get(userId).length === 0) {
                    onlineUsers.delete(userId);
                }
            }
            console.log("❌ Client disconnected:", socket.id);
        });
    });
}

function getIO() {
    if (!io) {
        throw new Error("❌ Socket.IO not initialized! Call initSocket(server) first.");
    }
    return io;
}

function getOnlineUsers() {
    return onlineUsers;
}

module.exports = { initSocket, getIO, getOnlineUsers };
