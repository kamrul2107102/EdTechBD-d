import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Lock,
  Crown,
  Trophy,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Award,
  Target,
  Zap,
  Gift,
  ArrowLeft,
  ShoppingCart,
  CreditCard,
  X,
} from "lucide-react";
import { AppContext } from "../../context/AppContext";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";

const PremiumMLCourse = () => {
  const navigate = useNavigate();
  const { allCourses } = useContext(AppContext);
  const { user } = useUser();
  const [courseData, setCourseData] = useState(null);
  const [completedUnits, setCompletedUnits] = useState([0]); // Unit 0 is unlocked by default
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const COURSE_PRICE = 5;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

  // Find the Machine Learning Certification Course from database
  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const mlCourse = allCourses.find(
        (course) =>
          course.courseTitle?.toLowerCase().includes("machine learning") &&
          course.courseTitle?.toLowerCase().includes("certification")
      );
      if (mlCourse) {
        setCourseData(mlCourse);
      }
    }
    // Fetch lessons from backend
    fetchLessons();
  }, [allCourses]);

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/lesson/course/ml-certification-course`);
      setLessons(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      setLoading(false);
    }
  };

  // Check if user has purchased the course
  useEffect(() => {
    if (user) {
      // Check localStorage for purchase status
      const purchaseKey = `premium_ml_purchased_${user.id}`;
      const purchased = localStorage.getItem(purchaseKey);
      if (purchased === "true") {
        setHasPurchased(true);
      }
    }
  }, [user]);

  // Course structure with sections and units
  const courseStructure = [
    {
      section: 1,
      title: "Getting Started",
      units: [
        {
          id: 0,
          title: "Introduction to ML",
          description: "Learn the basics of Machine Learning",
          type: "lesson",
          icon: Star,
          color: "from-green-400 to-emerald-500",
        },
      ],
    },
    {
      section: 2,
      title: "Foundation Concepts",
      units: [
        {
          id: 1,
          title: "Data Preprocessing",
          description: "Clean and prepare your data",
          type: "lesson",
          icon: BookOpen,
          color: "from-blue-400 to-cyan-500",
        },
        {
          id: 2,
          title: "Unit Checkpoint",
          description: "Test your knowledge",
          type: "test",
          icon: Trophy,
          color: "from-purple-400 to-pink-500",
        },
      ],
    },
    {
      section: 3,
      title: "Supervised Learning",
      units: [
        {
          id: 3,
          title: "Linear Regression",
          description: "Predict continuous values",
          type: "lesson",
          icon: Target,
          color: "from-orange-400 to-red-500",
        },
        {
          id: 4,
          title: "Treasure Chest",
          description: "Earn rewards!",
          type: "reward",
          icon: Gift,
          color: "from-yellow-400 to-amber-500",
        },
        {
          id: 5,
          title: "Classification",
          description: "Categorize your data",
          type: "lesson",
          icon: Zap,
          color: "from-green-400 to-teal-500",
        },
      ],
    },
    {
      section: 4,
      title: "Advanced Topics",
      units: [
        {
          id: 6,
          title: "Neural Networks",
          description: "Deep learning fundamentals",
          type: "lesson",
          icon: Sparkles,
          color: "from-indigo-400 to-purple-500",
        },
        {
          id: 7,
          title: "Unit Review",
          description: "Practice what you learned",
          type: "practice",
          icon: BookOpen,
          color: "from-pink-400 to-rose-500",
        },
        {
          id: 8,
          title: "Final Assessment",
          description: "Complete the course",
          type: "test",
          icon: Award,
          color: "from-yellow-400 to-orange-500",
        },
      ],
    },
  ];

  const isUnitUnlocked = (unitId) => {
    // First unit (Getting Started) is always free
    if (unitId === 0) return true;
    
    // All other units require purchase
    if (!hasPurchased) return false;
    
    // If purchased, first 3 units (0, 1, 2) are unlocked immediately
    if (unitId <= 2) return true;
    
    // Units after 2 require previous unit completion
    // Check if previous unit is completed
    const previousUnitId = unitId - 1;
    return completedUnits.includes(previousUnitId);
  };

  const handleUnitClick = (unit) => {
    // Check purchase requirement FIRST for paid content (except free unit 0)
    if (unit.id !== 0 && !hasPurchased) {
      setShowPurchaseModal(true);
      return;
    }

    // Check if unit is locked due to incomplete previous lesson
    if (!isUnitUnlocked(unit.id) && hasPurchased) {
      toast.warning("🔒 Complete the previous lesson first to unlock this unit!");
      return;
    }

    // Special handling for reward and practice units only (not tests - they should work)
    if (unit.type === "reward" || unit.type === "practice") {
      toast.info(`🎁 ${unit.title} - Coming soon!`);
      return;
    }

    // Find the corresponding lesson (for lessons and tests)
    const lesson = lessons.find(l => l.unitNumber === unit.id);
    
    if (!lesson) {
      console.log("Available lessons:", lessons);
      console.log("Looking for unit:", unit.id);
      toast.error(`Lesson content not available yet for "${unit.title}"`);
      return;
    }

    // Navigate to the lesson/test
    if (isUnitUnlocked(unit.id)) {
      navigate(`/lesson/${lesson.lessonId}`);
    }
  };

  const handlePurchase = () => {
    if (!user) {
      toast.error("Please sign in to purchase this course");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Save purchase to localStorage (in production, this should be saved to backend)
      const purchaseKey = `premium_ml_purchased_${user.id}`;
      localStorage.setItem(purchaseKey, "true");
      
      setHasPurchased(true);
      setShowPurchaseModal(false);
      setIsProcessing(false);
      
      toast.success("🎉 Course purchased successfully! All lessons are now unlocked.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header - Desktop */}
      <header className="hidden lg:block sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/learn")}
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Courses</span>
              </button>
            </div>

            <div className="flex items-center gap-6">
              {/* Progress Stats */}
              <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                <Star size={20} className="text-green-600" fill="#16a34a" />
                <span className="font-bold text-green-700">
                  {completedUnits.length * 10} XP
                </span>
              </div>

              <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
                <Trophy size={20} className="text-purple-600" />
                <span className="font-bold text-purple-700">
                  {completedUnits.length}/
                  {courseStructure.reduce((acc, s) => acc + s.units.length, 0)}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full">
                <Crown size={20} className="text-amber-600" fill="#d97706" />
                <span className="font-bold text-amber-700">Premium</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Header - Mobile */}
      <header className="lg:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate("/learn")}
              className="text-gray-700 hover:text-green-600"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              <Crown size={20} className="text-amber-600" fill="#d97706" />
              <span className="font-bold text-amber-700">Premium</span>
            </div>
          </div>

          <div className="flex items-center justify-around">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-green-600" fill="#16a34a" />
              <span className="font-bold text-green-700 text-sm">
                {completedUnits.length * 10}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-purple-600" />
              <span className="font-bold text-purple-700 text-sm">
                {completedUnits.length}/
                {courseStructure.reduce((acc, s) => acc + s.units.length, 0)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto px-4 py-8 lg:py-12">
        {/* Purchase Banner (shown if not purchased) */}
        {!hasPurchased && (
          <div className="mb-8 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-2xl shadow-2xl p-6 text-white animate-slide-down">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                  <Crown size={32} className="text-yellow-200" fill="#fef08a" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <span>Unlock Full Course Access</span>
                    <Sparkles size={20} />
                  </h3>
                  <p className="text-amber-100 text-sm">
                    Get lifetime access to all 9 lessons for just <span className="font-bold text-white">${COURSE_PRICE}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPurchaseModal(true)}
                className="bg-white text-orange-600 font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
              >
                <ShoppingCart size={20} />
                <span>Purchase Now</span>
              </button>
            </div>
          </div>
        )}

        {/* Success Banner (shown after purchase) */}
        {hasPurchased && (
          <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-6 text-white animate-slide-down">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={32} className="text-green-100" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <span>Course Unlocked!</span>
                    <Sparkles size={20} />
                  </h3>
                  <p className="text-green-100 text-sm">
                    You have full access to all lessons. Start learning and earn your certificate!
                  </p>
                </div>
              </div>
              {/* Unpurchase Button (for testing) */}
              <button
                onClick={() => {
                  const purchaseKey = `premium_ml_purchased_${user?.id}`;
                  localStorage.removeItem(purchaseKey);
                  setHasPurchased(false);
                  toast.info("🔄 Purchase reset for testing");
                  window.location.reload();
                }}
                className="text-green-100 hover:text-white underline text-sm font-medium transition-colors"
              >
                Unpurchase (Testing)
              </button>
            </div>
          </div>
        )}

        {/* Premium Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-white px-6 py-3 rounded-full shadow-lg mb-4 animate-shimmer bg-size-200">
            <Crown size={24} fill="white" />
            <span className="font-bold text-lg">Premium Tutorial</span>
            <Sparkles size={20} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            {courseData?.courseTitle || "Machine Learning Certification Course"}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {courseData?.courseDescription ||
              "Master Machine Learning with our comprehensive, gamified learning path"}
          </p>
        </div>

        {/* Guidebook Button */}
        <div className="flex justify-end mb-6">
          <button className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-green-500 text-green-600 px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300">
            <BookOpen size={20} />
            <span>GUIDEBOOK</span>
          </button>
        </div>

        {/* Snake Path Learning Journey */}
        <div className="relative">
          {courseStructure.map((section, sectionIdx) => (
            <div key={section.section} className="mb-16">
              {/* Section Header */}
              <div
                className={`relative z-10 text-center mb-8 ${
                  sectionIdx === 0 ? "animate-bounce-in" : ""
                }`}
              >
                <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full shadow-lg mb-3">
                  <span className="font-bold text-sm tracking-wide">
                    SECTION {section.section}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {section.title}
                </h2>
              </div>

              {/* Units in Snake Pattern */}
              <div className="relative w-full max-w-5xl mx-auto">
                {section.units.map((unit, unitIdx) => {
                  const Icon = unit.icon;
                  const isUnlocked = isUnitUnlocked(unit.id);
                  const isCompleted = completedUnits.includes(unit.id);
                  const isFirst = unit.id === 0;

                  // Create proper snake zigzag pattern: left -> right -> left -> right
                  const globalUnitIdx = courseStructure
                    .slice(0, sectionIdx)
                    .reduce((acc, s) => acc + s.units.length, 0) + unitIdx;
                  
                  const isLeft = globalUnitIdx % 2 === 0; // Alternate between left and right

                  return (
                    <div
                      key={unit.id}
                      className={`relative mb-24 lg:mb-32 w-full`}
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${unitIdx * 0.1}s both`,
                      }}
                    >
                      {/* Connecting Curved Path */}
                      {globalUnitIdx > 0 && (
                        <div className="hidden lg:block absolute bottom-full left-0 right-0 w-full -z-10" style={{ 
                          height: '150px',
                          pointerEvents: 'none'
                        }}>
                          <svg
                            width="100%"
                            height="150"
                            viewBox="0 0 1000 150"
                            preserveAspectRatio="xMidYMid meet"
                            className="w-full"
                          >
                            {/* Snake curve: from previous unit to current */}
                            {isLeft ? (
                              // Curve from right to left (previous unit was on right, current on left)
                              <path
                                d="M 850 0 C 850 50, 500 75, 150 150"
                                fill="none"
                                stroke={isUnlocked ? "#10b981" : "#cbd5e1"}
                                strokeWidth="8"
                                strokeLinecap="round"
                                opacity={isUnlocked ? "1" : "0.5"}
                              />
                            ) : (
                              // Curve from left to right (previous unit was on left, current on right)
                              <path
                                d="M 150 0 C 150 50, 500 75, 850 150"
                                fill="none"
                                stroke={isUnlocked ? "#10b981" : "#cbd5e1"}
                                strokeWidth="8"
                                strokeLinecap="round"
                                opacity={isUnlocked ? "1" : "0.5"}
                              />
                            )}
                          </svg>
                        </div>
                      )}

                      {/* Unit Card Container */}
                      <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'} w-full`}>
                      <div
                        onClick={() => handleUnitClick(unit)}
                        className={`relative w-full max-w-[280px] sm:max-w-sm lg:max-w-[380px] cursor-pointer group`}
                      >
                        {/* Lock Overlay for Unpurchased Content */}
                        {!hasPurchased && unit.id !== 0 && (
                          <div className="absolute inset-0 z-10 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-white">
                            <div className="relative">
                              <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
                              <div className="relative w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-2xl">
                                <Lock size={32} className="text-white" />
                              </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                              <Crown size={20} className="text-amber-400" fill="#fbbf24" />
                              <span>Premium Content</span>
                            </h3>
                            <p className="text-gray-300 text-sm mb-4 px-6 text-center">
                              Unlock all lessons for just ${COURSE_PRICE}
                            </p>
                            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                              <ShoppingCart size={18} />
                              <span>Purchase Course</span>
                            </button>
                          </div>
                        )}

                        {/* Lock Overlay for Sequential Progression (after purchase) */}
                        {hasPurchased && !isUnitUnlocked(unit.id) && (
                          <div className="absolute top-4 right-4 z-10">
                            <div className="relative">
                              <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-40 animate-pulse"></div>
                              <div className="relative w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                                <Lock size={16} className="text-white" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Glow Effect for Active Units */}
                        {isUnitUnlocked(unit.id) && !isCompleted && (
                          <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                        )}

                        <div
                          className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
                            isUnlocked || hasPurchased
                              ? "group-hover:shadow-2xl group-hover:-translate-y-2"
                              : "opacity-60"
                          } ${isCompleted ? "ring-4 ring-green-400" : ""}`}
                        >
                          {/* Unit Header */}
                          <div
                            className={`bg-gradient-to-r ${unit.color} p-6 lg:p-8 text-white relative overflow-hidden`}
                          >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                              <div className="absolute inset-0" style={{
                                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                                backgroundSize: "20px 20px"
                              }} />
                            </div>

                            <div className="relative flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  {isCompleted ? (
                                    <CheckCircle2
                                      size={40}
                                      className="text-white"
                                      fill="white"
                                    />
                                  ) : isUnlocked ? (
                                    <Icon size={40} className="text-white" />
                                  ) : (
                                    <Lock size={40} className="text-white/70" />
                                  )}
                                  {isFirst && (
                                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                      <span className="text-xs font-bold">
                                        START HERE
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <h3 className="text-xl lg:text-2xl font-bold mb-1">
                                  {unit.title}
                                </h3>
                                <p className="text-sm text-white/90">
                                  {unit.description}
                                </p>
                              </div>

                              {/* Premium Badge for Special Units */}
                              {unit.type === "reward" && (
                                <div className="ml-4">
                                  <Crown
                                    size={32}
                                    className="text-yellow-300"
                                    fill="#fde047"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Unit Content */}
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                {unit.type === "lesson" && (
                                  <>
                                    <BookOpen size={18} className="text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                      Lesson
                                    </span>
                                  </>
                                )}
                                {unit.type === "test" && (
                                  <>
                                    <Trophy size={18} className="text-purple-500" />
                                    <span className="text-sm text-gray-600">
                                      Assessment
                                    </span>
                                  </>
                                )}
                                {unit.type === "reward" && (
                                  <>
                                    <Gift size={18} className="text-amber-500" />
                                    <span className="text-sm text-gray-600">
                                      Bonus Content
                                    </span>
                                  </>
                                )}
                              </div>

                              {isCompleted && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle2 size={16} fill="#16a34a" />
                                  <span className="text-xs font-semibold">
                                    Completed
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Action Button */}
                            <button
                              disabled={!isUnitUnlocked(unit.id)}
                              className={`w-full py-3 lg:py-4 rounded-xl font-bold text-sm lg:text-base transition-all duration-300 ${
                                isCompleted
                                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  : isUnitUnlocked(unit.id)
                                  ? `bg-gradient-to-r ${unit.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105`
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                              title={
                                !isUnitUnlocked(unit.id) && hasPurchased
                                  ? "Complete the previous lesson first"
                                  : ""
                              }
                            >
                              {isCompleted
                                ? "Review"
                                : isFirst
                                ? "GET STARTED"
                                : isUnitUnlocked(unit.id)
                                ? "Start Unit"
                                : hasPurchased
                                ? "🔒 Complete Previous First"
                                : `🔒 Locked - $${COURSE_PRICE} to unlock`}
                            </button>
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Completion Trophy */}
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 rounded-full blur-2xl opacity-40 animate-pulse" />
                <div className="relative bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 p-8 rounded-full">
                  <Award size={64} className="text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-2">
                Course Completion
              </h3>
              <p className="text-gray-600">
                Complete all units to earn your certificate!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }} />
              </div>
              
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="relative">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Crown size={40} className="text-yellow-300" fill="#fde047" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">
                  Unlock Full Course
                </h2>
                <p className="text-center text-blue-100 text-sm">
                  Get lifetime access to all lessons & content
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* What's Included */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-purple-600" />
                  <span>What's Included:</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={16} className="text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm">All 9 comprehensive lessons</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={16} className="text-blue-600" />
                    </div>
                    <span className="text-gray-700 text-sm">Interactive coding exercises</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={16} className="text-purple-600" />
                    </div>
                    <span className="text-gray-700 text-sm">Quizzes & assessments</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={16} className="text-amber-600" />
                    </div>
                    <span className="text-gray-700 text-sm">Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={16} className="text-pink-600" />
                    </div>
                    <span className="text-gray-700 text-sm">Lifetime access - Learn at your pace</span>
                  </div>
                </div>
              </div>

              {/* Price Box */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border-2 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-medium">One-time payment</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-800">${COURSE_PRICE}</span>
                    <span className="text-gray-500 text-sm">USD</span>
                  </div>
                </div>
                <p className="text-green-700 text-xs font-medium flex items-center gap-1">
                  <Zap size={14} />
                  <span>Limited time offer - Regular price $19.99</span>
                </p>
              </div>

              {/* Purchase Button */}
              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className={`w-full py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  isProcessing ? "opacity-75 cursor-not-allowed" : "hover:scale-105"
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    <span>Purchase Now</span>
                  </>
                )}
              </button>

              <p className="text-center text-gray-500 text-xs mt-4">
                🔒 Secure payment • 30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .bg-size-200 {
          background-size: 200% 100%;
        }
      `}</style>
    </div>
  );
};

export default PremiumMLCourse;
