import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { getChatRoomService, getMessagesService } from "../Service/chatService";
import { useNavigate } from "react-router-dom";
import { ChatWindow } from "./ChatWindow";
import { useDispatch, useSelector } from 'react-redux'
import { setChatData } from "../Slices/chatDataSlice";
// const socket = io.connect("http://localhost:4000");

const Chat = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [chatRoomData, setChatRoomData] = useState([])
    const [activeChat, setActiveChat] = useState(null)
    const [lastMessageData, setLastMessageData] = useState([])
    const [messageData, setMessageData] = useState({})
    const userDetails = {
        name: sessionStorage.getItem('name'),
        email: sessionStorage.getItem('email'),
        sourceId: sessionStorage.getItem('sourceId')
    }
    const users = ["Bob", "Charlie", "David", "Alice", "Bob", "Charlie", "David"];

    const sendMessage = () => {
        console.log(chatRoomData);

        // if (message.trim() !== "") {
        //     setMessages([...messages, { text: message, sender: "You" }]);
        //     setMessage("");
        // }
    };

    useEffect(() => {
        getChatRoomData()
    }, [])

    const getChatRoomData = async () => {
        if (userDetails.email && userDetails.name && userDetails.sourceId) {
            console.log(JSON.stringify(userDetails));

            let result = await getChatRoomService(userDetails)
            setChatRoomData(result?.data?.chatRoom[0].rooms)
            setLastMessageData(result?.data?.topMessage)
        }
        else {
            navigate('/login')
        }
    }

    const handleChatClick = async (room) => {
        setActiveChat((prev) => (prev != room.usersroom.roomId ? room.usersroom.roomId : null))
        let messageData = await getMessagesService({ roomId: room.usersroom.roomId })
        console.log(messageData.data);
        
        dispatch(setChatData({key : room.usersroom.roomId,value : messageData.data}))
    }
    
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

                <ul className="list-group overflow-auto" style={{ maxHeight: "400px" }}>
                    {users.filter(user => user.toLowerCase().includes(search?.toLowerCase() || null)).map((user, index) => (
                        <li key={index} className="list-group-item list-group-item-action">
                            {user}
                        </li>
                    ))}
                </ul>
                <ul className="list-group chat-list overflow-auto" style={{ height: "615px" }} >
                    {chatRoomData.map((room, index) => (
                        <li key={index} className={`list-group-item d-flex align-items-center p-3 ${activeChat == room.usersroom.roomId ? 'active' : ''}`} onClick={() => { handleChatClick(room) }}>
                            <div className="chat-avatar bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "40px", height: "40px" }}>
                                {room.roomMembers[0].user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="chat-info">
                                <strong>{room.roomMembers.filter((roomie) => roomie.user._id != userDetails.sourceId).map((roomie) => (roomie.user.name)).join(', ')}</strong>
                                <p className="small text-muted m-0">{lastMessageData[index].lastMessage.users._id == userDetails.sourceId ? "Me" : lastMessageData[index].lastMessage.users.name} : {lastMessageData[index].lastMessage.roommessages.roomMessage}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat Window */}
            <ChatWindow roomId={activeChat} />
        </div>
    );
};


export default Chat;
