import React, { useState, useEffect, useRef } from "react";
import { Send, X, Sparkles } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Hero from "../../components/student/Hero";
import Companies from "../../components/student/Companies";
import CoursesSection from "../../components/student/CoursesSection";
import TestimonialsSection from "../../components/student/TestimonialsSection";
import CallToAction from "../../components/student/CallToAction";
import Footer from "../../components/student/Footer";

const Home = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "🤖 Hello! I'm your AI Study Buddy powered by Gemini! Ask me anything about coding, programming concepts, or our courses!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Initialize Gemini AI
  const API_KEY = "AIzaSyDhszWuhkQExiMiacdSoFf27RYqJOXANmY";
  const genAI = new GoogleGenerativeAI(API_KEY);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Format message text with basic markdown-like styling
  const formatMessage = (text) => {
    if (!text) return "";
    
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Handle bullet points
      if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
        return (
          <div key={index} className="flex items-start gap-2 ml-4 my-1">
            <span className="text-purple-600 font-bold">•</span>
            <span>{line.replace(/^[\*\-]\s*/, '').trim()}</span>
          </div>
        );
      }
      
      // Handle numbered lists
      if (/^\d+\./.test(line.trim())) {
        return (
          <div key={index} className="flex items-start gap-2 ml-4 my-1">
            <span className="text-purple-600 font-semibold">{line.match(/^\d+/)[0]}.</span>
            <span>{line.replace(/^\d+\.\s*/, '').trim()}</span>
          </div>
        );
      }
      
      // Handle bold text (wrapped in **)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const boldMatches = [...line.matchAll(boldRegex)];
      
      if (boldMatches.length > 0) {
        const parts = [];
        let lastIndex = 0;
        
        boldMatches.forEach((match, i) => {
          if (match.index > lastIndex) {
            parts.push(line.slice(lastIndex, match.index));
          }
          parts.push(
            <strong key={`bold-${index}-${i}`} className="font-bold text-gray-900">
              {match[1]}
            </strong>
          );
          lastIndex = match.index + match[0].length;
        });
        
        if (lastIndex < line.length) {
          parts.push(line.slice(lastIndex));
        }
        
        return <div key={index} className="my-1">{parts}</div>;
      }
      
      // Handle code blocks (wrapped in `)
      if (line.includes('`')) {
        const codeParts = line.split('`');
        return (
          <div key={index} className="my-1">
            {codeParts.map((part, i) => 
              i % 2 === 0 ? (
                part
              ) : (
                <code key={i} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-mono">
                  {part}
                </code>
              )
            )}
          </div>
        );
      }
      
      // Regular paragraph
      if (line.trim()) {
        return <div key={index} className="my-1">{line}</div>;
      }
      
      // Empty line (paragraph break)
      return <div key={index} className="h-2"></div>;
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput("");
    
    setMessages(prev => [...prev, { from: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `You are a helpful AI assistant for an educational platform called EdTechBD. The platform offers courses in Python, JavaScript, and Machine Learning. Please provide helpful, concise, and educational responses to programming and learning questions.

User question: ${userMessage}`;
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const aiText = response.text();
      
      setMessages(prev => [...prev, { from: "ai", text: aiText }]);
      
    } catch (error) {
      console.error("Error calling Gemini AI:", error);
      
      let errorMessage = "Sorry, I encountered an error. ";
      
      if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("API key")) {
        errorMessage += "The API key appears to be invalid.";
      } else if (error.message?.includes("quota") || error.message?.includes("429")) {
        errorMessage += "API quota exceeded. Please try again later.";
      } else if (error.message?.includes("SAFETY") || error.message?.includes("blocked")) {
        errorMessage += "The content was blocked. Please try rephrasing your question.";
      } else {
        errorMessage += "Please try again.";
      }
      
      setMessages(prev => [...prev, { from: "ai", text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-7 text-center relative">
      <Hero />
      <Companies />
      <CoursesSection />
      <TestimonialsSection />
      <CallToAction />
      <Footer />

      {/* 🌟 Floating AI Button - Animated & Alive */}
      <div
        onClick={() => setChatOpen(!chatOpen)}
        className="group fixed top-20 right-10 z-50 cursor-pointer transition-all duration-300"
      >
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-2xl opacity-40 animate-pulse"></div>
        
        {/* Middle rotating ring */}
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-75 blur-md animate-spin-slow"></div>
        
        {/* Main button */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {/* Sparkle effects */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute top-2 right-3 w-1 h-1 bg-white rounded-full animate-ping"></div>
            <div className="absolute bottom-3 left-2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: "0.5s" }}></div>
            <div className="absolute top-1/2 left-1 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{ animationDelay: "1s" }}></div>
          </div>
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-shimmer"></div>
          
          {/* Bot icon with breathing effect */}
          <div className="relative z-10 animate-bounce-subtle">
            <Sparkles size={28} className="text-white drop-shadow-lg" strokeWidth={2.5} />
          </div>
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
            Ask me anything! 💬
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>
      </div>

      {/* 💬 Floating Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-[420px] h-[600px] bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl flex flex-col overflow-hidden z-50" style={{
          animation: "slideUp 0.3s ease-out"
        }}>
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white p-5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm p-2 flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base">AI Learning Assistant</h3>
                <p className="text-xs text-purple-100">Powered by Gemini AI</p>
              </div>
            </div>
            <button 
              onClick={() => setChatOpen(false)} 
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-br from-gray-50/50 to-blue-50/30 chat-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 ${
                  msg.from === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.from === "ai"
                    ? "bg-gradient-to-br from-purple-600 to-blue-600"
                    : "bg-gradient-to-br from-green-500 to-emerald-600"
                }`}>
                  {msg.from === "ai" ? (
                    <Sparkles size={16} className="text-white" />
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex-1 ${msg.from === "user" ? "items-end" : ""}`}>
                  {msg.from === "ai" && (
                    <div className="text-xs font-semibold text-purple-600 mb-1 ml-1">
                      AI Assistant
                    </div>
                  )}
                  <div
                    className={`p-4 rounded-2xl shadow-md ${
                      msg.from === "ai"
                        ? "bg-white/90 backdrop-blur-sm text-gray-800 rounded-tl-none border border-purple-100"
                        : "bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-tr-none ml-auto max-w-[85%]"
                    }`}
                  >
                    <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.from === "ai" ? "formatted-text" : ""
                    }`}>
                      {formatMessage(msg.text)}
                    </div>
                  </div>
                  {msg.from === "ai" && (
                    <div className="text-xs text-gray-400 mt-1 ml-1">
                      Just now
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Sparkles size={16} className="text-white animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-purple-600 mb-1 ml-1">
                    AI Assistant
                  </div>
                  <div className="p-4 rounded-2xl rounded-tl-none bg-white/90 backdrop-blur-sm shadow-md border border-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 bg-white/90 backdrop-blur-md p-4">
            <div className="flex gap-2 items-end">
              <input
                type="text"
                placeholder="Ask me anything about programming..."
                className="flex-1 px-4 py-3 text-sm outline-none bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`p-3 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 ${
                  isLoading || !input.trim() ? "opacity-50 cursor-not-allowed" : "hover:from-purple-700 hover:to-blue-700"
                }`}
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Press Enter to send • Powered by Gemini AI
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
