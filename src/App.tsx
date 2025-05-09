import { useState, type FormEvent, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

interface Message {
  id: number;
  text: string;
  sent: boolean;
}

const socket = io("http://localhost:3000");

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I help you today?", sent: false },
  ]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("chat message", (msg: string) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: msg, sent: false },
      ]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = { id: Date.now(), text: newMessage, sent: true };
      setMessages((prev) => [...prev, message]);
      socket.emit("chat message", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sent ? "sent" : "received"}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
