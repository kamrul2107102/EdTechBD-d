import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Star,
  Trophy,
  Sparkles,
  Clock,
  Code,
  Info,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const LessonPlayer = () => {
  const { lessonId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/lesson/${lessonId}`);
      setLesson(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      toast.error("Failed to load lesson");
      setLoading(false);
    }
  };

  // Combine content blocks and questions into steps
  const getSteps = () => {
    if (!lesson) return [];
    const steps = [];

    // Add content blocks first
    lesson.contentBlocks.forEach((block) => {
      steps.push({ type: "content", data: block });
    });

    // Add questions
    lesson.questions.forEach((question) => {
      steps.push({ type: "question", data: question });
    });

    return steps;
  };

  const steps = getSteps();
  const currentStepData = steps[currentStep];

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const checkAnswer = () => {
    if (currentStepData?.type !== "question") return;

    const question = currentStepData.data;
    const userAnswer = answers[question.questionId];

    if (!userAnswer) {
      toast.warning("Please select an answer");
      return;
    }

    let isCorrect = false;

    if (question.questionType === "multiple-choice" || question.questionType === "true-false") {
      const correctOption = question.options.find((opt) => opt.isCorrect);
      isCorrect = userAnswer === correctOption?.optionId;
    } else if (question.questionType === "code-completion" || question.questionType === "fill-in-blank") {
      isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
    }

    setCurrentFeedback({
      isCorrect,
      explanation: question.explanation,
    });
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentStepData?.type === "question" && !showFeedback) {
      checkAnswer();
      return;
    }

    setShowFeedback(false);
    setCurrentFeedback(null);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitLesson();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowFeedback(false);
      setCurrentFeedback(null);
    }
  };

  const submitLesson = async () => {
    try {
      const submissionAnswers = lesson.questions.map((q) => ({
        questionId: q.questionId,
        answer: answers[q.questionId] || "",
      }));

      const response = await axios.post(
        `${backendUrl}/api/lesson/submit/${user?.id}/${lessonId}`,
        { answers: submissionAnswers }
      );

      setResults(response.data);
      setIsComplete(true);

      if (response.data.passed) {
        toast.success(`🎉 Congratulations! You earned ${response.data.earnedXP} XP!`);
      } else {
        toast.info(`You scored ${response.data.score}%. Try again to pass!`);
      }
    } catch (error) {
      console.error("Error submitting lesson:", error);
      toast.error("Failed to submit lesson");
    }
  };

  const renderContentBlock = (block) => {
    switch (block.blockType) {
      case "text":
        return (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, "<br />") }} />
          </div>
        );

      case "image":
        return (
          <div className="my-6">
            <img
              src={block.imageUrl}
              alt={block.content}
              className="w-full rounded-xl shadow-lg"
            />
            <p className="text-center text-gray-600 mt-2 text-sm">{block.content}</p>
          </div>
        );

      case "code":
        return (
          <div className="my-6">
            <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
              <div className="flex items-center gap-2 text-gray-400 mb-2 text-xs">
                <Code size={14} />
                <span>{block.language || "code"}</span>
              </div>
              <pre className="text-green-400 text-sm">
                <code>{block.content}</code>
              </pre>
            </div>
          </div>
        );

      case "tip":
        return (
          <div className="my-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-600 flex-shrink-0 mt-1" />
              <p className="text-gray-700">{block.content}</p>
            </div>
          </div>
        );

      case "example":
        return (
          <div className="my-6 bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-xl">
            <div className="flex items-start gap-3">
              <Sparkles size={20} className="text-purple-600 flex-shrink-0 mt-1" />
              <div
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, "<br />") }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderQuestion = (question) => {
    const userAnswer = answers[question.questionId];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{question.questionText}</h2>
          {question.questionDescription && (
            <p className="text-gray-600 mb-4">{question.questionDescription}</p>
          )}
          {question.codeSnippet && (
            <div className="bg-gray-900 rounded-xl p-4 my-4">
              <pre className="text-green-400 text-sm">
                <code>{question.codeSnippet}</code>
              </pre>
            </div>
          )}
        </div>

        {question.questionType === "multiple-choice" || question.questionType === "true-false" ? (
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.optionId}
                onClick={() => !showFeedback && handleAnswer(question.questionId, option.optionId)}
                disabled={showFeedback}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  userAnswer === option.optionId
                    ? showFeedback
                      ? option.isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                } ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.optionText}</span>
                  {showFeedback && userAnswer === option.optionId && (
                    <div>
                      {option.isCorrect ? (
                        <CheckCircle2 className="text-green-600" size={24} />
                      ) : (
                        <XCircle className="text-red-600" size={24} />
                      )}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <input
            type="text"
            placeholder="Type your answer..."
            value={userAnswer || ""}
            onChange={(e) => handleAnswer(question.questionId, e.target.value)}
            disabled={showFeedback}
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
          />
        )}

        {showFeedback && currentFeedback && (
          <div
            className={`p-4 rounded-xl ${
              currentFeedback.isCorrect ? "bg-green-50 border-2 border-green-500" : "bg-red-50 border-2 border-red-500"
            }`}
          >
            <div className="flex items-start gap-3">
              {currentFeedback.isCorrect ? (
                <CheckCircle2 className="text-green-600 flex-shrink-0 mt-1" size={24} />
              ) : (
                <XCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
              )}
              <div>
                <h3 className={`font-bold mb-1 ${currentFeedback.isCorrect ? "text-green-800" : "text-red-800"}`}>
                  {currentFeedback.isCorrect ? "Correct!" : "Not quite right"}
                </h3>
                <p className="text-gray-700">{currentFeedback.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderResults = () => {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mb-8">
          {results.passed ? (
            <div className="inline-block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-40 animate-pulse" />
                <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Trophy size={64} className="text-white" />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-xl">
              <XCircle size={64} className="text-white" />
            </div>
          )}
        </div>

        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          {results.passed ? "Lesson Complete!" : "Keep Practicing!"}
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          You scored {results.score}% ({results.correctAnswers}/{results.totalQuestions} correct)
        </p>

        {results.passed && (
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="bg-green-100 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Star className="text-green-600" fill="#16a34a" size={24} />
                <span className="text-2xl font-bold text-green-700">+{results.earnedXP} XP</span>
              </div>
            </div>
            <div className="bg-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-blue-600" size={24} />
                <span className="text-2xl font-bold text-blue-700">+{results.earnedGems} Gems</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/learn/premium-ml")}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Back to Course
          </button>
          {!results.passed && (
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gray-600 text-white font-bold rounded-xl shadow-lg hover:bg-gray-700 transition-all duration-300"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Lesson not found</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
        {renderResults()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>{lesson.estimatedTime} min</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {currentStepData?.type === "content" ? (
            renderContentBlock(currentStepData.data)
          ) : (
            renderQuestion(currentStepData.data)
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              currentStep === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
            }`}
          >
            <ArrowLeft size={20} />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <span>
              {currentStepData?.type === "question" && !showFeedback
                ? "Check"
                : currentStep === steps.length - 1
                ? "Complete"
                : "Continue"}
            </span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;
