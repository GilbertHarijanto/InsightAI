// src/components/Chatbot.js
import React, { useState, useRef, useEffect, useContext } from "react";
import "./ChatPanel.css";
import { noContextMenu } from "pdfjs-dist";
import { MessageContext } from "../contexts/MessageContext";

const gestureGraph = {
  question: "I have a question",
  fist: "Please take a screenshot",
  pointLeft: "Next page please",
  pointRight: "Previous page please",
  okSign: "Please take notes",
};

const ChatPanel = () => {
  const { messages, setMessages } = useContext(MessageContext);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");

      // Simulate bot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Thank you for your message!", sender: "bot" },
        ]);
      }, 1000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      <h1
        style={{
          color: "white",
          fontFamily: "sans-serif",
          textAlign: "center",
        }}
      >
        AI Assistant
      </h1>
      <div
        className="chat-window"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      {/* <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div> */}
    </div>
  );
};

export default ChatPanel;
