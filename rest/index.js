const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./Server/server.js");

const port = 8081;
const cors = require('cors');
const { signin, login, createRoom, searchUser } = require("./Business Logics/chatBL.js");
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
const corsOptions = {
    origin: 'https://your-frontend.com', // Restrict allowed origins
    methods: ['GET', 'POST'],          // Allow specific HTTP methods
    // credentials: true,                 // Allow cookies
};
connectDB()
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server is started at port no ${port}`);
    }
});


app.post("/signIn", signin);
app.post("/login", login);
app.post("/createRoom", createRoom)
app.post("/searchUser", searchUser)