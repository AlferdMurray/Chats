import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
    if (!socket) {
        const email = sessionStorage.getItem("email"); // Check sessionStorage
        if (email) {
            socket = io("http://chatappbackend.ap-south-1.elasticbeanstalk.com", {
                reconnection: true,
                reconnectionDelay: 1000,
                autoConnect: true,
                query: {
                    email
                }
            });

            socket.on("connect", () => {
                console.log("Connected to WebSocket server:", socket.id);
            });

            socket.on("disconnect", () => {
                console.log("Disconnected from WebSocket server");
            });
        }
    }
};

export const getSocket = () => socket; // Function to get socket instance

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log("Socket disconnected");
    }
};