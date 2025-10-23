// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Footer from "../../components/student/Footer";
// import { Code, BookOpen, Award, Braces } from "lucide-react";
// import { Brain } from "lucide-react";

// const Learn = () => {
//   const navigate = useNavigate();

//   const courses = [
//     {
//       id: "python-basics",
//       title: "Python for Beginners",
//       description:
//         "Learn Python programming from scratch. Master the fundamentals with hands-on examples and exercises.",
//       icon: Code,
//       color: "from-blue-500 to-cyan-500",
//       lessons: 25,
//       duration: "4 hours",
//       level: "Beginner",
//       route: "/learn/", // ✅ Matches your App.js route for PythonCourse
//     },
//     {
//       id: "javascript-basics",
//       title: "JavaScript for Beginners",
//       description:
//         "Understand the core concepts of JavaScript — the language of the web. Learn syntax, DOM, and interactive web features.",
//       icon: Braces,
//       color: "from-yellow-400 to-orange-500",
//       lessons: 28,
//       duration: "5 hours",
//       level: "Beginner",
//       route: "/learn-js/", // ✅ Matches your App.js route for JavaScriptCourse
//     },
//     {
//       id: "ml-basics",
//       title: "Machine Learning Basics",
//       description:
//         "Learn the core principles of Machine Learning, including supervised and unsupervised algorithms.",
//       icon: Brain, // import Brain from lucide-react
//       color: "from-green-500 to-blue-500",
//       lessons: 24,
//       duration: "6 hours",
//       level: "Intermediate",
//       route: "/learn-ml/",
//     }
//     // Add more courses here in the future    
//   ];

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//         {/* Hero Section */}
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
//           <div className="max-w-6xl mx-auto px-6 text-center">
//             <h1 className="text-5xl font-bold mb-4">Learn Programming</h1>
//             <p className="text-xl text-blue-100">
//               Master coding skills with our interactive, free courses
//             </p>
//           </div>
//         </div>

//         {/* Courses Grid */}
//         <div className="max-w-6xl mx-auto px-6 py-16">
//           <div className="mb-12 text-center md:text-left">
//             <h2 className="text-3xl font-bold text-gray-800 mb-2">
//               Available Courses
//             </h2>
//             <p className="text-gray-600">
//               Start your programming journey today
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {courses.map((course) => {
//               const Icon = course.icon;
//               return (
//                 <div
//                   key={course.id}
//                   onClick={() => navigate(`${course.route}${course.id}`)} // ✅ navigates properly
//                   className="group cursor-pointer"
//                 >
//                   <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
//                     {/* Course Header */}
//                     <div className={`bg-gradient-to-r ${course.color} p-8 text-white`}>
//                       <Icon size={48} strokeWidth={1.5} />
//                       <h3 className="text-2xl font-bold mt-4">{course.title}</h3>
//                     </div>

//                     {/* Course Content */}
//                     <div className="p-6">
//                       <p className="text-gray-600 mb-6 leading-relaxed">
//                         {course.description}
//                       </p>

//                       {/* Course Stats */}
//                       <div className="space-y-3 mb-6">
//                         <div className="flex items-center gap-2 text-sm text-gray-700">
//                           <BookOpen size={18} className="text-blue-600" />
//                           <span>{course.lessons} Lessons</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm text-gray-700">
//                           <Award size={18} className="text-green-600" />
//                           <span>{course.level}</span>
//                         </div>
//                       </div>

//                       {/* Start Button */}
//                       <button
//                         className={`w-full py-3 bg-gradient-to-r ${course.color} text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 transform group-hover:scale-105`}
//                       >
//                         Start Learning
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Coming Soon Section */}
//           <div className="mt-16 text-center">
//             <div className="inline-block bg-white rounded-2xl shadow-lg p-8">
//               <h3 className="text-2xl font-bold text-gray-800 mb-3">
//                 More Courses Coming Soon!
//               </h3>
//               <p className="text-gray-600">
//                 We're working on React, Node.js, and more...
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Learn;
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Code, BookOpen, Award, Braces, Brain, Send, X, Sparkles } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Learn = () => {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "🤖 Hello! I'm your AI Study Buddy powered by Gemini! Ask me anything about coding, programming concepts, or your courses!" },
  ]);
  const [input, setInput] = useState("");
  const [isFixed, setIsFixed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sectionRef = useRef(null);
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
    
    // Split by lines to handle lists and paragraphs
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
      let formattedLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const boldMatches = [...line.matchAll(boldRegex)];
      
      if (boldMatches.length > 0) {
        const parts = [];
        let lastIndex = 0;
        
        boldMatches.forEach((match, i) => {
          // Add text before bold
          if (match.index > lastIndex) {
            parts.push(line.slice(lastIndex, match.index));
          }
          // Add bold text
          parts.push(
            <strong key={`bold-${index}-${i}`} className="font-bold text-gray-900">
              {match[1]}
            </strong>
          );
          lastIndex = match.index + match[0].length;
        });
        
        // Add remaining text
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
    
    // Add user message
    setMessages(prev => [...prev, { from: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      console.log("🔍 Sending request to Gemini AI...");
      console.log("📝 User message:", userMessage);
      
      // Get Gemini model (using gemini-2.0-flash as gemini-pro is deprecated)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // Create context-aware prompt
      const prompt = `You are a helpful AI assistant for an educational platform called EdTechBD. The platform offers courses in Python, JavaScript, and Machine Learning. Please provide helpful, concise, and educational responses to programming and learning questions.

User question: ${userMessage}`;
      
      console.log("📤 Sending prompt to Gemini...");
      
      // Generate response
      const result = await model.generateContent(prompt);
      
      console.log("📥 Received result from Gemini:", result);
      
      const response = result.response;
      console.log("📦 Response object:", response);
      
      const aiText = response.text();
      console.log("✅ AI Text:", aiText);
      
      // Add AI response
      setMessages(prev => [...prev, { from: "ai", text: aiText }]);
      console.log("✨ Message added to chat!");
      
    } catch (error) {
      console.error("❌ Error calling Gemini AI:", error);
      console.error("📋 Error name:", error.name);
      console.error("📋 Error message:", error.message);
      console.error("📋 Full error object:", JSON.stringify(error, null, 2));
      
      let errorMessage = "Sorry, I encountered an error. ";
      
      if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("API key")) {
        errorMessage += "The API key appears to be invalid. Please check your API key configuration.";
      } else if (error.message?.includes("quota") || error.message?.includes("429")) {
        errorMessage += "API quota exceeded. Please try again later.";
      } else if (error.message?.includes("SAFETY") || error.message?.includes("blocked")) {
        errorMessage += "The content was blocked by safety filters. Please try rephrasing your question.";
      } else if (error.message?.includes("fetch") || error.message?.includes("network")) {
        errorMessage += "Network error. Please check your internet connection.";
      } else {
        errorMessage += `${error.message || "Unknown error occurred"}. Please try again.`;
      }
      
      setMessages(prev => [...prev, { 
        from: "ai", 
        text: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🧠 Scroll detection to toggle “fixed” state
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const sectionTop = sectionRef.current.getBoundingClientRect().top;
      setIsFixed(sectionTop <= 0); // when section top goes out of view → fixed
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const courses = [
    {
      id: "python-basics",
      title: "Python for Beginners",
      description: "Learn Python programming from scratch.",
      icon: Code,
      color: "from-blue-500 to-cyan-500",
      lessons: 25,
      level: "Beginner",
      route: "/learn/",
    },
    {
      id: "javascript-basics",
      title: "JavaScript for Beginners",
      description: "Understand the core concepts of JavaScript.",
      icon: Braces,
      color: "from-yellow-400 to-orange-500",
      lessons: 28,
      level: "Beginner",
      route: "/learn-js/",
    },
    {
      id: "ml-basics",
      title: "Machine Learning Basics",
      description: "Learn the core principles of Machine Learning.",
      icon: Brain,
      color: "from-green-500 to-blue-500",
      lessons: 24,
      level: "Intermediate",
      route: "/learn-ml/",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Learn Programming</h1>
        <p className="text-xl text-blue-100">
          Master coding skills with our interactive, free courses
        </p>
      </div>

      {/* Courses Section */}
      <div ref={sectionRef} className="max-w-6xl mx-auto px-6 py-16 relative">
        <div className="mb-12 text-center md:text-left relative">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Available Courses</h2>
          <p className="text-gray-600">Start your programming journey today</p>

          {/* 🌟 Floating AI Button (moves → then fixed) */}
          <div
  onClick={() => setChatOpen(!chatOpen)}
  className={`fixed top-16 right-10 z-50 cursor-pointer flex items-center justify-center 
              bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-full shadow-2xl 
              hover:scale-110 transition-transform duration-300 
              ${isFixed ? "opacity-100" : "opacity-90"}`}
>
  {/* Glowing background */}
  <div className="absolute inset-0 rounded-full bg-gradient-to-r 
                  from-purple-500 to-blue-500 blur-xl opacity-60 animate-pulse"></div>

  {/* Bot icon */}
  <img
    src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
    alt="AI Assistant"
    className="w-10 h-10 relative z-10 object-contain"
  />
</div>

        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <div
                key={course.id}
                onClick={() => navigate(`${course.route}${course.id}`)}
                className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl 
                           transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${course.color} p-8 text-white`}>
                  <Icon size={48} strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold mt-4">{course.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">{course.description}</p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <BookOpen size={18} className="text-blue-600" />
                      <span>{course.lessons} Lessons</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Award size={18} className="text-green-600" />
                      <span>{course.level}</span>
                    </div>
                  </div>
                  <button
                    className={`w-full py-3 bg-gradient-to-r ${course.color} text-white font-semibold rounded-lg hover:opacity-90 transition`}
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            );
          })}
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

export default Learn;

