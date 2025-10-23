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
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Left: Course Info */}
            <div className="md:col-span-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 rounded-full text-sm font-medium backdrop-blur-sm">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Best Seller
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-white">
                {safeCourseTitle}
              </h1>

              <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl font-light"
                dangerouslySetInnerHTML={{ __html: (courseData.courseDescription || "").slice(0, 200) + "..." }}
              />

              {/* Stats Section */}
              <div className="flex flex-wrap gap-6 pt-2">
                {/* Rating */}
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-semibold text-white text-sm">{rating.toFixed(1)}</span>
                  <span className="text-gray-300 text-sm">({safeLength(courseData.courseRatings)})</span>
                </div>

                {/* Students */}
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                  <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="font-medium text-white text-sm">{safeLength(courseData.enrolledStudents).toLocaleString()} students</span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                  <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-white text-sm">{calculateCourseDuration ? calculateCourseDuration(courseData) : "-"}</span>
                </div>

                {/* Creator */}
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                  <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-300 text-sm">by</span>
                  <span className="font-semibold text-white text-sm">{courseData.educator?.name || courseData.educator?.firstName || "Unknown"}</span>
                </div>
              </div>
            </div>

            {/* Right: Sticky Card Preview (Mobile shows below) */}
            <div className="md:sticky md:top-24">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl transition-shadow duration-300">
                {/* Video/Thumbnail */}
                <div className="relative group">
                  {playerData?.videoId ? (
                    <YouTube
                      videoId={playerData.videoId}
                      opts={{ playerVars: { autoplay: 0 } }}
                      iframeClassName="w-full aspect-video"
                    />
                  ) : (
                    <>
                      <img
                        src={courseData.courseThumbnail || assets.placeholder_image}
                        alt={courseData.courseTitle || "Course thumbnail"}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  )}
                </div>

                <div className="p-7 space-y-6">
                  {/* Pricing */}
                  <div>
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-5xl font-black text-gray-900 tracking-tight">{currency}{discountedPrice}</span>
                      {courseData.discount > 0 && (
                        <>
                          <span className="text-xl text-gray-400 line-through font-medium">{currency}{(courseData.coursePrice || 0).toFixed(2)}</span>
                          <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full shadow-md">
                            {courseData.discount}% OFF
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-red-700 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                      <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">5 days left at this price!</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 py-5 border-y border-gray-100">
                    <div className="text-center group">
                      <div className="flex justify-center mb-2">
                        <div className="p-2 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
                          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Rating</p>
                      <p className="font-bold text-gray-900 text-lg">{rating.toFixed(1)}</p>
                    </div>
                    <div className="text-center border-x border-gray-100 group">
                      <div className="flex justify-center mb-2">
                        <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Duration</p>
                      <p className="font-bold text-gray-900 text-sm">{calculateCourseDuration ? calculateCourseDuration(courseData) : "-"}</p>
                    </div>
                    <div className="text-center group">
                      <div className="flex justify-center mb-2">
                        <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Lessons</p>
                      <p className="font-bold text-gray-900 text-lg">{calculateNoOfLectures ? calculateNoOfLectures(courseData) : 0}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {userData && !isAuditing && (
                      <button
                        onClick={handleAudit}
                        className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-green-700 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2.5 text-base"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Audit Course (Free)
                      </button>
                    )}

                    {userData && isAuditing && (
                      <div className="w-full py-3.5 px-5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-bold rounded-xl border-2 border-green-400 text-center flex items-center justify-center gap-2.5 shadow-sm">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Currently Auditing
                      </div>
                    )}

                    {!isAlreadyEnrolled ? (
                      <button
                        onClick={enrollCourse}
                        className="w-full py-4 px-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2.5 text-base relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                        <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="relative z-10">Enroll Now</span>
                      </button>
                    ) : (
                      <>
                        <div className="w-full py-3.5 px-5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-bold rounded-xl border-2 border-blue-400 text-center flex items-center justify-center gap-2.5 shadow-sm">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Enrolled
                        </div>
                        <button
                          onClick={handleUnenroll}
                          className="w-full py-3 px-5 bg-white text-red-600 font-semibold rounded-xl border-2 border-red-200 hover:bg-red-50 hover:border-red-400 transition-all duration-200 shadow-sm hover:shadow"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          {/* Course Content */}
          <div className="space-y-10">
            
            {/* Course Structure */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                Course Curriculum
              </h2>

              <div className="space-y-3">
                {Array.isArray(courseData.courseContent) && courseData.courseContent.length > 0 ? (
                  courseData.courseContent.map((chapter, index) => (
                    <div key={chapter._id || index}>
                      <div
                        className="flex items-center justify-between px-6 py-5 cursor-pointer bg-gradient-to-r from-gray-50 to-gray-50/50 hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 rounded-xl border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-md group"
                        onClick={() => toggleSection(index)}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`transform transition-all duration-300 ${openSections[index] ? "rotate-180" : ""} p-1.5 rounded-lg bg-white group-hover:bg-purple-100 border border-gray-200 group-hover:border-purple-300`}>
                            <svg className="w-4 h-4 text-gray-700 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          <p className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors text-base">{chapter.chapterTitle || "Untitled chapter"}</p>
                        </div>

                        <div className="flex items-center gap-5 text-sm text-gray-600">
                          <span className="hidden sm:inline font-medium bg-white px-3 py-1 rounded-full border border-gray-200 group-hover:border-purple-200">{safeLength(chapter.chapterContent)} lectures</span>
                          <span className="font-semibold text-purple-600">{calculateChapterTime ? calculateChapterTime(chapter) : "-"}</span>
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
              <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 hover:shadow-xl transition-all duration-300">
                <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
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

      {/* Custom Compact Footer for Course Details Page */}
      <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Brand & Copyright */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">ET</span>
              </div>
              <div>
                <span className="font-bold text-base">EdTechBD</span>
                <p className="text-xs text-gray-400">© {new Date().getFullYear()} All rights reserved.</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex gap-6 text-sm text-gray-300">
              <a href="/" className="hover:text-purple-300 transition-colors">Home</a>
              <a href="/courses" className="hover:text-purple-300 transition-colors">Courses</a>
              <a href="/deals" className="hover:text-purple-300 transition-colors">Deals</a>
              <a href="#" className="hover:text-purple-300 transition-colors">Help</a>
              <a href="#" className="hover:text-purple-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-purple-300 transition-colors">Privacy</a>
            </div>

            {/* Social Icons */}
            <div className="flex gap-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
