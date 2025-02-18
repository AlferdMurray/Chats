import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:4000");

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const users = ["Alice", "Bob", "Charlie", "David"];

    const sendMessage = () => {
        if (message.trim() !== "") {
            setMessages([...messages, { text: message, sender: "You" }]);
            setMessage("");
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex p-0">
            {/* Sidebar */}
            <div className="col-md-3 bg-dark text-light p-3 border-end">
                <h4 className="text-center">Chats</h4>

                {/* Search Bar */}
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <ul className="list-group">
                    {users.filter(user => user.toLowerCase().includes(search?.toLowerCase() || null)).map((user, index) => (
                        <li key={index} className="list-group-item list-group-item-action">
                            {user}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat Window */}
            <div className="col-md-9 d-flex flex-column bg-secondary text-light p-3">
                <div className="chat-box flex-grow-1 overflow-auto p-3 border rounded bg-dark">
                    {messages.map((msg, index) => (
                        <div key={index} className="mb-2">
                            <strong>{msg.sender}: </strong>
                            {msg.text}
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="input-group mt-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="btn btn-success" onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};


export default Chat;
