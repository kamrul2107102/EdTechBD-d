// import React, { useContext, useEffect, useState } from "react";
// import { AppContext } from "../../context/AppContext";
// import { assets, dummyDashboardData } from "../../assets/assets";
// import Loading from "../../components/student/Loading";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Dashboard = () => {
//   const { currency, backendUrl, getToken, isEducator } = useContext(AppContext);
//   const [dashboardData, setDashboardData] = useState(null);

//   const fetchDashboardData = async () => 
//     {
// // serverless
// //       setDashboardData(dummyDashboardData); // Mock data
// //       useEffect(() => {
// //         fetchDashboardData();
// //       }, []);

//     try {
//       const token = await getToken();
//       const { data } = await axios.get(backendUrl + "/api/educator/dashboard", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (data.success) {
//         setDashboardData(data.dashboardData);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (isEducator) {
//       fetchDashboardData();
//     }
//   }, [isEducator]);

//   return dashboardData ? (
//     <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:ob-0 p-4 pt-8 pb-0">
//       <div className="space-y-5">
//         <div className="flex flex-wrap gap-5 items-center">
//           <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
//             <img src={assets.patients_icon} alt="patients_icon" />
//             <div>
//               <p className="text-2xl font-medium text-gray-600">
//                 {dashboardData.enrolledStudentsData.length}
//               </p>
//               <p className="text-base text-gray-500">Total Enrolments</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
//             <img src={assets.appointments_icon} alt="appointments_icon" />
//             <div>
//               <p className="text-2xl font-medium text-gray-600">
//                 {dashboardData.totalCourses}
//               </p>
//               <p className="text-base text-gray-500">Total Courses</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
//             <img src={assets.earning_icon} alt="earning_icon" />
//             <div>
//               <p className="text-2xl font-medium text-gray-600">
//                 {currency}
//                 {dashboardData.totalEarnings}
//               </p>
//               <p className="text-base text-gray-500">Total Earnings</p>
//             </div>
//           </div>
//         </div>

//         <div>
//           <h2 className="pb-4 text-lg font-medium">Latest Enrolments</h2>
//           <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
//             <table className="table-fixed md:table-auto w-full overflow-hidden">
//               <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
//                 <tr>
//                   <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
//                     #
//                   </th>
//                   <th className="px-4 py-3 font-semibold">Student Name</th>
//                   <th className="px-4 py-3 font-semibold">Course Title</th>
//                 </tr>
//               </thead>
//               <tbody className="text-sm text-gray-500">
//                 {dashboardData.enrolledStudentsData.map((item, index) => (
//                   <tr key={index} className="border-b border-gray-500/20">
//                     <td className="px-4 py-3 text-center hidden sm:table-cell">
//                       {index + 1}
//                     </td>
//                     <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
//                       <img
//                         src={item.student.imageUrl}
//                         alt="Profile"
//                         className="w-9 h-9 rounded-full"
//                       />
//                       <span className="truncate">{item.student.name}</span>
//                     </td>
//                     <td className="px-4 py-3 truncate">{item.courseTitle}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   ) : (
//     <Loading />
//   );
// };

// export default Dashboard;


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

// ✅ Import React Icons
import { FaUserGraduate, FaMoneyBillWave, FaBookOpen } from "react-icons/fa";

const Dashboard = () => {
   const { currency, backendUrl, getToken, isEducator } = useContext(AppContext);
 const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
//     setDashboardData(dummyDashboardData); // Mock data
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);


try {
  const token = await getToken();
  const { data } = await axios.get(backendUrl + "/api/educator/dashboard", {
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

useEffect(() => {
if (isEducator) {
  fetchDashboardData();
}
}, [isEducator]);

  // Generate mock data for charts (you can replace this with real data from your API)
  const generateEnrollmentData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, index) => ({
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
        if (existing) {
          existing.value += 1;
        } else {
          acc.push({ name: item.courseTitle, value: 1 });
        }
        return acc;
      }, [])
      .slice(0, 5);
  };

  const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];

  return dashboardData ? (
    <div className="min-h-screen p-6 md:p-8 flex flex-col gap-8 bg-gray-50">
      {/* ✅ Summary Cards */}
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-4 p-4 w-56 bg-white shadow-md border border-gray-200 rounded-lg transition-transform hover:scale-105">
          <FaUserGraduate className="w-10 h-10 text-blue-500" />
          <div>
            <p className="text-2xl font-semibold text-gray-700">
              {dashboardData.enrolledStudentsData.length}
            </p>
            <p className="text-sm text-gray-500">Total Enrolments</p>
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

        <div className="flex items-center gap-4 p-4 w-56 bg-white shadow-md border border-gray-200 rounded-lg transition-transform hover:scale-105">
          <FaBookOpen className="w-10 h-10 text-purple-500" />
          <div>
            <p className="text-2xl font-semibold text-gray-700">
              {dashboardData.totalCourses}
            </p>
            <p className="text-sm text-gray-500">Total Courses</p>
          </div>
        </div>
      </div>

      {/* ✅ Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Enrollment Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generateEnrollmentData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="enrollments"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Earnings Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Monthly Earnings
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generateEarningsData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="earnings" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Course Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Course Enrollment Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={generateCourseDistribution()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {generateCourseDistribution().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Latest Enrolments Table */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Latest Enrolments
          </h2>
          <div className="overflow-auto max-h-[300px]">
            <table className="w-full table-auto text-gray-600">
              <thead className="bg-gray-100 text-gray-700 text-sm font-medium sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-center hidden sm:table-cell">
                    #
                  </th>
                  <th className="px-4 py-3 text-left">Student</th>
                  <th className="px-4 py-3 text-left">Course</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.enrolledStudentsData.slice(0, 10).map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-center hidden sm:table-cell text-sm">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.student.imageUrl}
                          alt={item.student.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="truncate text-sm">
                          {item.student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 truncate text-sm">
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
  ) : (
    <Loading />
  );
};

export default Dashboard;

