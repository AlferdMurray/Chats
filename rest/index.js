const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./Server/server.js");

const port = 8080
const cors = require('cors');
const { signin, login, createRoom, searchUser, getChatRoom, getMessages, addNewMessage } = require("./Business Logics/chatBL.js");
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
const corsOptions = {
    // origin: 'http://localhost:3000', // Restrict allowed origins
    methods: ['GET', 'POST'],          // Allow specific HTTP methods
    // credentials: true,                 // Allow cookies
};
connectDB()
app.use(express.json());
app.use(cors(corsOptions));
// app.use(express.urlencoded({ extended: true }));

app.listen(port, '0.0.0.0', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server is started at port no ${port} and at ${getNetworkIP()}:${port}`);
    }
});


function getNetworkIP() {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    for (let iface of Object.values(interfaces)) {
        for (let details of iface) {
            if (details.family === 'IPv4' && !details.internal) {
                return details.address;
            }
        }
    }
    return 'Unknown';
}

app.post("/signIn", signin);
app.post("/login", login);
app.post("/createRoom", createRoom)
app.post("/searchUser", searchUser)
app.post("/getChatRoom", getChatRoom)
app.post("/getMessages", getMessages)
app.post("/testApi", addNewMessage)