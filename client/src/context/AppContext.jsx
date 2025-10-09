import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import { dummyCourses } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  // ✅ Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Update DOM & localStorage when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ✅ Theme Palette Helper
  const theme = {
    light: {
      bg: "bg-white",
      text: "text-gray-800",
      cardBg: "bg-gray-50",
      border: "border-gray-300",
      buttonBg: "bg-gray-200",
      buttonText: "text-gray-800",
      hoverBg: "hover:bg-gray-100",
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-200",
      cardBg: "bg-gray-800",
      border: "border-gray-700",
      buttonBg: "bg-gray-700",
      buttonText: "text-gray-200",
      hoverBg: "hover:bg-gray-700",
    },
  };

  // ✅ Current theme based on darkMode
  const currentTheme = darkMode ? theme.dark : theme.light;

  // ---------------- Existing Functions ----------------
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/all");
      console.log("API response:", data); // ✅ check what you get

      if (data.success) 
        {setAllCourses(data.courses);
          console.log("Fetched courses:", data.courses); // ✅ check courses array

        }
            
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserData = async () => {
    if (user?.publicMetadata.role === "educator") setIsEducator(true);

    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setUserData(data.user);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) return 0;
    let totalRating = 0;
    course.courseRatings.forEach((rating) => (totalRating += rating.rating));
    return Math.floor(totalRating / course.courseRatings.length);
  };

  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/user/enrolled-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        const courses = data.enrolledCourses || [];
        setEnrolledCourses(courses.reverse());
      } else {
        toast.error(data.message);
        setEnrolledCourses([]);
      }
    } catch (error) {
      console.error("Fetch enrolled courses error:", error);
      toast.error(error.message);
      setEnrolledCourses([]);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [user]);

  const logToken = async () => {
    const token = await getToken();
    console.log(token);
  };

  useEffect(() => {
    if (user) logToken();
  }, [user]);

  // ---------------- Provide all context values ----------------
  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
    // ✅ Dark Mode
    darkMode,
    setDarkMode,
    // ✅ Theme Palette
    currentTheme,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
