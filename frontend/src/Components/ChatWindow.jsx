import { useDispatch, useSelector } from "react-redux"
import moment from 'moment'
import { useEffect, useRef, useState } from "react"
import { updateLastMessage } from "../Slices/lastMessageSlice"

export const ChatWindow = ({ roomId, socket, userDetails }) => {
    const [newMessage, setNewMessage] = useState('')
    const messages = useSelector((state) => state.chatData)
    const dispatch = useDispatch()
    const chatBoxRef = useRef(null);
    console.log(roomId, messages);
    const handleSend = () => {
        console.log({ newMessage, roomId, sourceId: userDetails.sourceId, name: userDetails.name, createdDate: moment.utc().toDate() })
        setNewMessage('')
        dispatch(updateLastMessage({ roomId, name: userDetails.name, message: newMessage }))
        socket.emit("send_message", { newMessage, roomId, sourceId: userDetails.sourceId, name: userDetails.name, createdDate: moment.utc().toDate() })
    }
    // useEffect(() => {
    //     scrollToBottom()
    // }, [])

    // const scrollToBottom = () => {
    //     debugger
    //     console.log("here");

    //     if (chatBoxRef.currentTarget) {
    //         chatBoxRef.currentTarget.scrollTop = chatBoxRef.currentTarget.scrollHeight;
    //     }
    // };
    return (
        <div className="col-md-9 d-flex flex-column bg-secondary text-light p-3">
            {roomId ? <div className="chat-box flex-grow-1 overflow-auto p-3 border rounded bg-dark" style={{scrollBehavior : 'smooth',scrollbarWidth : 'thin', scrollbarColor : 'white', scrollPaddingRight : '1000px'}} >
                {messages[roomId]?.map((msg) => (
                    <div className={`d-flex ${msg.roomMembers.user._id === sessionStorage.getItem('sourceId') ? "justify-content-end" : "justify-content-start"} mb-2`}>
                        <div className={`p-2 rounded text-light ${msg.roomMembers.user._id === sessionStorage.getItem('sourceId') ? "bg-success" : "bg-primary"}`} style={{ maxWidth: "75%" }}>
                            <strong>{msg.roomMembers.user._id === sessionStorage.getItem('sourceId') ? "Me" : msg.roomMembers.user.name}</strong>
                            <small style={{ fontSize: "9px", fontStyle: "italic" }}> on {moment(msg.createdDate).format('MMM DD, YYYY h:mm:ss a')}</small>
                            <p className="m-0">{msg.roomMessage}</p>
                        </div>
                    </div>
                ))}
                {/* {messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        <strong>{msg.sender}: </strong>
                        {msg.text}
                    </div>
                ))} */}
            </div> : <div className="chat-box flex-grow-1 overflow-auto p-3 border rounded bg-dark d-flex align-items-center justify-content-center">Press any Chat to display the messages</div>}

            {/* Message Input */}
            <div className="input-group mt-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Type a message..."
                    disabled={!roomId}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                {/* <button className="btn btn-success" onClick={sendMessage}> */}
                <button className="btn btn-success" onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    )
}