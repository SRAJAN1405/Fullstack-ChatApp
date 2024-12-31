import { Server } from "socket.io"; //Server from Socket.IO: This library helps establish real-time, bidirectional communication between a server and clients (like a web browser).
//Client to Server: When a user sends a message, the client sends it to the server.
//Server to Client: The server then sends that message to other connected clients in real-time.
import http from "http"; //A built-in Node.js module for creating an HTTP server.
import express from "express"; // This creates an instance of an Express app, which will handle HTTP requests

const app = express();
const server = http.createServer(app); //This creates an HTTP server that uses the Express app to handle requests.

const io = new Server(server, {
  // This initializes a Socket.IO server that will listen for real-time events on the server we just created.
  cors: {
    //The cors option specifies which clients are allowed to connect.
    origin: ["http://localhost:5173"],
  },
});

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

//used to store online users
const userSocketMap = {}; //{userId:socketId}

io.on("connection", (socket) => {
  //listening for any incoming connections..
  console.log("A user connected", socket.id);
  //   console.log(socket.handshake);
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  //io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
