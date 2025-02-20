

export const ChatWindow = ({ roomId }) => {
    return (
        <div className="col-md-9 d-flex flex-column bg-secondary text-light p-3">
            {roomId ? <div className="chat-box flex-grow-1 overflow-auto p-3 border rounded bg-dark">
                <div key={index} className={`d-flex ${msg.sender === "You" ? "justify-content-end" : "justify-content-start"} mb-2`}>
                    <div className={`p-2 rounded text-light ${msg.sender === "You" ? "bg-success" : "bg-primary"}`} style={{ maxWidth: "75%" }}>
                        <strong>{msg.sender}</strong>
                        <p className="m-0">{msg.text}</p>
                    </div>
                </div>
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