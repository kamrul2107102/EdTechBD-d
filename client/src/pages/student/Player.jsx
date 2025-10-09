import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";

const Player = () => {
  const {
    enrolledCourses,
    calculateChapterTime,
    backendUrl,
    getToken,
    userData,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);

  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState({ lectureCompleted: [] });
  const [initialRating, setInitialRating] = useState(0);

  // Doubt section states
  const [doubts, setDoubts] = useState([]);
  const [showDoubtForm, setShowDoubtForm] = useState(false);
  const [doubtQuestion, setDoubtQuestion] = useState("");
  const [doubtAttachments, setDoubtAttachments] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Comment section states
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentReplyText, setCommentReplyText] = useState({});

  // ✅ Main function to get course data
  const getCourseData = (courses) => {
    const course = courses.find((c) => c._id === courseId);
    if (course) {
      setCourseData(course);
      course.courseRatings.forEach((item) => {
        if (item.userId === userData?._id) {
          setInitialRating(item.rating);
        }
      });
    }
  };

  // ✅ Fallback: fetch enrolled courses from backend if context is empty
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

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
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
    fetchDoubts();
    fetchComments();
  }, [courseId, getToken]);

  // Fetch doubts for course
  const fetchDoubts = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/doubt/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setDoubts(data.doubts);
      }
    } catch (error) {
      console.error("Fetch doubts error:", error);
    }
  };

  // Handle file selection and upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload an image file");
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("File size should be less than 5MB");
    }

    setUploadingImage(true);
    setSelectedFile(file);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const token = await getToken();
        const { data } = await axios.post(
          `${backendUrl}/api/doubt/upload-attachment`,
          { image: reader.result },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          setDoubtAttachments([...doubtAttachments, data.url]);
          toast.success("Image uploaded successfully");
        } else {
          toast.error(data.message);
        }
        setUploadingImage(false);
      };
    } catch (error) {
      toast.error(error.message);
      setUploadingImage(false);
    }
  };

  // Remove uploaded attachment
  const removeAttachment = (index) => {
    setDoubtAttachments(doubtAttachments.filter((_, i) => i !== index));
  };

  // Submit new doubt
  const handleSubmitDoubt = async (e) => {
    e.preventDefault();
    if (!doubtQuestion.trim()) return toast.error("Please enter your question");

    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/doubt/create`,
        { courseId, question: doubtQuestion, attachments: doubtAttachments },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Doubt submitted successfully");
        setDoubtQuestion("");
        setDoubtAttachments([]);
        setSelectedFile(null);
        setShowDoubtForm(false);
        fetchDoubts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Reply to doubt
  const handleReplyToDoubt = async (doubtId) => {
    const message = replyText[doubtId];
    if (!message?.trim()) return toast.error("Please enter a reply");

    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/doubt/reply`,
        { doubtId, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Reply added");
        setReplyText({ ...replyText, [doubtId]: "" });
        fetchDoubts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Mark doubt as resolved
  const handleMarkResolved = async (doubtId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/doubt/resolve`,
        { doubtId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Doubt marked as resolved");
        fetchDoubts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch comments for course
  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/comment/course/${courseId}`);
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Fetch comments error:", error);
    }
  };

  // Add new comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return toast.error("Please enter a comment");

    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/comment/add`,
        { courseId, comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Comment added");
        setCommentText("");
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Reply to comment
  const handleReplyToComment = async (commentId) => {
    const reply = commentReplyText[commentId];
    if (!reply?.trim()) return toast.error("Please enter a reply");

    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/comment/reply`,
        { commentId, reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Reply added");
        setCommentReplyText({ ...commentReplyText, [commentId]: "" });
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const token = await getToken();
      const { data } = await axios.delete(`${backendUrl}/api/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Comment deleted");
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return courseData ? (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* left column */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>

          <div className="pt-5">
            {courseData.courseContent.map((chapter, index) => (
              <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
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
                    <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                  </div>
                  <p className="text-sm md:text-default">
                    {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                  </p>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-96" : "max-h-0"}`}>
                  <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className="flex items-start gap-2 py-1">
                        <img
                          src={
                            progressData?.lectureCompleted?.includes(lecture.lectureId)
                              ? assets.blue_tick_icon
                              : assets.play_icon
                          }
                          alt="icon"
                          className="w-4 h-4 mt-1"
                        />
                        <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                          <p>{lecture.lectureTitle}</p>
                          <div className="flex gap-2">
                            {lecture.lectureUrl && (
                              <p
                                onClick={() =>
                                  setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })
                                }
                                className="text-blue-500 cursor-pointer"
                              >
                                Watch
                              </p>
                            )}
                            <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this Course:</h1>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>

          {/* Comments Section */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Comments</h2>

            {/* Add Comment */}
            <div className="mb-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts about this course..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[80px]"
              />
              <button
                onClick={handleAddComment}
                className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Post Comment
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <img
                        src={comment.userId?.imageUrl || assets.placeholder_image}
                        alt={comment.userId?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {comment.userId?.name || "User"}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {comment.userId?._id === userData?._id && (
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-red-500 text-sm hover:text-red-700"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <p className="mt-2 text-gray-700">{comment.comment}</p>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-3 ml-8 space-y-2">
                            {comment.replies.map((reply, idx) => (
                              <div key={idx} className="bg-white p-2 rounded">
                                <div className="flex gap-2">
                                  <img
                                    src={reply.userId?.imageUrl || assets.placeholder_image}
                                    alt={reply.userId?.name}
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                  <div className="flex-1">
                                    <p className="font-semibold text-sm text-gray-800">
                                      {reply.userId?.name || "User"}
                                    </p>
                                    <p className="text-gray-700 text-sm">{reply.reply}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {new Date(reply.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply Form */}
                        <div className="mt-3 flex gap-2">
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            value={commentReplyText[comment._id] || ""}
                            onChange={(e) =>
                              setCommentReplyText({
                                ...commentReplyText,
                                [comment._id]: e.target.value,
                              })
                            }
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                          />
                          <button
                            onClick={() => handleReplyToComment(comment._id)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition text-sm"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* right column */}
        <div className="md:mt-10">
          {playerData ? (
            <div>
              <YouTube
                videoId={playerData.lectureUrl.split("/").pop()}
                iframeClassName="w-full aspect-video"
              />
              <div className="flex justify-between items-center mt-1">
                <p>
                  {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                </p>
                <button
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                  className="text-blue-600"
                >
                  {progressData?.lectureCompleted?.includes(playerData.lectureId)
                    ? "Completed"
                    : "Mark Complete"}
                </button>
              </div>
            </div>
          ) : (
            <img
              src={courseData.courseThumbnail}
              alt={courseData.courseTitle}
            />
          )}
        </div>
      </div>

      {/* Doubts Section */}
      <div className="md:px-36 px-8 py-10 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Course Doubts & Discussion</h2>
          <button
            onClick={() => setShowDoubtForm(!showDoubtForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {showDoubtForm ? "Cancel" : "Ask a Question"}
          </button>
        </div>

        {/* New Doubt Form */}
        {showDoubtForm && (
          <form onSubmit={handleSubmitDoubt} className="bg-white p-6 rounded-lg shadow-md mb-6">
            <textarea
              value={doubtQuestion}
              onChange={(e) => setDoubtQuestion(e.target.value)}
              placeholder="Describe your doubt or question..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
              required
            />

            {/* File Upload Section */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach Images (Optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? "Uploading..." : "Choose Image"}
                </label>
                <span className="text-sm text-gray-500">
                  Max 5MB, Images only
                </span>
              </div>

              {/* Preview uploaded images */}
              {doubtAttachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {doubtAttachments.map((url, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={url}
                        alt={`Attachment ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={uploadingImage}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploadingImage ? "Uploading..." : "Submit Question"}
            </button>
          </form>
        )}

        {/* Doubts List */}
        <div className="space-y-4">
          {doubts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No questions yet. Be the first to ask!</p>
          ) : (
            doubts.map((doubt) => (
              <div key={doubt._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start gap-3">
                  <img
                    src={doubt.userId?.imageUrl || assets.placeholder_image}
                    alt={doubt.userId?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{doubt.userId?.name || "Student"}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(doubt.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {doubt.isResolved && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-gray-700">{doubt.question}</p>

                    {/* Attachments */}
                    {doubt.attachments && doubt.attachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {doubt.attachments.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={url}
                              alt={`Attachment ${idx + 1}`}
                              className="w-32 h-32 object-cover rounded-md border border-gray-300 hover:opacity-90 transition cursor-pointer"
                            />
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Replies */}
                    {doubt.replies && doubt.replies.length > 0 && (
                      <div className="mt-4 ml-8 space-y-3">
                        {doubt.replies.map((reply, idx) => (
                          <div key={idx} className="flex gap-2 bg-gray-50 p-3 rounded">
                            <img
                              src={reply.userId?.imageUrl || assets.placeholder_image}
                              alt={reply.userId?.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-gray-800">
                                {reply.userId?.name || "User"}
                              </p>
                              <p className="text-gray-700 text-sm">{reply.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Form */}
                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText[doubt._id] || ""}
                        onChange={(e) =>
                          setReplyText({ ...replyText, [doubt._id]: e.target.value })
                        }
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleReplyToDoubt(doubt._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Mark as Resolved */}
                    {!doubt.isResolved && doubt.userId?._id === userData?._id && (
                      <button
                        onClick={() => handleMarkResolved(doubt._id)}
                        className="mt-3 text-sm text-green-600 hover:text-green-700 font-semibold"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Player;

// import React, { useContext, useEffect, useState } from "react";
// import { AppContext } from "../../context/AppContext";
// import { useParams } from "react-router-dom";
// import { assets } from "../../assets/assets";
// import humanizeDuration from "humanize-duration";
// import YouTube from "react-youtube";
// import Footer from "../../components/student/Footer";
// import Rating from "../../components/student/Rating";
// import Loading from "../../components/student/Loading";
// import { toast } from "react-toastify";

// const Player = () => {
//   const {
//     enrolledCourses = [],       // fallback empty array
//     calculateChapterTime = () => "0 min", // fallback function
//     userData = { _id: "mockUserId" },    // mock userData
//   } = useContext(AppContext);

//   const { courseId } = useParams();
//   const [courseData, setCourseData] = useState(null);
//   const [openSections, setOpenSections] = useState({});
//   const [playerData, setPlayerData] = useState(null);
//   const [progressData, setProgressData] = useState({
//     lectureCompleted: [],
//   });
//   const [initialRating, setInitialRating] = useState(0);

//   // MOCK: fake enrolledCourses if empty
//   useEffect(() => {
//     if (enrolledCourses.length === 0) {
//       const mockCourse = {
//         _id: "1",
//         courseTitle: "Demo Course",
//         courseThumbnail: assets.demo_thumbnail || "",
//         courseRatings: [{ userId: "mockUserId", rating: 4 }],
//         courseContent: [
//           {
//             chapterTitle: "Chapter 1",
//             chapterContent: [
//               {
//                 lectureId: "l1",
//                 lectureTitle: "Introduction",
//                 lectureUrl: "dQw4w9WgXcQ", // YouTube video id
//                 lectureDuration: 5, // minutes
//               },
//               {
//                 lectureId: "l2",
//                 lectureTitle: "Basics",
//                 lectureUrl: "dQw4w9WgXcQ",
//                 lectureDuration: 10,
//               },
//             ],
//           },
//         ],
//       };
//       setCourseData(mockCourse);
//       setInitialRating(
//         mockCourse.courseRatings.find(
//           (item) => item.userId === userData._id
//         )?.rating || 0
//       );
//     } else {
//       // load from context
//       const course = enrolledCourses.find((c) => c._id === courseId);
//       if (course) {
//         setCourseData(course);
//         setInitialRating(
//           course.courseRatings.find(
//             (item) => item.userId === userData?._id
//           )?.rating || 0
//         );
//       }
//     }
//   }, [enrolledCourses, courseId, userData]);

//   const toggleSection = (index) => {
//     setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
//   };

//   const markLectureAsCompleted = (lectureId) => {
//     // MOCK: just update local state
//     setProgressData((prev) => ({
//       lectureCompleted: [...prev.lectureCompleted, lectureId],
//     }));
//     toast.success("Lecture marked as complete!");
//   };

//   const handleRate = (rating) => {
//     setInitialRating(rating);
//     toast.success(`You rated this course ${rating} stars!`);
//   };

//   return courseData ? (
//     <>
//       <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
//         {/* left column */}
//         <div className="text-gray-800">
//           <h2 className="text-xl font-semibold">Course Structure</h2>

//           <div className="pt-5">
//             {courseData.courseContent.map((chapter, index) => (
//               <div
//                 key={index}
//                 className="border border-gray-300 bg-white mb-2 rounded"
//               >
//                 <div
//                   className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
//                   onClick={() => toggleSection(index)}
//                 >
//                   <div className="flex items-center gap-2">
//                     <img
//                       className={`transform transition-transform ${
//                         openSections[index] ? "rotate-180" : ""
//                       }`}
//                       src={assets.down_arrow_icon}
//                       alt="down_arrow_icon"
//                     />
//                     <p className="font-medium md:text-base text-sm">
//                       {chapter.chapterTitle}
//                     </p>
//                   </div>
//                   <p className="text-sm md:text-default">
//                     {chapter.chapterContent.length} lectures -{" "}
//                     {calculateChapterTime(chapter)}
//                   </p>
//                 </div>

//                 <div
//                   className={`overflow-hidden transition-all duration-300 ${
//                     openSections[index] ? "max-h-96" : "max-h-0"
//                   }`}
//                 >
//                   <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
//                     {chapter.chapterContent.map((lecture, i) => (
//                       <li key={i} className="flex items-start gap-2 py-1">
//                         <img
//                           src={
//                             progressData.lectureCompleted.includes(
//                               lecture.lectureId
//                             )
//                               ? assets.blue_tick_icon
//                               : assets.play_icon
//                           }
//                           alt="icon"
//                           className="w-4 h-4 mt-1"
//                         />
//                         <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
//                           <p>{lecture.lectureTitle}</p>
//                           <div className="flex gap-2">
//                             {lecture.lectureUrl && (
//                               <p
//                                 onClick={() =>
//                                   setPlayerData({
//                                     ...lecture,
//                                     chapter: index + 1,
//                                     lecture: i + 1,
//                                   })
//                                 }
//                                 className="text-blue-500 cursor-pointer"
//                               >
//                                 Watch
//                               </p>
//                             )}
//                             <p>
//                               {humanizeDuration(
//                                 lecture.lectureDuration * 60 * 1000,
//                                 { units: ["h", "m"] }
//                               )}
//                             </p>
//                           </div>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex items-center gap-2 py-3 mt-10">
//             <h1 className="text-xl font-bold">Rate this Course:</h1>
//             <Rating initialRating={initialRating} onRate={handleRate} />
//           </div>
//         </div>

//         {/* right column */}
//         <div className="md:mt-10">
//           {playerData ? (
//             <div>
//               <YouTube
//                 videoId={playerData.lectureUrl.split("/").pop()}
//                 iframeClassName="w-full aspect-video"
//               />
//               <div className="flex justify-between items-center mt-1">
//                 <p>
//                   {playerData.chapter}.{playerData.lecture}{" "}
//                   {playerData.lectureTitle}
//                 </p>
//                 <button
//                   onClick={() => markLectureAsCompleted(playerData.lectureId)}
//                   className="text-blue-600"
//                 >
//                   {progressData.lectureCompleted.includes(playerData.lectureId)
//                     ? "Completed"
//                     : "Mark Complete"}
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <img
//               src={courseData.courseThumbnail}
//               alt={courseData.courseTitle}
//             />
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   ) : (
//     <Loading />
//   );
// };

// export default Player;
