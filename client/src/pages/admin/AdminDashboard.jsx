import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUserGraduate,
  FaMoneyBillWave,
  FaBookOpen,
  FaUserShield,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";

const AdminDashboard = () => {
  const { currency, backendUrl, getToken } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🧭 Fetch Admin Dashboard Data
  const fetchAdminDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🧹 Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = await getToken();
      setLoading(true);
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/delete-user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("User deleted successfully");
        fetchAdminDashboardData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧹 Delete Course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const token = await getToken();
      setLoading(true);
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/delete-course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Course deleted successfully");
        fetchAdminDashboardData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧑‍🏫 Approve Educator
  const handleApproveEducator = async (userId) => {
    try {
      const token = await getToken();
      setLoading(true);
      const { data } = await axios.patch(
        `${backendUrl}/api/admin/approve-educator/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Educator approved successfully");
        fetchAdminDashboardData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDashboardData();
  }, []);

  if (!dashboardData) return <Loading />;

  return (
    <div className="min-h-screen p-6 md:p-8 flex flex-col gap-8 bg-gray-50">
      {/* ✅ Summary Cards */}
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-4 p-4 w-56 bg-white shadow-md border border-gray-200 rounded-lg transition-transform hover:scale-105">
          <FaUserShield className="w-10 h-10 text-blue-500" />
          <div>
            <p className="text-2xl font-semibold text-gray-700">
              {dashboardData.totalUsers}
            </p>
            <p className="text-sm text-gray-500">Total Users</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 w-56 bg-white shadow-md border border-gray-200 rounded-lg transition-transform hover:scale-105">
          <FaBookOpen className="w-10 h-10 text-purple-500" />
          <div>
            <p className="text-2xl font-semibold text-gray-700">
              {dashboardData.totalCourses}
            </p>
            <p className="text-sm text-gray-500">Total Courses</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 w-56 bg-white shadow-md border border-gray-200 rounded-lg transition-transform hover:scale-105">
          <FaMoneyBillWave className="w-10 h-10 text-green-500" />
          <div>
            <p className="text-2xl font-semibold text-gray-700">
              {currency}
              {dashboardData.totalEarnings}
            </p>
            <p className="text-sm text-gray-500">Total Earnings</p>
          </div>
        </div>
      </div>

      {/* 👨‍🏫 Educator Requests */}
      <div className="w-full max-w-5xl">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Pending Educator Approvals
        </h2>
        <div className="overflow-hidden rounded-lg shadow-sm bg-white border border-gray-200">
          <table className="w-full table-auto text-gray-600">
            <thead className="bg-gray-100 text-gray-700 text-sm font-medium">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.pendingEducators.map((user, i) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-center">{i + 1}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleApproveEducator(user._id)}
                      className="text-green-600 hover:text-green-800 mr-3"
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📚 All Courses with Delete */}
      <div className="w-full max-w-5xl">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          All Courses
        </h2>
        <div className="overflow-hidden rounded-lg shadow-sm bg-white border border-gray-200">
          <table className="w-full table-auto text-gray-600">
            <thead className="bg-gray-100 text-gray-700 text-sm font-medium">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3 text-left">Course Title</th>
                <th className="px-4 py-3 text-left">Educator</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.courses.map((course, i) => (
                <tr
                  key={course._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-center">{i + 1}</td>
                  <td className="px-4 py-3">{course.courseTitle}</td>
                  <td className="px-4 py-3">{course.educatorName}</td>
                  <td className="px-4 py-3">
                    {currency}
                    {course.coursePrice}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {loading && (
        <div className="text-center text-gray-600 text-sm">Processing...</div>
      )}
    </div>
  );
};

export default AdminDashboard;
