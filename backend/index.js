const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { addNewMessage } = require("./wsBL/wsBL");
const connectDB = require("./Server/server");

const app = express();
app.use(cors());
connectDB()
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3000", // React frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  console.log(JSON.stringify(socket));
  
  // Join a room
  socket.on("join_room", (rooms) => {
    for (const room of JSON.parse(rooms)) {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
    }
  });

  // Handle chat message
  socket.on("send_message", async (data) => {
    // console.log(data);

    io.to(data.roomId).emit("receive_message", { newMessage: data.newMessage, sourceId: data.sourceId, createdDate: data.createdDate, roomId: data.roomId, name: data.name }); // Send message to the room
    await addNewMessage(data)
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
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


server.listen(4000, () => {
  console.log("Server running on port 4000 and on ", `http://${getNetworkIP()}`);
});
