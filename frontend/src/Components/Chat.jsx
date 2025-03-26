import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { getChatRoomService, getMessagesService, searchUserService } from "../Service/chatService";
import { useNavigate } from "react-router-dom";
import { ChatWindow } from "./ChatWindow";
import { useDispatch, useSelector } from 'react-redux'
import { pushNewMessage, setChatData } from "../Slices/chatDataSlice";
import { addLastMessage, setLastMessage, updateLastMessage } from "../Slices/lastMessageSlice";
import NewChatPopup from "./NewChatPopup";
import { pushNewChat, setChatsData } from "../Slices/chatsDataSlice";

const socket = io("http://chatappbackend.ap-south-1.elasticbeanstalk.com", {
    reconnection: true,
    transports: ["websocket", "polling"],
    reconnectionDelay: 1000,
    autoConnect: true,
    query: {
        email: sessionStorage.getItem('email')
    },
})

const Chat = () => {


    const navigate = useNavigate()
    const dispatch = useDispatch()
    const messages = useSelector((state) => state.chatData)
    const [popup, setPopup] = useState(false);
    const [search, setSearch] = useState("");
    const [newUser, setNewUser] = useState(undefined)
    const chatRoomData = useSelector((state) => state.chatsData)
    const [activeChat, setActiveChat] = useState(null)
    const lastMessageData = useSelector((state) => state.lastMessage)
    const userDetails = {
        name: sessionStorage.getItem('name'),
        email: sessionStorage.getItem('email'),
        sourceId: sessionStorage.getItem('sourceId')
    }
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (chatRoomData.length == 0) {
            getChatRoomData(socket)
        }
        socket.on("receive_message", (payload) => {
            console.log(payload);
            debugger
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

            dispatch(pushNewMessage({ key: payload.roomId, value: obj }))
            dispatch(updateLastMessage({ roomId: payload.roomId, name: payload.name, message: payload.newMessage }))
        })

        socket.on("ping", (payload) => {
            console.log(payload);
        })


        socket.on("new_room", (payload) => {
            console.log(payload, "from BE");
            dispatch(pushNewChat(payload.message))
            let lastMessage = {
                roomId: payload.message.usersroom.roomId,
                roommembers: {
                    roomId: payload.message.usersroom.roomId,
                    userId: payload.message.roomMembers[0].user._id
                },
                roommessages: {
                    createdDate: new Date(),
                    roomId: payload.message.usersroom.roomId,
                    roomMessage: payload.lastMessage
                },
                users: {
                    name: payload.message.roomMembers[0].user.name,
                    email: payload.message.roomMembers[0].user.email
                }

            }
            dispatch(addLastMessage({ lastMessage }))
            socket.emit("join_room", JSON.stringify([payload.message.usersroom.roomId]))
        })
        // }
        return () => {
            socket.off("new_room")
            socket.off("receive_message")
        }
    }, [])
    
    const getChatRoomData = async () => {

        if (userDetails.email && userDetails.name && userDetails.sourceId) {
            console.log(JSON.stringify(userDetails));
            let result = await getChatRoomService(userDetails)
            if (result.data.chatRoom) {
                dispatch(setLastMessage(result?.data?.topMessage))
                dispatch(setChatsData(result?.data?.chatRoom[0]?.rooms))
                socket.emit("join_room", JSON.stringify(result?.data?.chatRoom?.length > 0 && result?.data?.chatRoom[0].rooms?.map((room) => (room.usersroom.roomId))))
            }

        }
        else {
            navigate('/login')
        }

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

    const bindGrid = () => {
        return (
            (chatRoomData.length > 0 && chatRoomData) && chatRoomData?.map((item) => {
                return { ...item, lastMessage: lastMessageData.find((mess) => mess.lastMessage.roomId == item.usersroom.roomId) }
            }).sort((item1, item2) => new Date(item2.lastMessage.lastMessage.roommessages.createdDate) - new Date(item1.lastMessage.lastMessage.roommessages.createdDate)).map((room, index) => (
                <li key={index} className={`list-group-item d-flex align-items-center p-3 ${activeChat === room?.usersroom?.roomId ? 'active' : ''}`} onClick={() => { handleChatClick(room) }}>
                    <div className="chat-avatar bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "40px", height: "40px" }}>
                        {room?.roomMembers[0]?.user?.name?.charAt(0).toUpperCase() || 'null'}
                    </div>
                    <div className="chat-info">
                        <strong>{room?.roomMembers?.filter((roomie) => roomie?.user?._id !== userDetails.sourceId).map((roomie) => (roomie?.user?.name)).join(', ')}</strong>
                        <p className="small text-muted m-0">{lastMessageData.find((item) => item?.lastMessage?.roomId == room?.usersroom?.roomId).lastMessage.users._id === userDetails.sourceId ? "Me" : lastMessageData.find((item) => item?.lastMessage?.roomId == room?.usersroom?.roomId).lastMessage.users.name} : {lastMessageData.find((item) => item?.lastMessage?.roomId == room?.usersroom?.roomId).lastMessage.roommessages.roomMessage.length >= 255 ? lastMessageData.find((item) => item?.lastMessage?.roomId == room?.usersroom?.roomId).lastMessage.roommessages.roomMessage.slice(0, 27) + " ....." : lastMessageData.find((item) => item?.lastMessage?.roomId == room?.usersroom?.roomId).lastMessage.roommessages.roomMessage}</p>
                        {/* <p className="small text-muted m-0">No Last Message da</p> */}
                    </div>
                </li>
            ))
        )
    }

    return (
        <div className="container-fluid vh-100 d-flex p-0">
            {/* Sidebar */}
            <div onClick={() => { setUsers([]); setSearch('') }} className="col-md-3 bg-dark text-light p-3 border-end">
                <h4 className="text-center">Chats of {userDetails.name}</h4>

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
                    {bindGrid()}
                </ul>
            </div>

            {/* Chat Window */}
            <ChatWindow roomId={activeChat} socket={socket} userDetails={userDetails} />
            {popup && <NewChatPopup user={newUser} onClose={() => { setPopup(false) }} socket={socket} />}
        </div>
    );
};


export default Chat;
