import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Detect crisis keywords
  const detectCrisisKeywords = (text) => {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end my life', 'want to die', 'better off dead',
      'no reason to live', 'can\'t go on', 'hurt myself', 'self harm', 'suicidal'
    ];
    
    const lowerText = text.toLowerCase();
    return crisisKeywords.some(keyword => lowerText.includes(keyword));
  };

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

      // Check for crisis keywords
      if (detectCrisisKeywords(userMessage)) {
        setShowCrisisAlert(true);
      }

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

      {/* Crisis Alert Modal */}
      {showCrisisAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-light text-[#4a5a49] mb-3">We're Here for You</h3>
              <p className="text-[#6b7f6a] font-light leading-relaxed mb-4">
                It sounds like you might be going through a really difficult time. While I'm here to listen, 
                trained crisis counselors are available 24/7 and can provide immediate support.
              </p>
              <div className="bg-red-50 rounded-2xl p-4 mb-4">
                <p className="text-red-800 font-medium mb-2">Crisis Support Available Now:</p>
                <a href="tel:988" className="text-red-600 font-medium text-lg">📞 Call or Text 988</a>
                <p className="text-red-700 text-sm mt-1">Suicide & Crisis Lifeline - Free & Confidential</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowCrisisAlert(false);
                  // Open crisis resources
                  window.dispatchEvent(new CustomEvent('openCrisisResources'));
                }}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-2xl font-light hover:shadow-xl transition-all"
              >
                View All Crisis Resources
              </button>
              <button
                onClick={() => setShowCrisisAlert(false)}
                className="w-full bg-white border-2 border-[#c5d0c4] text-[#4a5a49] py-3 rounded-2xl font-light hover:bg-gray-50 transition-all"
              >
                Continue Conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;