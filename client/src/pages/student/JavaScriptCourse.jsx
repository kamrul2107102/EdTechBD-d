import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jsCourse } from "../../data/jsCourse";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

// Register only the language we need
SyntaxHighlighter.registerLanguage("javascript", javascript);

const JavaScriptCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Flatten all lessons from all chapters
  const allLessons = jsCourse.chapters.flatMap((chapter) =>
    chapter.lessons.map((lesson) => ({
      ...lesson,
      chapterTitle: chapter.title,
      chapterId: chapter.id,
    }))
  );

  const currentLesson = allLessons[currentLessonIndex];
  const progress = ((currentLessonIndex + 1) / allLessons.length) * 100;

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("jsCourseProgress");
    if (saved) {
      setCompletedLessons(JSON.parse(saved));
    }
  }, []);

  const markAsCompleted = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      const updated = [...completedLessons, lessonId];
      setCompletedLessons(updated);
      localStorage.setItem("jsCourseProgress", JSON.stringify(updated));
    }
  };

  const handleNext = () => {
    markAsCompleted(currentLesson.id);
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToLesson = (index) => {
    setCurrentLessonIndex(index);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50">
        {/* Header */}
        <div className="bg-white border-b shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate("/learn")}
              className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="font-medium">Back to Courses</span>
            </button>
            <h1 className="text-xl font-bold text-gray-800 hidden md:block">
              {jsCourse.title}
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex max-w-7xl mx-auto relative">
          {/* Sidebar */}
          <div
            className={`${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } ${
              sidebarCollapsed ? "md:w-0 md:opacity-0" : "md:w-80 md:opacity-100"
            } md:translate-x-0 fixed md:sticky top-[73px] left-0 w-80 h-[calc(100vh-73px)] bg-white border-r shadow-lg overflow-y-auto transition-all duration-300 z-30`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Course Content
                </h2>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden md:block p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
                >
                  {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
              </div>
              {jsCourse.chapters.map((chapter) => (
                <div key={chapter.id} className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <BookOpen size={18} className="text-yellow-600" />
                    {chapter.title}
                  </h3>
                  <div className="space-y-1 ml-6">
                    {chapter.lessons.map((lesson) => {
                      const lessonIndex = allLessons.findIndex(
                        (l) => l.id === lesson.id
                      );
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isCurrent = lessonIndex === currentLessonIndex;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => goToLesson(lessonIndex)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                            isCurrent
                              ? "bg-yellow-100 text-yellow-700 font-medium"
                              : "hover:bg-gray-100 text-gray-600"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle
                              size={16}
                              className="text-green-500 flex-shrink-0"
                            />
                          ) : (
                            <Circle
                              size={16}
                              className="text-gray-400 flex-shrink-0"
                            />
                          )}
                          <span className="text-sm">{lesson.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          {/* Sidebar Toggle Button (when collapsed) */}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="hidden md:flex fixed top-24 left-4 z-40 p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-lg transition-all duration-200 items-center gap-2"
              title="Show sidebar"
            >
              <ChevronRight size={20} />
              <span className="text-sm font-medium">Course Content</span>
            </button>
          )}

          {/* Main Content */}
          <div className={`flex-1 p-6 md:p-8 transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-0" : ""
          }`}>
            <div className="max-w-4xl mx-auto"
              >
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <div className="flex items-center gap-2 text-sm text-yellow-600 mb-2">
                  <BookOpen size={16} />
                  <span>{currentLesson.chapterTitle}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {currentLesson.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    Lesson {currentLessonIndex + 1} of {allLessons.length}
                  </span>
                  <span>•</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={docco}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {currentLesson.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentLessonIndex === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    currentLessonIndex === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg"
                  }`}
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentLessonIndex === allLessons.length - 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    currentLessonIndex === allLessons.length - 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-700 hover:to-orange-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  {currentLessonIndex === allLessons.length - 1
                    ? "Completed!"
                    : "Next"}
                  {currentLessonIndex !== allLessons.length - 1 && (
                    <ChevronRight size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>
    </>
  );
};

export default JavaScriptCourse;
