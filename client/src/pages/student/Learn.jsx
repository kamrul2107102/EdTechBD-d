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
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Code, BookOpen, Award, Braces, Brain, Send, X, Sparkles, Crown, Star, Zap } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppContext } from "../../context/AppContext";

const Learn = () => {
  const navigate = useNavigate();
  const { allCourses } = useContext(AppContext);
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

          {/* 🌟 Floating AI Button - Animated & Alive */}
          <div
            onClick={() => setChatOpen(!chatOpen)}
            className={`group fixed top-16 right-10 z-50 cursor-pointer transition-all duration-300 ${
              isFixed ? "opacity-100" : "opacity-90"
            }`}
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

        </div>

        {/* 🌟 Premium Course Card */}
        <div className="mb-12 animate-slide-down">
          <div className="relative group cursor-pointer" onClick={() => navigate('/learn/premium-ml')}>
            {/* Animated glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 animate-pulse transition-opacity duration-300"></div>
            
            <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl shadow-2xl overflow-hidden transform group-hover:-translate-y-2 transition-all duration-300 border-4 border-amber-300">
              {/* Premium Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm">
                  <Crown size={18} fill="white" />
                  <span>PREMIUM</span>
                  <Sparkles size={16} />
                </div>
              </div>

              {/* Floating sparkles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Star className="absolute top-10 left-10 text-yellow-400 animate-ping" size={20} fill="#facc15" style={{ animationDuration: "2s" }} />
                <Star className="absolute bottom-20 right-20 text-amber-400 animate-ping" size={16} fill="#fbbf24" style={{ animationDuration: "3s", animationDelay: "0.5s" }} />
                <Zap className="absolute top-1/2 right-10 text-orange-400 animate-bounce" size={24} style={{ animationDuration: "2.5s" }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                {/* Left Side - Content */}
                <div className="relative z-10">
                  <div className="mb-4">
                    <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      ⚡ NEW COURSE
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                      <Brain size={36} className="text-purple-600" />
                      Machine Learning Certification
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-4">
                      {allCourses?.find(c => c.courseTitle?.toLowerCase().includes("machine learning") && c.courseTitle?.toLowerCase().includes("certification"))?.courseDescription || 
                      "Master ML with our comprehensive, gamified learning path. Interactive lessons, real-world projects, and certification upon completion."}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Zap size={20} className="text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">Gamified snake-path learning experience</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <BookOpen size={20} className="text-blue-600" />
                      </div>
                      <span className="text-gray-700 font-medium">Rich, interactive course content</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Award size={20} className="text-purple-600" />
                      </div>
                      <span className="text-gray-700 font-medium">Earn certification & rewards</span>
                    </div>
                  </div>

                  <button className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group">
                    <span>Start Premium Course</span>
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </div>

                {/* Right Side - Preview Visual */}
                <div className="relative flex items-center justify-center">
                  <div className="relative">
                    {/* Decorative circles */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-200 via-blue-200 to-cyan-200 animate-pulse opacity-30"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-300 via-blue-300 to-cyan-300 animate-ping opacity-20" style={{ animationDuration: "3s" }}></div>
                    </div>

                    {/* Central icon */}
                    <div className="relative z-10 w-40 h-40 rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center shadow-2xl">
                      <Brain size={80} className="text-white" strokeWidth={1.5} />
                    </div>

                    {/* Floating badges */}
                    <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-3 transform rotate-12 group-hover:rotate-6 transition-transform">
                      <Star size={32} className="text-yellow-400" fill="#facc15" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-3 transform -rotate-12 group-hover:-rotate-6 transition-transform">
                      <Award size={32} className="text-purple-600" />
                    </div>
                    <div className="absolute top-1/2 -right-8 bg-white rounded-2xl shadow-xl p-2 transform group-hover:translate-x-2 transition-transform">
                      <Crown size={24} className="text-amber-500" fill="#f59e0b" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Free Courses</h3>
          <p className="text-gray-600 text-sm">Learn the fundamentals at your own pace</p>
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

