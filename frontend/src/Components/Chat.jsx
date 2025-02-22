import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { getChatRoomService, getMessagesService, searchUserService } from "../Service/chatService";
import { useNavigate } from "react-router-dom";
import { ChatWindow } from "./ChatWindow";
import { useDispatch, useSelector } from 'react-redux'
import { pushNewMessage, setChatData } from "../Slices/chatDataSlice";
import { setLastMessage, updateLastMessage } from "../Slices/lastMessageSlice";
import NewChatPopup from "./NewChatPopup";
const socket = io.connect("http://192.168.1.36:4000");

const Chat = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const messages = useSelector((state) => state.chatData)
    const [popup, setPopup] = useState(false);
    const [search, setSearch] = useState("");
    const [newUser, setNewUser] = useState(undefined)
    const [chatRoomData, setChatRoomData] = useState([])
    const [activeChat, setActiveChat] = useState(null)
    const lastMessageData = useSelector((state) => state.lastMessage)
    // const [messageData, setMessageData] = useState({})
    const userDetails = {
        name: sessionStorage.getItem('name'),
        email: sessionStorage.getItem('email'),
        sourceId: sessionStorage.getItem('sourceId')
    }
    const [users, setUsers] = useState([])


    useEffect(() => {
        getChatRoomData()
    }, [])

    const getChatRoomData = async () => {
        if (userDetails.email && userDetails.name && userDetails.sourceId) {
            console.log(JSON.stringify(userDetails));
            let result = await getChatRoomService(userDetails)
            if (result.data.chatRoom) {
                dispatch(setLastMessage(result?.data?.topMessage))
                setChatRoomData(result?.data?.chatRoom?.length > 0 ? result?.data?.chatRoom[0]?.rooms : [])
                // setLastMessageData(result?.data?.topMessage)
                socket.emit("join_room", JSON.stringify(result?.data?.chatRoom?.length > 0 && result?.data?.chatRoom[0].rooms?.map((room) => (room.usersroom.roomId))))
            }

        }
        else {
            navigate('/login')
        }
        socket.on("receive_message", (payload) => {
            console.log(payload);

            let obj = {
                roomMembers: {
                    user: {
                        _id: payload.sourceId,
                        name: payload.name
                    }
                },
                createdDate: payload.createdDate,
                roomMessage: payload.newMessage
            }
            console.log({ key: payload.roomId, value: obj });
            console.log(messages);

            dispatch(pushNewMessage({ key: payload.roomId, value: obj }))
            dispatch(updateLastMessage({ roomId: payload.roomId, name: payload.name, message: payload.newMessage }))
        })
    }

    const handleChatClick = async (room) => {
        debugger
        setActiveChat((prev) => (prev !== room.usersroom.roomId ? room.usersroom.roomId : null))
        if (!messages[room.usersroom.roomId]) {
            let messageData = await getMessagesService({ roomId: room.usersroom.roomId })
            dispatch(setChatData({ key: room.usersroom.roomId, value: messageData.data }))
        }
    }

    const handleSearch = async () => {
        let payload = {
            search,
            sourceId: userDetails.sourceId
        }

        let result = await searchUserService(payload)
        setUsers(result.data)
    }

    return (
        <div className="container-fluid vh-100 d-flex p-0">
            {/* Sidebar */}
            <div onClick={() => { setUsers([]); setSearch('') }} className="col-md-3 bg-dark text-light p-3 border-end">
                <h4 className="text-center">Chats</h4>

                {/* Search Bar */}
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => { if (e.code === "Enter") { handleSearch() } }}
                />

                <ul className="list-group overflow-auto" style={{ maxHeight: "400px" }}>
                    {users.map((user, index) => (
                        <li onClick={() => { setPopup(true); setNewUser(user) }} key={index} className="list-group-item overlay list-group-item-action">
                            {user.name} - {user.email}
                        </li>
                    ))}
                </ul>
                <ul hidden={users.length != 0} className="list-group chat-list overflow-auto" style={{ height: "615px" }} >
                    {chatRoomData.map((room, index) => (
                        <li key={index} className={`list-group-item d-flex align-items-center p-3 ${activeChat === room.usersroom.roomId ? 'active' : ''}`} onClick={() => { handleChatClick(room) }}>
                            <div className="chat-avatar bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "40px", height: "40px" }}>
                                {room.roomMembers[0].user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="chat-info">
                                <strong>{room.roomMembers.filter((roomie) => roomie.user._id !== userDetails.sourceId).map((roomie) => (roomie.user.name)).join(', ')}</strong>
                                <p className="small text-muted m-0">{lastMessageData[index].lastMessage.users._id === userDetails.sourceId ? "Me" : lastMessageData[index].lastMessage.users.name} : {lastMessageData[index].lastMessage.roommessages.roomMessage.length >= 255 ? lastMessageData[index].lastMessage.roommessages.roomMessage.slice(0, 27) + " ....." : lastMessageData[index].lastMessage.roommessages.roomMessage}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat Window */}
            <ChatWindow roomId={activeChat} socket={socket} userDetails={userDetails} />
            {popup && <NewChatPopup user={newUser} onClose={() => { setPopup(false) }} />}
        </div>
    );
};


export default Chat;
