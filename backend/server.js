const app = require("express")();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "https://chat-app-seven-xi-22.vercel.app", // React frontend URL
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("massage", (msg) => {
    io.emit("massage", msg);
  });
  socket.on("user joined", (msg) => {
    io.emit("massage", msg);
  });
});
server.listen(5000, () => {
  console.log("Server is started on port 5000");
});
