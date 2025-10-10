import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import CourseTable from "../../components/admin/CourseTable";
import { toast } from "react-toastify";

const ManageCourses = () => {
  const { backendUrl, getToken, currency } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/admin/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setCourses(data.courses);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      const token = await getToken();
      const { data } = await axios.delete(`${backendUrl}/api/admin/delete-course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Course deleted!");
        fetchCourses();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (!courses) return <Loading />;

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Courses</h2>
      <CourseTable
        courses={courses}
        handleDeleteCourse={handleDeleteCourse}
        currency={currency}
      />
    </div>
  );
};

export default ManageCourses;
