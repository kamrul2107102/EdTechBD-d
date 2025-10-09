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
import { Code, BookOpen, Award, Braces, Brain, Send, X } from "lucide-react";

const Learn = () => {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "🤖 Hello! I’m your AI Study Buddy. Ask me anything about coding or your courses!" },
  ]);
  const [input, setInput] = useState("");
  const [isFixed, setIsFixed] = useState(false);

  const sectionRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
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
        <div className="fixed bottom-24 right-6 w-96 bg-white/80 backdrop-blur-lg border border-white/40 shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-slide-up z-50">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
                alt="AI Bot"
                className="w-6 h-6 rounded-full bg-white p-1"
              />
              <h3 className="font-semibold">AI Learning Assistant</h3>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-white hover:opacity-80">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto max-h-96 space-y-3 bg-gradient-to-br from-white/60 to-blue-50/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl max-w-[85%] ${
                  msg.from === "ai"
                    ? "bg-blue-100 text-gray-800 self-start"
                    : "bg-green-200 text-gray-900 self-end ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex border-t border-gray-200 bg-white/80 backdrop-blur-md">
            <input
              type="text"
              placeholder="Ask me about Python, JS, ML..."
              className="flex-1 p-3 text-sm outline-none bg-transparent"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="p-3 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-r-2xl hover:opacity-90 transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learn;

