import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
    backendUrl,
    userData,
    getToken,
  } = useContext(AppContext);

  const sanitizeCourseData = (raw = {}) => {
    const course = { ...raw };
    course.courseContent = Array.isArray(course.courseContent)
      ? course.courseContent.map((chapter) => ({
          ...chapter,
          chapterContent: Array.isArray(chapter.chapterContent)
            ? chapter.chapterContent.map((lecture) => ({ ...lecture }))
            : [],
        }))
      : [];
    course.courseRatings = Array.isArray(course.courseRatings) ? course.courseRatings : [];
    course.enrolledStudents = Array.isArray(course.enrolledStudents)
      ? course.enrolledStudents
      : [];
    if (typeof course.educator === "string" || !course.educator) {
      course.educator = { name: course.educator || "Unknown" };
    }
    return course;
  };

  const fetchCourseData = async () => {
    if (!id) return setLoading(false);
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/${id}`);
      if (data?.success && data.courseData) {
        setCourseData(sanitizeCourseData(data.courseData));
      } else {
        toast.error(data?.message || "Failed to load course");
        setCourseData(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Network error");
      setCourseData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id, backendUrl]);

  useEffect(() => {
    if (!userData || !courseData) return;
    const enrolledArr = Array.isArray(userData.enrolledCourses) ? userData.enrolledCourses : [];
    const auditedArr = Array.isArray(userData.auditedCourses) ? userData.auditedCourses : [];
    setIsAlreadyEnrolled(Boolean(courseData._id && enrolledArr.includes(courseData._id)));
    setIsAuditing(Boolean(courseData._id && auditedArr.includes(courseData._id)));
  }, [userData, courseData]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const safeGetToken = async () => {
    try {
      const token = await getToken();
      return token;
    } catch (err) {
      console.warn("getToken failed:", err);
      return null;
    }
  };

  const handleAudit = async () => {
    if (!userData || !courseData) return toast.warn("Login to audit");
    if (isAuditing) return toast.info("Already auditing this course");
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/audit-course`,
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Course audited successfully");
        setIsAuditing(true);
        navigate("/audit");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const enrollCourse = async () => {
    if (!courseData) return toast.error("Course not loaded yet");
    if (!userData) return toast.warn("Login to Enroll");
    if (isAlreadyEnrolled) return toast.info("Already Enrolled");

    try {
      const token = await safeGetToken();
      if (!token) return toast.error("Session expired. Please sign in again.");

      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.success) {
        const sessionUrl = data.session_url || data.session?.url || data.sessionUrl;
        if (sessionUrl) {
          window.location.replace(sessionUrl);
        } else {
          toast.success(data.message || "Redirecting to payment...");
        }
      } else {
        toast.error(data?.message || "Purchase failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Payment request failed");
    }
  };

  const handleUnenroll = async () => {
    if (!userData || !courseData) return toast.warn("Please login first");
    if (!isAlreadyEnrolled) return toast.info("Not enrolled in this course");

    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/unenroll-course`,
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Unenrolled successfully");
        setIsAlreadyEnrolled(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handlePreviewClick = (lecture) => {
    const url = lecture?.lectureUrl || "";
    if (!url) return toast.error("Preview not available for this lecture");

    let videoId = "";
    try {
      if (url.includes("youtu.be")) {
        videoId = url.split("/").pop();
      } else if (url.includes("v=")) {
        videoId = url.split("v=")[1].split("&")[0];
      } else {
        videoId = url.split("/").pop();
      }
    } catch (e) {
      videoId = "";
    }

    if (videoId) setPlayerData({ videoId });
    else toast.error("Could not load preview video");
  };

  const safeLength = (arr) => (Array.isArray(arr) ? arr.length : 0);
  const safeCourseTitle = courseData?.courseTitle || "Untitled course";

  if (loading) return <Loading />;

  if (!courseData) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg">Course not found or failed to load.</p>
      </div>
    );
  }

  const rating = calculateRating ? calculateRating(courseData) : 0;
  const discountedPrice = ((courseData.coursePrice || 0) - ((courseData.discount || 0) * (courseData.coursePrice || 0)) / 100).toFixed(2);

  return (
    <>
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Left: Course Info */}
            <div className="md:col-span-2 space-y-6">
              <div className="inline-block px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-sm font-medium">
                🎓 Best Seller
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                {safeCourseTitle}
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed max-w-2xl"
                dangerouslySetInnerHTML={{ __html: (courseData.courseDescription || "").slice(0, 200) + "..." }}
              />

              {/* Stats Section */}
              <div className="space-y-3 pt-2">
                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-semibold text-white">{rating.toFixed(1)}</span>
                  <span className="text-gray-300">({safeLength(courseData.courseRatings)} reviews)</span>
                </div>

                {/* Students */}
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="font-medium text-white">{safeLength(courseData.enrolledStudents).toLocaleString()} students</span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-white">{calculateCourseDuration ? calculateCourseDuration(courseData) : "-"}</span>
                </div>

                {/* Creator */}
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-300">Created by</span>
                  <span className="font-semibold text-white">{courseData.educator?.name || courseData.educator?.firstName || "Unknown"}</span>
                </div>
              </div>
            </div>

            {/* Right: Sticky Card Preview (Mobile shows below) */}
            <div className="md:sticky md:top-24">
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Video/Thumbnail */}
                <div className="relative">
                  {playerData?.videoId ? (
                    <YouTube
                      videoId={playerData.videoId}
                      opts={{ playerVars: { autoplay: 0 } }}
                      iframeClassName="w-full aspect-video"
                    />
                  ) : (
                    <img
                      src={courseData.courseThumbnail || assets.placeholder_image}
                      alt={courseData.courseTitle || "Course thumbnail"}
                      className="w-full aspect-video object-cover"
                    />
                  )}
                </div>

                <div className="p-6 space-y-6">
                  {/* Pricing */}
                  <div>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-4xl font-bold text-gray-900">{currency}{discountedPrice}</span>
                      {courseData.discount > 0 && (
                        <>
                          <span className="text-lg text-gray-500 line-through">{currency}{(courseData.coursePrice || 0).toFixed(2)}</span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                            {courseData.discount}% OFF
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">5 days left at this price!</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 py-4 border-y border-gray-200">
                    <div className="text-center">
                      <div className="flex justify-center mb-1">
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600">Rating</p>
                      <p className="font-semibold text-gray-900">{rating.toFixed(1)}</p>
                    </div>
                    <div className="text-center border-x border-gray-200">
                      <div className="flex justify-center mb-1">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-900 text-sm">{calculateCourseDuration ? calculateCourseDuration(courseData) : "-"}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center mb-1">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600">Lessons</p>
                      <p className="font-semibold text-gray-900">{calculateNoOfLectures ? calculateNoOfLectures(courseData) : 0}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {userData && !isAuditing && (
                      <button
                        onClick={handleAudit}
                        className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Audit Course (Free)
                      </button>
                    )}

                    {userData && isAuditing && (
                      <div className="w-full py-3 px-4 bg-green-50 text-green-700 font-semibold rounded-lg border-2 border-green-500 text-center flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Currently Auditing
                      </div>
                    )}

                    {!isAlreadyEnrolled ? (
                      <button
                        onClick={enrollCourse}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Enroll Now
                      </button>
                    ) : (
                      <>
                        <div className="w-full py-3 px-4 bg-blue-50 text-blue-700 font-semibold rounded-lg border-2 border-blue-500 text-center flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Enrolled
                        </div>
                        <button
                          onClick={handleUnenroll}
                          className="w-full py-2.5 px-4 bg-white text-red-600 font-medium rounded-lg border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                        >
                          Unenroll from Course
                        </button>
                      </>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Course Content */}
          <div className="space-y-8">
            
            {/* Course Structure */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Course Curriculum
              </h2>

              <div className="space-y-3">
                {Array.isArray(courseData.courseContent) && courseData.courseContent.length > 0 ? (
                  courseData.courseContent.map((chapter, index) => (
                    <div key={chapter._id || index}>
                      <div
                        className="flex items-center justify-between px-5 py-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => toggleSection(index)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`transform transition-transform duration-200 ${openSections[index] ? "rotate-180" : ""}`}>
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          <p className="font-semibold text-gray-800">{chapter.chapterTitle || "Untitled chapter"}</p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="hidden sm:inline">{safeLength(chapter.chapterContent)} lectures</span>
                          <span className="font-medium">{calculateChapterTime ? calculateChapterTime(chapter) : "-"}</span>
                        </div>
                      </div>

                      <div className={`transition-all duration-300 ${openSections[index] ? "max-h-screen" : "max-h-0"} overflow-hidden`}>
                        <div className="bg-white px-5 py-3 border-t border-gray-200">
                          {Array.isArray(chapter.chapterContent) && chapter.chapterContent.length > 0 ? (
                            <ul className="space-y-2">
                              {chapter.chapterContent.map((lecture, i) => (
                                <li key={lecture.lectureId || i} className="flex items-center justify-between py-3 hover:bg-gray-50 rounded px-3 -mx-3">
                                  <div className="flex items-center gap-3 flex-1">
                                    <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                    </svg>
                                    <span className="text-sm text-gray-700">{lecture.lectureTitle || "Untitled lecture"}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {lecture.isPreviewFree && (
                                      <button
                                        onClick={() => handlePreviewClick(lecture)}
                                        className="text-xs font-medium text-purple-600 hover:text-purple-700 underline"
                                      >
                                        Preview
                                      </button>
                                    )}
                                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                      {humanizeDuration((lecture.lectureDuration || 0) * 60 * 1000, { units: ["h", "m"] })}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="py-4 text-gray-500 text-sm">No lectures available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">No course structure available.</p>
                )}
              </div>
            </div>

            {/* Course Description & What's Included - Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Course Description */}
              <div className="bg-gray-200 rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About This Course
                </h3>
                <div className="prose prose-sm md:prose max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: courseData.courseDescription || "" }}
                />
              </div>

              {/* What's Included Section */}
              <div className="bg-gray-200 rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  This course includes:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Lifetime access with free updates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Interactive quizzes & assignments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Downloadable resources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Certificate of completion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Step-by-step project guidance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>


        </div>
      </div>

      <Footer />
    </>
  );
}
