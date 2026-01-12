import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat messages from Firestore in real-time
  useEffect(() => {
    if (!user) return;

    const messagesQuery = query(
      collection(db, "chats"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const chatData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort on client side (ascending for chat)
      chatData.sort((a, b) => a.timestamp?.toMillis() - b.timestamp?.toMillis());
      setMessages(chatData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const userMessage = input;
    setInput("");
    setIsTyping(true);

    try {
      // Save user message to Firestore
      await addDoc(collection(db, "chats"), {
        userId: user.uid,
        text: userMessage,
        sender: "user",
        timestamp: new Date(),
      });

      // Prepare conversation history for ChatGPT (last 10 messages for context)
      const recentMessages = messages.slice(-10).map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      }));

      // Add current message
      recentMessages.push({
        role: "user",
        content: userMessage
      });

      // Call backend API
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: recentMessages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.response;

      // Save AI response to Firestore
      await addDoc(collection(db, "chats"), {
        userId: user.uid,
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      });

    } catch (error) {
      console.error("Error sending message:", error);
      // Save error message
      await addDoc(collection(db, "chats"), {
        userId: user.uid,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: "ai",
        timestamp: new Date(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="mb-6">
        <h2 className="text-3xl font-light text-[#4a5a49] mb-2">AI Support</h2>
        <p className="text-[#6b7f6a] font-light">A safe space to share your thoughts</p>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-white/30 backdrop-blur-sm rounded-3xl p-6 mb-6 space-y-4 border border-[#e8e8df]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-[#6b7f6a] font-light">Loading your conversation...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <svg className="w-16 h-16 text-[#8b9c8a] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-[#6b7f6a] font-light mb-2">Start a conversation</p>
              <p className="text-[#9aa99a] text-sm font-light">Share how you're feeling or ask for guidance</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-4 rounded-2xl max-w-xs font-light ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-[#6b7f6a] to-[#8b9c8a] text-white"
                      : "bg-white/80 backdrop-blur-sm text-[#4a5a49] border border-[#e8e8df]"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/80 backdrop-blur-sm text-[#4a5a49] border border-[#e8e8df] p-4 rounded-2xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-[#6b7f6a] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#6b7f6a] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-[#6b7f6a] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="flex space-x-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isTyping}
          className="flex-1 border border-[#c5d0c4] bg-white/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#8b9c8a]/50 focus:border-transparent transition text-[#4a5a49] placeholder-[#9aa99a] font-light disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="bg-gradient-to-r from-[#6b7f6a] to-[#8b9c8a] text-white px-8 py-4 rounded-2xl hover:shadow-xl hover:shadow-[#6b7f6a]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-light"
        >
          {isTyping ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Chat;