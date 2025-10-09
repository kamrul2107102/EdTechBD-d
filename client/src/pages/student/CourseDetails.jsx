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

// Defensive, null-safe version of CourseDetails
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

  // sanitize incoming course object
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // ✅ Audit course function
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

  // ✅ Unenroll function
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

  return (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
        <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70"></div>

        {/* left column */}
        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800">
            {safeCourseTitle}
          </h1>

          <p
            className="pt-4 md:text-base text-sm"
            dangerouslySetInnerHTML={{
              __html: (courseData.courseDescription || "").slice(0, 200),
            }}
          ></p>

          {/* review and ratings */}
          <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
            <p>{calculateRating ? calculateRating(courseData) : 0}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating ? calculateRating(courseData) : 0)
                      ? assets.star
                      : assets.star_blank
                  }
                  alt="star"
                  className="w-3.5 h-3.5"
                />
              ))}
            </div>
            <p className="text-blue-600">
              ({safeLength(courseData.courseRatings)} {safeLength(courseData.courseRatings) > 1 ? "ratings" : "rating"})
            </p>
            <p>
              {safeLength(courseData.enrolledStudents)} {safeLength(courseData.enrolledStudents) > 1 ? "students" : "student"}
            </p>
          </div>

          <p className="text-sm">
            Course by {" "}
            <span className="text-blue-600 underline">{courseData.educator?.name || courseData.educator?.firstName || "Unknown"}</span>
          </p>

          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>

            <div className="pt-5">
              {Array.isArray(courseData.courseContent) && courseData.courseContent.length > 0 ? (
                courseData.courseContent.map((chapter, index) => (
                  <div key={chapter.chapterId || index} className="border border-gray-300 bg-white mb-2 rounded">
                    <div
                      className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""}`}
                          src={assets.down_arrow_icon}
                          alt="down_arrow_icon"
                        />
                        <p className="font-medium md:text-base text-sm">{chapter.chapterTitle || "Untitled chapter"}</p>
                      </div>

                      <p className="text-sm md:text-default">
                        {safeLength(chapter.chapterContent)} lectures - {calculateChapterTime ? calculateChapterTime(chapter) : "-"}
                      </p>
                    </div>

                    <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-100" : "max-h-0"}`}>
                      <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                        {Array.isArray(chapter.chapterContent) && chapter.chapterContent.length > 0 ? (
                          chapter.chapterContent.map((lecture, i) => (
                            <li key={lecture.lectureId || i} className="flex items-start gap-2 py-1">
                              <img src={assets.play_icon} alt="play_icon" className="w-4 h-4 mt-1" />
                              <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                                <p>{lecture.lectureTitle || "Untitled lecture"}</p>
                                <div className="flex gap-2">
                                  {lecture.isPreviewFree && (
                                    <p
                                      onClick={() => handlePreviewClick(lecture)}
                                      className="text-blue-500 cursor-pointer"
                                    >
                                      Preview
                                    </p>
                                  )}
                                  <p>
                                    {humanizeDuration( (lecture.lectureDuration || 0) * 60 * 1000, { units: ["h", "m"] })}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="py-2 text-gray-500">No lectures available</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No course structure available.</p>
              )}
            </div>
          </div>

          <div className="py-20 text-sm md:text-default">
            <h3 className="text-xl font-semibold text-gray-800">Course Description</h3>
            <p className="pt-3 rich-text" dangerouslySetInnerHTML={{ __html: courseData.courseDescription || "" }}></p>
          </div>
        </div>

        {/* right column */}
        <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
          {playerData?.videoId ? (
            <YouTube
              videoId={playerData.videoId}
              opts={{ playerVars: { autoplay: 0 } }}
              iframeClassName="w-full aspect-video"
            />
          ) : (
            <img src={courseData.courseThumbnail || assets.placeholder_image} alt={courseData.courseTitle || "Course thumbnail"} />
          )}

          <div className="p-5">
            <div className="flex items-center gap-2">
              <img className="w-3.5" src={assets.time_left_clock_icon} alt="time_left_clock_icon" />
              <p className="text-red-500">
                <span className="font-medium">5 days</span>
                {' '}left at this price!
              </p>
            </div>

            <div className="flex gap-3 items-center pt-2">
              <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
                {currency}{((courseData.coursePrice || 0) - ((courseData.discount || 0) * (courseData.coursePrice || 0)) / 100).toFixed(2)}
              </p>
              <p className="md:text-lg text-gray-500 line-through">{currency}{(courseData.coursePrice || 0).toFixed(2)}</p>
              <p className="md:text-lg text-gray-500">{courseData.discount || 0}% off</p>
            </div>

            <div className="flex items-center text-sm md:text-default gap-4 pt-2 text-gray-500">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="star icon" />
                <p>{calculateRating ? calculateRating(courseData) : 0}</p>
              </div>

              <div className="h-4 w-px bg-gray-500/40"></div>

              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="clock icon" />
                <p>{calculateCourseDuration ? calculateCourseDuration(courseData) : "-"}</p>
              </div>

              <div className="h-4 w-px bg-gray-500/40"></div>

              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="lesson icon" />
                <p>{calculateNoOfLectures ? calculateNoOfLectures(courseData) : 0} lessons</p>
              </div>
            </div>

            {/* Enroll, Audit & Unenroll Buttons */}
            <div className="pt-4 flex flex-col gap-3">
              {userData && !isAuditing && (
                <button
                  onClick={handleAudit}
                  className="w-full px-8 py-2 rounded-md bg-green-600 text-white font-semibold text-sm md:text-base shadow-md hover:bg-green-700 hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  Audit Course (Free)
                </button>
              )}

              {userData && isAuditing && (
                <div className="w-full px-8 py-2 rounded-md bg-green-100 text-green-700 font-semibold text-sm md:text-base border-2 border-green-600 text-center">
                  ✓ Currently Auditing
                </div>
              )}

              {!isAlreadyEnrolled ? (
                <button
                  onClick={enrollCourse}
                  className="w-full px-8 py-2 rounded-md bg-blue-600 text-white font-semibold text-sm md:text-base shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Enroll Now
                </button>
              ) : (
                <>
                  <div className="w-full px-8 py-2 rounded-md bg-blue-100 text-blue-700 font-semibold text-sm md:text-base border-2 border-blue-600 text-center">
                    ✓ Enrolled
                  </div>
                  <button
                    onClick={handleUnenroll}
                    className="w-full px-8 py-2 rounded-md bg-red-600 text-white font-semibold text-sm md:text-base shadow-md hover:bg-red-700 hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Unenroll
                  </button>
                </>
              )}
            </div>

            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-gray-800">What’s in the course?</p>
              <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-500">
                <li>Lifetime access with free updates available</li>
                <li>Quizzes to test your Learning.</li>
                <li>Downloadable resources </li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Certificate of completion.</li>
                <li>And many more....</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

// import React, { useContext, useState, useEffect } from "react";
// import { AppContext } from "../../context/AppContext";
// import Loading from "../../components/student/Loading";
// import { assets } from "../../assets/assets";
// import humanizeDuration from "humanize-duration";
// import Footer from "../../components/student/Footer";
// import YouTube from "react-youtube";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useParams, useNavigate } from "react-router-dom";

// // Defensive, null-safe version of CourseDetails
// export default function CourseDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [courseData, setCourseData] = useState(null);
//   const [openSections, setOpenSections] = useState({});
//   const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
//   const [playerData, setPlayerData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const {
//     calculateRating,
//     calculateChapterTime,
//     calculateCourseDuration,
//     calculateNoOfLectures,
//     currency,
//     backendUrl,
//     userData,
//     getToken,
//   } = useContext(AppContext);

//   // sanitize incoming course object so downstream code can safely access fields
//   const sanitizeCourseData = (raw = {}) => {
//     const course = { ...raw };

//     course.courseContent = Array.isArray(course.courseContent)
//       ? course.courseContent.map((chapter) => ({
//           ...chapter,
//           chapterContent: Array.isArray(chapter.chapterContent)
//             ? chapter.chapterContent.map((lecture) => ({ ...lecture }))
//             : [],
//         }))
//       : [];

//     course.courseRatings = Array.isArray(course.courseRatings) ? course.courseRatings : [];
//     course.enrolledStudents = Array.isArray(course.enrolledStudents)
//       ? course.enrolledStudents
//       : [];

//     // educator might be populated object or just an id string
//     // normalize to object with a 'name' property for display
//     if (typeof course.educator === "string" || !course.educator) {
//       course.educator = { name: course.educator || "Unknown" };
//     }

//     return course;
//   };

//   const fetchCourseData = async () => {
//     if (!id) return setLoading(false);
//     setLoading(true);
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/course/${id}`);

//       if (data?.success && data.courseData) {
//         setCourseData(sanitizeCourseData(data.courseData));
//       } else {
//         toast.error(data?.message || "Failed to load course");
//         setCourseData(null);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message || "Network error");
//       setCourseData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCourseData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id, backendUrl]);

//   // set enrollment flag when userData and courseData available
//   useEffect(() => {
//     if (!userData || !courseData) return;
//     const enrolledArr = Array.isArray(userData.enrolledCourses) ? userData.enrolledCourses : [];
//     setIsAlreadyEnrolled(Boolean(courseData._id && enrolledArr.includes(courseData._id)));
//   }, [userData, courseData]);

//   const toggleSection = (index) => {
//     setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
//   };

//   const safeGetToken = async () => {
//     try {
//       const token = await getToken();
//       return token;
//     } catch (err) {
//       console.warn("getToken failed:", err);
//       return null;
//     }
//   };
// const handleAudit = async () => {
//   if (!userData || !courseData) return toast.warn("Login to audit");
//   try {
//     const token = await getToken();
//     const { data } = await axios.post(
//       `${backendUrl}/api/user/audit-course`,
//       { courseId: courseData._id },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     if (data.success) {
//       toast.success("Course audited successfully");
//       setIsAlreadyEnrolled(true); // allow immediate access
//     } else {
//       toast.error(data.message);
//     }
//   } catch (err) {
//     toast.error(err.message);
//   }
// };

//   const enrollCourse = async () => {
//     if (!courseData) return toast.error("Course not loaded yet");
//     if (!userData) return toast.warn("Login to Enroll");
//     if (isAlreadyEnrolled) return toast.warn("Already Enrolled");

//     try {
//       const token = await safeGetToken();
//       if (!token) return toast.error("Session expired. Please sign in again.");

//       const { data } = await axios.post(
//         `${backendUrl}/api/user/purchase`,
//         { courseId: courseData._id },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (data?.success) {
//         const sessionUrl = data.session_url || data.session?.url || data.sessionUrl;
//         if (sessionUrl) {
//           window.location.replace(sessionUrl);
//         } else {
//           toast.success(data.message || "Redirecting to payment...");
//         }
//       } else {
//         toast.error(data?.message || "Purchase failed");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Payment request failed");
//     }
//   };

//   const handlePreviewClick = (lecture) => {
//     const url = lecture?.lectureUrl || "";
//     if (!url) return toast.error("Preview not available for this lecture");

//     // try to extract YouTube id safely
//     let videoId = "";
//     try {
//       if (url.includes("youtu.be")) {
//         videoId = url.split("/").pop();
//       } else if (url.includes("v=")) {
//         videoId = url.split("v=")[1].split("&")[0];
//       } else {
//         videoId = url.split("/").pop();
//       }
//     } catch (e) {
//       videoId = "";
//     }

//     if (videoId) setPlayerData({ videoId });
//     else toast.error("Could not load preview video");
//   };

//   // render helpers
//   const safeLength = (arr) => (Array.isArray(arr) ? arr.length : 0);
//   const safeCourseTitle = courseData?.courseTitle || "Untitled course";

//   if (loading) return <Loading />;

//   if (!courseData) {
//     return (
//       <div className="py-20 text-center">
//         <p className="text-lg">Course not found or failed to load.</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
//         <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70"></div>

//         {/* left column */}
//         <div className="max-w-xl z-10 text-gray-500">
//           <h1 className="md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800">
//             {safeCourseTitle}
//           </h1>

//           <p
//             className="pt-4 md:text-base text-sm"
//             dangerouslySetInnerHTML={{
//               __html: (courseData.courseDescription || "").slice(0, 200),
//             }}
//           ></p>

//           {/* review and ratings */}
//           <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
//             <p>{calculateRating ? calculateRating(courseData) : 0}</p>
//             <div className="flex">
//               {[...Array(5)].map((_, i) => (
//                 <img
//                   key={i}
//                   src={
//                     i < Math.floor(calculateRating ? calculateRating(courseData) : 0)
//                       ? assets.star
//                       : assets.star_blank
//                   }
//                   alt="star"
//                   className="w-3.5 h-3.5"
//                 />
//               ))}
//             </div>
//             <p className="text-blue-600">
//               ({safeLength(courseData.courseRatings)} {safeLength(courseData.courseRatings) > 1 ? "ratings" : "rating"})
//             </p>
//             <p>
//               {safeLength(courseData.enrolledStudents)} {safeLength(courseData.enrolledStudents) > 1 ? "students" : "student"}
//             </p>
//           </div>

//           <p className="text-sm">
//             Course by {" "}
//             <span className="text-blue-600 underline">{courseData.educator?.name || courseData.educator?.firstName || "Unknown"}</span>
//           </p>

//           <div className="pt-8 text-gray-800">
//             <h2 className="text-xl font-semibold">Course Structure</h2>

//             <div className="pt-5">
//               {Array.isArray(courseData.courseContent) && courseData.courseContent.length > 0 ? (
//                 courseData.courseContent.map((chapter, index) => (
//                   <div key={chapter.chapterId || index} className="border border-gray-300 bg-white mb-2 rounded">
//                     <div
//                       className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
//                       onClick={() => toggleSection(index)}
//                     >
//                       <div className="flex items-center gap-2">
//                         <img
//                           className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""}`}
//                           src={assets.down_arrow_icon}
//                           alt="down_arrow_icon"
//                         />
//                         <p className="font-medium md:text-base text-sm">{chapter.chapterTitle || "Untitled chapter"}</p>
//                       </div>

//                       <p className="text-sm md:text-default">
//                         {safeLength(chapter.chapterContent)} lectures - {calculateChapterTime ? calculateChapterTime(chapter) : "-"}
//                       </p>
//                     </div>

//                     <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-100" : "max-h-0"}`}>
//                       <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
//                         {Array.isArray(chapter.chapterContent) && chapter.chapterContent.length > 0 ? (
//                           chapter.chapterContent.map((lecture, i) => (
//                             <li key={lecture.lectureId || i} className="flex items-start gap-2 py-1">
//                               <img src={assets.play_icon} alt="play_icon" className="w-4 h-4 mt-1" />
//                               <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
//                                 <p>{lecture.lectureTitle || "Untitled lecture"}</p>
//                                 <div className="flex gap-2">
//                                   {lecture.isPreviewFree && (
//                                     <p
//                                       onClick={() => handlePreviewClick(lecture)}
//                                       className="text-blue-500 cursor-pointer"
//                                     >
//                                       Preview
//                                     </p>
//                                   )}
//                                   <p>
//                                     {humanizeDuration( (lecture.lectureDuration || 0) * 60 * 1000, { units: ["h", "m"] })}
//                                   </p>
//                                 </div>
//                               </div>
//                             </li>
//                           ))
//                         ) : (
//                           <li className="py-2 text-gray-500">No lectures available</li>
//                         )}
//                       </ul>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-600">No course structure available.</p>
//               )}
//             </div>
//           </div>

//           <div className="py-20 text-sm md:text-default">
//             <h3 className="text-xl font-semibold text-gray-800">Course Description</h3>
//             <p className="pt-3 rich-text" dangerouslySetInnerHTML={{ __html: courseData.courseDescription || "" }}></p>
//           </div>
//         </div>

//         {/* right column */}
//         <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
//           {playerData?.videoId ? (
//             <YouTube
//               videoId={playerData.videoId}
//               opts={{ playerVars: { autoplay: 0 } }}
//               iframeClassName="w-full aspect-video"
//             />
//           ) : (
//             <img src={courseData.courseThumbnail || assets.placeholder_image} alt={courseData.courseTitle || "Course thumbnail"} />
//           )}

//           <div className="p-5">
//             <div className="flex items-center gap-2">
//               <img className="w-3.5" src={assets.time_left_clock_icon} alt="time_left_clock_icon" />

//               <p className="text-red-500">
//                 <span className="font-medium">5 days</span>
//                 {' '}left at this price!
//               </p>
//             </div>

//             <div className="flex gap-3 items-center pt-2">
//               <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
//                 {currency}{((courseData.coursePrice || 0) - ((courseData.discount || 0) * (courseData.coursePrice || 0)) / 100).toFixed(2)}
//               </p>
//               <p className="md:text-lg text-gray-500 line-through">{currency}{(courseData.coursePrice || 0).toFixed(2)}</p>
//               <p className="md:text-lg text-gray-500">{courseData.discount || 0}% off</p>
//             </div>

//             <div className="flex items-center text-sm md:text-default gap-4 pt-2 text-gray-500">
//               <div className="flex items-center gap-1">
//                 <img src={assets.star} alt="star icon" />
//                 <p>{calculateRating ? calculateRating(courseData) : 0}</p>
//               </div>

//               <div className="h-4 w-px bg-gray-500/40"></div>

//               <div className="flex items-center gap-1">
//                 <img src={assets.time_clock_icon} alt="clock icon" />
//                 <p>{calculateCourseDuration ? calculateCourseDuration(courseData) : "-"}</p>
//               </div>

//               <div className="h-4 w-px bg-gray-500/40"></div>

//               <div className="flex items-center gap-1">
//                 <img src={assets.lesson_icon} alt="lesson icon" />
//                 <p>{calculateNoOfLectures ? calculateNoOfLectures(courseData) : 0} lessons</p>
//               </div>
//             </div>

//             <button
//               onClick={enrollCourse}
//               className="md:mt-6 mt-4 px-8 py-2 rounded-md bg-blue-600 text-white font-semibold text-sm md:text-base shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 mx-auto block"
//             >
//               {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
//             </button>

//             <div className="pt-6">
//               <p className="md:text-xl text-lg font-medium text-gray-800">What’s in the course?</p>
//               <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-500">
//                 <li>Lifetime access with free updates available</li>
//                 <li>Quizzes to test your Learning.</li>
//                 <li>Downloadable resources </li>
//                 <li>Step-by-step, hands-on project guidance.</li>
//                 <li>Certificate of completion.</li>
//                 <li>And many more....</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// }
