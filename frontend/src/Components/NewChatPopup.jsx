import React, { use, useState } from "react";
import { createRoomService } from "../Service/chatService";
import { useDispatch, useSelector } from "react-redux";
import { addLastMessage, updateLastMessage } from "../Slices/lastMessageSlice";
import { pushNewChat, renderChat } from "../Slices/chatsDataSlice";

const NewChatPopup = ({ onClose, user, socket }) => {
    const [inputValue, setInputValue] = useState("");
    const userDetails = {
        name: sessionStorage.getItem('name'),
        email: sessionStorage.getItem('email'),
        sourceId: sessionStorage.getItem('sourceId')
    }
    const messages = useSelector((state) => state.chatData)
    const dispatch = useDispatch()
    const handleNewChat = async () => {
        let payload = {
            sourceId: userDetails.sourceId,
            targetId: [user._id],
            initialMessage: inputValue
        }
        console.log(JSON.stringify(payload))
        let newRoom = await createRoomService(payload)
        debugger;
        console.log(messages);

        let newChat = {
            usersroom: {
                roomId: newRoom.data.roomId,
            },
            roomMembers: [
                {
                    roomId: newRoom.data.roomId,
                    user: {
                        _id: userDetails.sourceId,
                        name: userDetails.name,
                        email: userDetails.email
                    }
                },
                {
                    roomId: newRoom.data.roomId,
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email
                    }
                }
            ]
        }

        let lastMessage = {
            roomId : newRoom.data.roomId,
            roommembers: {
                roomId: newRoom.data.roomId,
                userId: userDetails.sourceId
            },
            roommessages: {
                createdDate: newRoom.data.roomMessage.createdDate,
                roomId: newRoom.data.roomId,
                roomMessage: newRoom.data.roomMessage.roomMessage
            },
            users: {
                name : userDetails.name,
                email : userDetails.email
            }

        }

        dispatch(pushNewChat(newChat))
        dispatch(updateLastMessage({ roomId: newRoom.data.roomId, name: userDetails.name, message: newRoom.data.roomMessage.roomMessage }))
        dispatch(addLastMessage({lastMessage}))
        socket.emit("new_room", JSON.stringify({ targetId: user._id,initialMessage : inputValue, newChat }))
        socket.emit("join_room", JSON.stringify([newRoom.data.roomId]))
    }

    return (
        <div className="popup-overlay d-flex justify-content-center align-items-center">
            <div className="popup-box bg-dark text-light p-4 rounded">
                <h5 className="text-center mb-3">New Chat with {user.name}</h5>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter a message"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="d-flex justify-content-between">
                    <button className="btn btn-danger" onClick={() => { onClose() }}>Cancel</button>
                    <button className="btn btn-success" onClick={() => { handleNewChat(); onClose() }}> Send </button>
                </div>
            </div>
        </div>
    );
};


export default NewChatPopup