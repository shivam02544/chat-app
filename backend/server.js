require("dotenv").config();
const app = require("express")();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "https://chat-app-seven-xi-22.vercel.app",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("message", (msg) => {
    io.emit("message", msg);
  });

  socket.on("user joined", (userName) => {
    socket.userName = userName;
    const joinMessage = {
      userName: "System",
      message: `${userName} has joined the chat`,
      time: new Date().toLocaleString(),
    };
    io.emit("message", joinMessage);
    console.log("User joined: ", joinMessage);
  });

  socket.on("typing", (userName) => {
    socket.broadcast.emit("typing", userName);
  });

  socket.on("disconnect", () => {
    const userName = socket.userName;
    const disConnect = {
      userName: "system",
      message: `${userName} has left the chat`,
      time: new Date().toLocaleString(),
    };
    io.emit("message", disConnect);
  });
});

server.listen(5000, () => {
  console.log("Server is started on port 5000");
});
