import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";
import Loading from "../../components/student/Loading";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const TextPlayer = () => {
  const {
    enrolledCourses,
    backendUrl,
    getToken,
    userData,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);

  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [progressData, setProgressData] = useState({ lectureCompleted: [] });
  const [initialRating, setInitialRating] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  // Flatten all lessons for easy navigation
  const [allLessons, setAllLessons] = useState([]);

  const getCourseData = (courses) => {
    const course = courses.find((c) => c._id === courseId);
    if (course) {
      setCourseData(course);
      course.courseRatings.forEach((item) => {
        if (item.userId === userData?._id) {
          setInitialRating(item.rating);
        }
      });

      // Flatten lessons
      const lessons = [];
      course.courseContent.forEach((chapter, chapterIndex) => {
        chapter.chapterContent.forEach((lecture, lectureIndex) => {
          lessons.push({
            ...lecture,
            chapterTitle: chapter.chapterTitle,
            chapterIndex,
            lectureIndex,
          });
        });
      });
      setAllLessons(lessons);
    }
  };

  const fetchCourseFromBackend = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/user/enrolled-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        getCourseData(data.enrolledCourses);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData(enrolledCourses);
    } else {
      fetchCourseFromBackend();
    }
  }, [enrolledCourses, courseId, userData]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/get-course-progress",
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setProgressData(data.progressData || { lectureCompleted: [] });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/update-course-progress",
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/add-rating",
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getCourseProgress();
  }, [courseId, getToken]);

  const handleNext = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const currentLesson = allLessons[currentLessonIndex];
  const isCompleted = currentLesson && progressData?.lectureCompleted?.includes(currentLesson.lectureId);

  if (!courseData || allLessons.length === 0) {
    return <Loading />;
  }

  const completedCount = allLessons.filter(lesson =>
    progressData?.lectureCompleted?.includes(lesson.lectureId)
  ).length;
  const progressPercentage = (completedCount / allLessons.length) * 100;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-md p-4 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">{courseData.courseTitle}</h1>
              <p className="text-sm text-gray-600">
                Lesson {currentLessonIndex + 1} of {allLessons.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="font-bold text-blue-600">{progressPercentage.toFixed(0)}%</p>
              </div>
              <button
                onClick={() => navigate("/my-enrollments")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Exit
              </button>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Lesson Header */}
            <div className="mb-6">
              <p className="text-sm text-blue-600 font-semibold mb-2">
                {currentLesson.chapterTitle}
              </p>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {currentLesson.lectureTitle}
              </h2>
              {isCompleted && (
                <div className="flex items-center gap-2 text-green-600">
                  <Check size={20} />
                  <span className="font-semibold">Completed</span>
                </div>
              )}
            </div>

            {/* Lesson Content */}
            <div className="prose max-w-none mb-8">
              <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {currentLesson.lectureText}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
              <button
                onClick={handlePrevious}
                disabled={currentLessonIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              {!isCompleted && (
                <button
                  onClick={() => markLectureAsCompleted(currentLesson.lectureId)}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Mark as Complete
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={currentLessonIndex === allLessons.length - 1}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Course Progress Overview */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Course Content</h3>
            <div className="grid grid-cols-1 gap-2">
              {allLessons.map((lesson, index) => (
                <button
                  key={lesson.lectureId}
                  onClick={() => setCurrentLessonIndex(index)}
                  className={`text-left p-3 rounded-md transition ${
                    index === currentLessonIndex
                      ? "bg-blue-100 border-l-4 border-blue-600"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{lesson.chapterTitle}</p>
                      <p className="font-semibold text-gray-800">{lesson.lectureTitle}</p>
                    </div>
                    {progressData?.lectureCompleted?.includes(lesson.lectureId) && (
                      <Check size={20} className="text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Rating Section */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold">Rate this Course:</h3>
              <Rating initialRating={initialRating} onRate={handleRate} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TextPlayer;
