import { useSelector } from "react-redux"
import moment from 'moment' 

export const ChatWindow = ({ roomId }) => {
    const messages = useSelector((state) => state.chatData)
    console.log(roomId, messages);

    return (
        <div className="col-md-9 d-flex flex-column bg-secondary text-light p-3">
            {roomId ? <div className="chat-box flex-grow-1 overflow-auto p-3 border rounded bg-dark">
                {messages[roomId]?.map((msg) => (
                    <div className={`d-flex ${msg.roomMembers.user._id === sessionStorage.getItem('sourceId') ? "justify-content-end" : "justify-content-start"} mb-2`}>
                        <div className={`p-2 rounded text-light ${msg.roomMembers.user._id === sessionStorage.getItem('sourceId') ? "bg-success" : "bg-primary"}`} style={{ maxWidth: "75%" }}>
                            <strong>{msg.roomMembers.user._id === sessionStorage.getItem('sourceId') ? "Me" : msg.roomMembers.user.name}</strong>
                            <small style={{fontSize : "9px",fontStyle:"italic"}}> on {moment(msg.createdDate).format('MMM DD, YYYY h:mm:ss a')}</small>
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
                // value={message}
                // onChange={(e) => setMessage(e.target.value)}
                />
                {/* <button className="btn btn-success" onClick={sendMessage}> */}
                <button className="btn btn-success">
                    Send
                </button>
            </div>
        </div>
    )
}