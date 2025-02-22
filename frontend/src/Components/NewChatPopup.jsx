import React, { use, useState } from "react";
import { createRoomService } from "../Service/chatService";
import { useDispatch, useSelector } from "react-redux";
import { addChatData, setChatData } from "../Slices/chatDataSlice";
import { updateLastMessage } from "../Slices/lastMessageSlice";

const NewChatPopup = ({ onClose, user }) => {
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

        dispatch(setChatData({
            key: newRoom.data.roomId, value: [{
                roomMembers: {
                    user: {
                        _id: userDetails.sourceId,
                        name: userDetails.name,
                        email: userDetails.email
                    }
                },
                createdDate: newRoom.data.roomMessage.createdDate,
                roomMessage: newRoom.data.roomMessage.roomMessage,
                roomId: newRoom.data.roomId
            }]
        }))
        dispatch(updateLastMessage({ roomId: newRoom.data.roomId, name: userDetails.name, message: newRoom.data.roomMessage.roomMessage }))
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