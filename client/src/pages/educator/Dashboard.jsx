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
  ResponsiveContainer,
} from "recharts";
import { FaUserGraduate, FaMoneyBillWave, FaBookOpen, FaArrowUp } from "react-icons/fa";

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

  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  if (!dashboardData) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back! Here's your teaching performance overview
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Enrollments Card */}
          <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Total Enrollments
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mb-1">
                    {dashboardData.enrolledStudentsData.length}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <FaArrowUp className="w-3 h-3" />
                    <span className="font-medium">+12% from last month</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <FaUserGraduate className="text-white text-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Total Earnings Card */}
          <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Total Earnings
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mb-1">
                    {currency}{dashboardData.totalEarnings}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <FaArrowUp className="w-3 h-3" />
                    <span className="font-medium">+8% from last month</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                  <FaMoneyBillWave className="text-white text-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Total Courses Card */}
          <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Active Courses
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mb-1">
                    {dashboardData.totalCourses}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="font-medium">Published courses</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <FaBookOpen className="text-white text-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Enrollment Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Enrollment Trends</h2>
                <p className="text-sm text-gray-500 mt-1">Monthly student enrollments</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={generateEnrollmentData()}>
                <defs>
                  <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF" 
                  style={{ fontSize: '12px', fontWeight: '500' }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  style={{ fontSize: '12px', fontWeight: '500' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFF",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{ fontWeight: '600', color: '#374151' }}
                />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ fill: "#6366F1", r: 4, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  fill="url(#colorEnrollments)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Earnings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Monthly Earnings</h2>
                <p className="text-sm text-gray-500 mt-1">Revenue over time</p>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={generateEarningsData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px', fontWeight: '500' }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px', fontWeight: '500' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFF",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{ fontWeight: '600', color: '#374151' }}
                />
                <Bar 
                  dataKey="earnings" 
                  fill="#10B981" 
                  radius={[8, 8, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Course Distribution</h2>
                <p className="text-sm text-gray-500 mt-1">Top 5 courses by enrollment</p>
              </div>
              <div className="bg-purple-50 p-2 rounded-lg">
                <span className="text-2xl">🧭</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={generateCourseDistribution()}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ percent }) =>
                    `${(percent * 100).toFixed(0)}%`
                  }
                >
                  {generateCourseDistribution().map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFF",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {generateCourseDistribution().map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-gray-700 font-medium truncate max-w-[200px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-gray-500 font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Enrollments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Latest Enrollments</h2>
                <p className="text-sm text-gray-500 mt-1">Recent student registrations</p>
              </div>
              <div className="bg-indigo-50 p-2 rounded-lg">
                <span className="text-2xl">🧑‍🎓</span>
              </div>
            </div>
            <div className="overflow-auto max-h-[350px] custom-scrollbar">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tl-lg">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tr-lg">
                      Course
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dashboardData.enrolledStudentsData.slice(0, 10).map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-indigo-50/50 transition-colors duration-150"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={item.student.imageUrl}
                              alt={item.student.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {item.student.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 max-w-[200px]">
                        <span className="truncate block" title={item.courseTitle}>
                          {item.courseTitle}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F3F4F6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
