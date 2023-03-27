const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data)
    })

    socket.on("send message", (data) => {
        socket.broadcast.emit("receive message", data) //to(data.room)
    })

    socket.on("disconnect", (socket) => {
        console.log(`user disconnected: ${socket.id}`);
    })
})

server.listen(3001, () => {
    console.log("server is running on port: 3001");
})