import React from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import Home from "./pages/student/Home";
import CoursesList from "./pages/student/CoursesList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import Player from "./pages/student/Player";
import TextPlayer from "./pages/student/TextPlayer";
import Loading from "./components/student/Loading";
import Educator from "./pages/educator/Educator";
import Dashboard from "./pages/educator/Dashboard";
import AddCourse from "./pages/educator/AddCourse";
import MyCourses from "./pages/educator/MyCourses";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled";
import Doubts from "./pages/educator/Doubts";
import Navbar from "./components/student/Navbar";
import "quill/dist/quill.snow.css";// for rich text editor
import { ToastContainer } from "react-toastify";

// Newly added pages
import Categories from "./pages/student/Categories";
import Deals from "./pages/student/Deals";
import Blog from "./pages/student/Blog";
import AuditPage from "./pages/student/AuditPage.jsx";
import AuditedCourses from "./pages/educator/AuditedCourses";
import Learn from "./pages/student/Learn";
import PythonCourse from "./pages/student/PythonCourse";
import JavaScriptCourse from "./pages/student/JavaScriptCourse.jsx";
import MachineLearningCourse from "./pages/student/MachineLearningCourse";
import PremiumMLCourse from "./pages/student/PremiumMLCourse";
import LessonPlayer from "./pages/student/LessonPlayer";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCourses from "./pages/admin/ManageCourses";
import ApproveEducators from "./pages/admin/ApproveEducators";

const App = () => {
  const isEducatorRoute = useMatch("/educator/*");

  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />
      {!isEducatorRoute && <Navbar />}

      <Routes>
        {/* Public/Student Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/text-player/:courseId" element={<TextPlayer />} />
        <Route path="/loading/:path" element={<Loading />} />

        {/* New Navbar Links */}
        <Route path="/categories" element={<Categories />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:courseId" element={<PythonCourse />} />
        <Route path="/learn-js/:courseId" element={<JavaScriptCourse />} />
        <Route path="/learn-ml/:courseId" element={<MachineLearningCourse />} />
        <Route path="/learn/premium-ml" element={<PremiumMLCourse />} />
        <Route path="/lesson/:lessonId" element={<LessonPlayer />} />

        {/* ✅ Audit Page Route */}
        <Route path="/audit" element={<AuditPage />} />

        {/* Educator Routes */}
        <Route path="/educator" element={<Educator />}>
          <Route index element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="doubts" element={<Doubts />} />
          <Route path="audited-courses" element={<AuditedCourses />} />
          <Route path="student-enrolled" element={<StudentsEnrolled />} />
        </Route>
        {/* If you want a shared sidebar layout later, wrap them in AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="manage-users" element={<ManageUsers />} />
  <Route path="manage-courses" element={<ManageCourses />} />
  <Route path="approve-educators" element={<ApproveEducators />} />
</Route>
      </Routes>
    </div>
  );
};

export default App;
