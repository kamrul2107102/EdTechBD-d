import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaUserGraduate, FaMoneyBillWave, FaBookOpen } from "react-icons/fa";

const Dashboard = () => {
  const { currency, backendUrl, getToken, isEducator } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setDashboardData(data.dashboardData);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) fetchDashboardData();
  }, [isEducator]);

  const generateEnrollmentData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month) => ({
      month,
      enrollments: Math.floor(Math.random() * 50) + 10,
    }));
  };

  const generateEarningsData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month) => ({
      month,
      earnings: Math.floor(Math.random() * 5000) + 1000,
    }));
  };

  const generateCourseDistribution = () => {
    return dashboardData.enrolledStudentsData
      .reduce((acc, item) => {
        const existing = acc.find((c) => c.name === item.courseTitle);
        if (existing) existing.value += 1;
        else acc.push({ name: item.courseTitle, value: 1 });
        return acc;
      }, [])
      .slice(0, 5);
  };

  const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];

  if (!dashboardData) return <Loading />;

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Educator Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Overview of your teaching performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="flex items-center gap-4 p-6 bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-2xl hover:shadow-xl transition-all duration-300">
          <div className="bg-blue-100 p-3 rounded-full">
            <FaUserGraduate className="text-blue-600 text-2xl" />
          </div>
          <div>
            <p className="text-3xl font-semibold text-gray-800">
              {dashboardData.enrolledStudentsData.length}
            </p>
            <p className="text-sm text-gray-500">Total Enrollments</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-2xl hover:shadow-xl transition-all duration-300">
          <div className="bg-green-100 p-3 rounded-full">
            <FaMoneyBillWave className="text-green-600 text-2xl" />
          </div>
          <div>
            <p className="text-3xl font-semibold text-gray-800">
              {currency}
              {dashboardData.totalEarnings}
            </p>
            <p className="text-sm text-gray-500">Total Earnings</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-2xl hover:shadow-xl transition-all duration-300">
          <div className="bg-purple-100 p-3 rounded-full">
            <FaBookOpen className="text-purple-600 text-2xl" />
          </div>
          <div>
            <p className="text-3xl font-semibold text-gray-800">
              {dashboardData.totalCourses}
            </p>
            <p className="text-sm text-gray-500">Total Courses</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enrollment Trends */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📈 Enrollment Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generateEnrollmentData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="enrollments"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#2563EB", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Earnings */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            💰 Monthly Earnings
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generateEarningsData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="earnings" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Course Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🧭 Course Enrollment Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={generateCourseDistribution()}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {generateCourseDistribution().map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    className="transition-all"
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Latest Enrollments */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🧑‍🎓 Latest Enrollments
          </h2>
          <div className="overflow-auto max-h-[320px]">
            <table className="w-full text-gray-600">
              <thead className="bg-gray-100 sticky top-0 text-sm font-medium">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Student</th>
                  <th className="px-4 py-3 text-left">Course</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.enrolledStudentsData.slice(0, 10).map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-150"
                  >
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={item.student.imageUrl}
                        alt={item.student.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                      <span className="text-gray-700 font-medium">
                        {item.student.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 truncate">
                      {item.courseTitle}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
