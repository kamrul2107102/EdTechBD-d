import React, { useContext, useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

// const AddCourse = () => {
//   const { backendUrl, getToken } = useContext(AppContext);

//   const quillRef = useRef(null);
//   const editorRef = useRef(null);

//   const [courseTitle, setCourseTitle] = useState("");
//   const [coursePrice, setCoursePrice] = useState(0);
//   const [discount, setDiscount] = useState(0);
//   const [courseType, setCourseType] = useState("video"); // video or text
//   const [image, setImage] = useState(null);
//   const [chapters, setChapters] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [currentChapterId, setCurrentChapterId] = useState(null);

//   const [lectureDetails, setLectureDetails] = useState({
//     lectureTitle: "",
//     lectureDuration: "",
//     lectureUrl: "",
//     lectureText: "",
//     isPreviewFree: false,
//   });

//   const handleChapter = (action, chapterId) => {
//     if (action === "add") {
//       const title = prompt("Enter Chapter Name:");
//       if (title) {
//         const newChapter = {
//           chapterId: uniqid(),
//           chapterTitle: title,
//           chapterContent: [],
//           collapsed: false,
//           chapterOrder:
//             chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
//         };
//         setChapters([...chapters, newChapter]);
//       }
//     } else if (action === "remove") {
//       setChapters(
//         chapters.filter((chapter) => chapter.chapterId !== chapterId)
//       );
//     } else if (action === "toggle") {
//       setChapters(
//         chapters.map((chapter) =>
//           chapter.chapterId === chapterId
//             ? { ...chapter, collapsed: !chapter.collapsed }
//             : chapter
//         )
//       );
//     }
//   };

//   const handleLecture = (action, chapterId, lectureIndex) => {
//     if (action === "add") {
//       setCurrentChapterId(chapterId);
//       setShowPopup(true);
//     } else if (action === "remove") {
//       setChapters(
//         chapters.map((chapter) => {
//           if (chapter.chapterId === chapterId) {
//             chapter.chapterContent.splice(lectureIndex, 1);
//           }
//           return chapter;
//         })
//       );
//     }
//   };

//   const addLecture = () => {
//     setChapters(
//       chapters.map((chapter) => {
//         if (chapter.chapterId === currentChapterId) {
//           const newLecture = {
//             ...lectureDetails,
//             lectureOrder:
//               chapter.chapterContent.length > 0
//                 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
//                 : 1,
//             lectureId: uniqid(),
//           };
//           chapter.chapterContent.push(newLecture);
//         }
//         return chapter;
//       })
//     );
//     setShowPopup(false);
//     setLectureDetails({
//       lectureTitle: "",
//       lectureDuration: "",
//       lectureUrl: "",
//       lectureText: "",
//       isPreviewFree: false,
//     });
//   };

//   const handleSubmit = async (e) => {
//     try {
//       e.preventDefault();
//       if (!image) {
//         toast.error("Thumbnail Not Selected");
//       }

//       const courseData = {
//         courseTitle,
//         courseDescription: quillRef.current.root.innerHTML,
//         coursePrice: Number(coursePrice),
//         discount: Number(discount),
//         courseType,
//         courseContent: chapters,
//       };

//       const formData = new FormData();
//       formData.append("courseData", JSON.stringify(courseData));
//       formData.append("image", image);

//       const token = await getToken();
//       const { data } = await axios.post(
//         backendUrl + "/api/educator/add-course",
//         formData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         setCourseTitle("");
//         setCoursePrice(0);
//         setDiscount(0);
//         setImage(null);
//         setChapters([]);
//         quillRef.current.root.innerHTML = "";
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };
// // for text editor
//   useEffect(() => {
//     if (!quillRef.current && editorRef.current) {
//       quillRef.current = new Quill(editorRef.current, {
//         theme: "snow",
//       });
//     }
//   }, []);//initiate quill only once

//   return (
//     <div className="h-screen overflow-scroll flex flex-col items-start justify-start 
//                 md:p-8 p-4 pt-8
//                 bg-gradient-to-b from-blue-50 to-blue-100">
//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-4 max-w-md w-full text-gray-500"
//       >
//         <div className="flex flex-col gap-1">
//           <p>Course Title</p>
//           <input
//             onChange={(e) => setCourseTitle(e.target.value)}
//             value={courseTitle}
//             type="text"
//             placeholder="Type here Title"
//             className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
//             required
//           />
//         </div>
//         <div className="flex flex-col gap-1">
//           <p>Course Description</p>
//           <div ref={editorRef}></div>
//         </div>

//         <div className="flex items-center justify-between flex-wrap">
          

//           <div className="flex md:flex-row flex-col items-center gap-3">
//             <p>Course Thumbnail</p>
//             <label
//               htmlFor="thumbnailImage"
//               className="flex items-center gap-3 cursor-pointer"
//             >
//               <img
//                 src={assets.file_upload_icon}
//                 alt="file_upload_icon"
//                 className="p-3 bg-blue-800 rounded-lg"
//               />
//               <input
//                 type="file"
//                 id="thumbnailImage"
//                 onChange={(e) => setImage(e.target.files[0])}
//                 accept="image/*"
//                 hidden
//               />
//               <img
//                 className="max-h-10"
//                 src={image ? URL.createObjectURL(image) : ""}
//                 alt=""
//               />
//             </label>
//           </div>
//           <div className="flex flex-col gap-1">
//             <p>Course Price</p>
//             <input
//               onChange={(e) => setCoursePrice(e.target.value)}
//               value={coursePrice}
//               type="number"
//               placeholder="0"
//               className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
//             />
//           </div>
//         </div>

//         <div className="flex flex-col gap-1">
//           <p>Discount %</p>
//           <input
//             onChange={(e) => setDiscount(e.target.value)}
//             value={discount}
//             type="number"
//             placeholder="0"
//             min={0}
//             max={100}
//             className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
//             required
//           />
//         </div>

//         <div className="flex flex-col gap-1">
//           <p>Course Type</p>
//           <select
//             value={courseType}
//             onChange={(e) => setCourseType(e.target.value)}
//             className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
//           >
//             <option value="video">Video Course</option>
//             <option value="text">Text Course</option>
//           </select>
//         </div>

//         {/* Adding Chapters & Lectures */}
//         <div>
//           {chapters.map((chapter, chapterIndex) => (
//             <div key={chapterIndex} className="bg-white border rounded-lg mb-4">
//               <div className="flex justify-between items-center p-4 border-b">
//                 <div className="flex items-center">
//                   <img
//                     onClick={() => handleChapter("toggle", chapter.chapterId)}
//                     src={assets.dropdown_icon}
//                     width={14}
//                     alt="dropdown_icon"
//                     className={`mr-2 cursor-pointer transition-all ${
//                       chapter.collapsed && "-rotate-90"
//                     }`}
//                   />
//                   <span className="font-semibold">
//                     {chapterIndex + 1} {chapter.chapterTitle}
//                   </span>
//                 </div>
//                 <span className="text-gray-500">
//                   {chapter.chapterContent.length} Lectures
//                 </span>
//                 <img
//                   onClick={() => handleChapter("remove", chapter.chapterId)}
//                   src={assets.cross_icon}
//                   alt="cross_icon"
//                   className="cursor-pointer"
//                 />
//               </div>
//               {!chapter.collapsed && (
//                 <div className="p-4">
//                   {chapter.chapterContent.map((lecture, lectureIndex) => (
//                     <div
//                       key={lectureIndex}
//                       className="flex justify-between items-center mb-2"
//                     >
//                       <span>
//                         {lectureIndex + 1} {lecture.lectureTitle} -{" "}
//                         {lecture.lectureDuration} mins -{" "}
//                         <a
//                           href={lecture.lectureUrl}
//                           target="_blank"
//                           className="text-blue-500"
//                         >
//                           Link
//                         </a>{" "}
//                         - {lecture.isPreviewFree ? "Free Preview" : "Paid"}
//                       </span>
//                       <img
//                         src={assets.cross_icon}
//                         alt="cross_icon"
//                         onClick={() =>
//                           handleLecture(
//                             "remove",
//                             chapter.chapterId,
//                             lectureIndex
//                           )
//                         }
//                         className="cursor-pointer"
//                       />
//                     </div>
//                   ))}
//                   <div
//                     className="inline-flex bg-gray-100 p-2 rounded-lg cursor-pointer mt-2"
//                     onClick={() => handleLecture("add", chapter.chapterId)}
//                   >
//                     + Add Lecture
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//           <div
//             className="flex justify-center items-center w-full text-white bg-black p-2 rounded-lg cursor-pointer"
//             onClick={() => handleChapter("add")}
//           >
//             + Add Chapter
//           </div>

//           {showPopup && (
//             <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//               <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80">
//                 <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>

//                 <div className="mb-2">
//                   <p>Lecture Title</p>
//                   <input
//                     type="text"
//                     className="mt-1 block w-full border rounded py-1 px-2"
//                     value={lectureDetails.lectureTitle}
//                     onChange={(e) =>
//                       setLectureDetails({
//                         ...lectureDetails,
//                         lectureTitle: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="mb-2">
//                   <p>Duration (minutes)</p>
//                   <input
//                     type="number"
//                     className="mt-1 block w-full border rounded py-1 px-2"
//                     value={lectureDetails.lectureDuration}
//                     onChange={(e) =>
//                       setLectureDetails({
//                         ...lectureDetails,
//                         lectureDuration: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 {courseType === "video" ? (
//                   <div className="mb-2">
//                     <p>Lecture URL (YouTube)</p>
//                     <input
//                       type="text"
//                       className="mt-1 block w-full border rounded py-1 px-2"
//                       value={lectureDetails.lectureUrl}
//                       onChange={(e) =>
//                         setLectureDetails({
//                           ...lectureDetails,
//                           lectureUrl: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 ) : (
//                   <div className="mb-2">
//                     <p>Lecture Text Content</p>
//                     <textarea
//                       className="mt-1 block w-full border rounded py-1 px-2 min-h-[100px]"
//                       value={lectureDetails.lectureText}
//                       onChange={(e) =>
//                         setLectureDetails({
//                           ...lectureDetails,
//                           lectureText: e.target.value,
//                         })
//                       }
//                       placeholder="Enter the lesson content..."
//                     />
//                   </div>
//                 )}

//                 <div className="flex gap-2 my-4">
//                   <p>Is Preview Free?</p>
//                   <input
//                     type="checkbox"
//                     className="mt-1 scale-125"
//                     checked={lectureDetails.isPreviewFree}
//                     onChange={(e) =>
//                       setLectureDetails({
//                         ...lectureDetails,
//                         isPreviewFree: e.target.checked,
//                       })
//                     }
//                   />
//                 </div>

//                 <button
//                   type="button"
//                   className="w-full bg-blue-400 text-white px-4 py-2 rounded"
//                   onClick={addLecture}
//                 >
//                   Add 
//                 </button>

//                 <img
//                   onClick={() => setShowPopup(false)}
//                   src={assets.cross_icon}
//                   className="absolute top-4 right-4 w-4 cursor-pointer"
//                   alt="cross_icon"
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//         <button
//   type="submit"
//   className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-base py-2 px-4 rounded-lg my-10 shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-300 w-fit"
// >
//   Add Course
// </button>



//       </form>
//     </div>
//   );
// };
const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [courseType, setCourseType] = useState("video"); // video or text
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    lectureText: "",
    isPreviewFree: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId)
      );
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: uniqid(),
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      lectureText: "",
      isPreviewFree: false,
    });
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!image) {
        toast.error("Thumbnail Not Selected");
        return;
      }

      setLoading(true);

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseType,
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      formData.append("image", image);

      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/educator/add-course",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setCourseTitle("");
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
// for text editor
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);//initiate quill only once

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Create New Course</h1>
        <p className="text-gray-600">Fill in the details to add a new course to your catalog</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Basic Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">1</span>
          Basic Information
        </h2>
        
        <div className="space-y-5">
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title <span className="text-red-500">*</span>
          </label>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder="e.g., Complete Web Development Bootcamp"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
          </div>

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Description <span className="text-red-500">*</span>
          </label>
          <div ref={editorRef} className="bg-white rounded-lg border border-blue-300"></div>
          </div>

          <div className="grid mt-4 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Type
            </label>
            <select
            value={courseType}
            onChange={(e) => setCourseType(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
            <option value="video">📹 Video Course</option>
            <option value="text">📝 Text Course</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Price ($)
            </label>
            <input
            onChange={(e) => setCoursePrice(e.target.value)}
            value={coursePrice}
            type="number"
            placeholder="0"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount (%)
            </label>
            <input
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            type="number"
            placeholder="0"
            min={0}
            max={100}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
            />
          </div>
          </div>

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Thumbnail
          </label>
          <label
            htmlFor="thumbnailImage"
            className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            {image ? (
            <div className="flex items-center gap-4">
              <img
              className="h-20 w-20 object-cover rounded-lg"
              src={URL.createObjectURL(image)}
              alt="Thumbnail preview"
              />
              <div className="text-left">
              <p className="text-sm font-medium text-gray-700">{image.name}</p>
              <p className="text-xs text-gray-500">Click to change</p>
              </div>
            </div>
            ) : (
            <div className="text-center">
              <img
              src={assets.file_upload_icon}
              alt="Upload"
              className="mx-auto h-12 w-12 mb-2"
              />
              <p className="text-sm text-gray-600">Click to upload thumbnail</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
            )}
            <input
            type="file"
            id="thumbnailImage"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            hidden
            />
          </label>
          </div>
        </div>
        </div>

        {/* Course Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">2</span>
          Course Content
        </h2>

        <div className="space-y-4">
          {chapters.map((chapter, chapterIndex) => (
          <div key={chapterIndex} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center flex-1">
              <img
              onClick={() => handleChapter("toggle", chapter.chapterId)}
              src={assets.dropdown_icon}
              width={14}
              alt="Toggle"
              className={`mr-3 cursor-pointer transition-transform duration-200 ${
                chapter.collapsed && "-rotate-90"
              }`}
              />
              <span className="font-semibold text-gray-800">
              Chapter {chapterIndex + 1}: {chapter.chapterTitle}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
              {chapter.chapterContent.length} {chapter.chapterContent.length === 1 ? 'Lecture' : 'Lectures'}
              </span>
              <img
              onClick={() => handleChapter("remove", chapter.chapterId)}
              src={assets.cross_icon}
              alt="Remove"
              className="cursor-pointer hover:scale-110 transition-transform w-5 h-5"
              />
            </div>
            </div>
            
            {!chapter.collapsed && (
            <div className="p-4 bg-white">
              {chapter.chapterContent.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No lectures added yet</p>
              ) : (
              <div className="space-y-2 mb-4">
                {chapter.chapterContent.map((lecture, lectureIndex) => (
                <div
                  key={lectureIndex}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                  <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded mt-0.5">
                    {lectureIndex + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{lecture.lectureTitle}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-600">
                    <span>⏱️ {lecture.lectureDuration} mins</span>
                    {lecture.lectureUrl && (
                      <a
                      href={lecture.lectureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      >
                      🔗 View Link
                      </a>
                    )}
                    {lecture.isPreviewFree && (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Free Preview
                      </span>
                    )}
                    </div>
                  </div>
                  </div>
                  <img
                  src={assets.cross_icon}
                  alt="Remove"
                  onClick={() =>
                    handleLecture("remove", chapter.chapterId, lectureIndex)
                  }
                  className="cursor-pointer hover:scale-110 transition-transform w-4 h-4 ml-2"
                  />
                </div>
                ))}
              </div>
              )}
              
              <button
              type="button"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-sm"
              onClick={() => handleLecture("add", chapter.chapterId)}
              >
              + Add Lecture
              </button>
            </div>
            )}
          </div>
          ))}

          <button
          type="button"
          className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 px-4 rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all font-semibold shadow-md"
          onClick={() => handleChapter("add")}
          >
          + Add New Chapter
          </button>
        </div>
        </div>

        {/* Popup Modal */}
        {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fadeIn">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
            <h2 className="text-xl font-bold">Add New Lecture</h2>
            <p className="text-blue-100 text-sm mt-1">Fill in the lecture details</p>
          </div>

          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lecture Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="e.g., Introduction to JavaScript"
              value={lectureDetails.lectureTitle}
              onChange={(e) =>
              setLectureDetails({
                ...lectureDetails,
                lectureTitle: e.target.value,
              })
              }
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="30"
              value={lectureDetails.lectureDuration}
              onChange={(e) =>
              setLectureDetails({
                ...lectureDetails,
                lectureDuration: e.target.value,
              })
              }
            />
            </div>

            {courseType === "video" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube URL
              </label>
              <input
              type="text"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="https://www.youtube.com/watch?v=..."
              value={lectureDetails.lectureUrl}
              onChange={(e) =>
                setLectureDetails({
                ...lectureDetails,
                lectureUrl: e.target.value,
                })
              }
              />
            </div>
            ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Lecture Text Content
              </label>
              <textarea
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[120px]"
              value={lectureDetails.lectureText}
              onChange={(e) =>
                setLectureDetails({
                ...lectureDetails,
                lectureText: e.target.value,
                })
              }
              placeholder="Enter the lesson content..."
              />
            </div>
            )}

            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
            <input
              type="checkbox"
              id="previewFree"
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              checked={lectureDetails.isPreviewFree}
              onChange={(e) =>
              setLectureDetails({
                ...lectureDetails,
                isPreviewFree: e.target.checked,
              })
              }
            />
            <label htmlFor="previewFree" className="text-sm font-medium text-gray-700 cursor-pointer">
              Allow free preview of this lecture
            </label>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
            <button
            type="button"
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            onClick={() => setShowPopup(false)}
            >
            Cancel
            </button>
            <button
            type="button"
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
            onClick={addLecture}
            >
            Add Lecture
            </button>
          </div>

          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-6 right-6 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all"
          >
            <img src={assets.cross_icon} className="w-5 h-5 invert" alt="Close" />
          </button>
          </div>
        </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-base py-3 px-8 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "🚀 Create Course"}
        </button>
        </div>
      </form>
      </div>
    </div>
    );
};

export default AddCourse;
