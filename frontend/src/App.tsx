import React, { useEffect, useState } from "react";
import  io,{Socket}  from "socket.io-client";

// Define the message type
type Message = string;

const socket: Socket = io("ws://172.27.240.1:8085?room=erdem&username=test", {
  transports: ["websocket"], // Force WebSocket-only connection
  reconnectionAttempts: 5,   // Retry 5 times if the connection fails
  timeout: 5000,             // Wait 5 seconds before failing
});
const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on("connect",()=>{
      console.log("bağlandı");
    })
    socket.on("connect_error", (error:any) => {
      console.error("Connection Error:", error);
    });
    // Listen for new messages from backend
    socket.on("read_message", (msg: Message) => {
      console.log(msg)
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("read_message");
    };
  }, []);

  return (
    // <div style={{ padding: "20px" }}>
    //   <h2>Real-time Messages</h2>
    //   <div style={{ border: "1px solid black", padding: "10px", height: "200px", overflowY: "auto" }}>
    //     {messages.map((msg, index) => (
    //       <div key={index}>{msg}</div>
    //     ))}
    //   </div>
    // </div>
    <>
    <h1>İSA</h1>
    </>
  );
};

export default App;