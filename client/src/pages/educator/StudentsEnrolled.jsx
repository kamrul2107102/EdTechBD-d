import React, { useContext, useEffect, useState } from "react";
import Loading from "../../components/student/Loading";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Users, BookOpen, GraduationCap } from "lucide-react";

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async () => 
    {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/enrolled-students",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    //setEnrolledStudents(dummyStudentEnrolled);

  };
// useEffect(() => {
//   fetchEnrolledStudents();
// }
// , []);
  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents();
    }
  }, [isEducator]);

  // Derived UI-only stats (no backend changes)
  if (!enrolledStudents) return <Loading />;

  const totalEnrollments = enrolledStudents.length;
  const uniqueCourses = new Set(enrolledStudents.map((e) => e.courseTitle)).size;
  const uniqueStudents = new Set(
    enrolledStudents.map((e) => e?.student?.email || e?.student?._id || e?.student?.name)
  ).size;

  return (
    <div className="min-h-screen w-full md:p-8 p-4">
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Students Enrolled
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Overview of enrollments across your courses
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Students</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{uniqueStudents}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
          <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Courses</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{uniqueCourses}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Enrollments</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{totalEnrollments}</p>
          </div>
        </div>
      </div>

      {/* Table/Card */}
      {totalEnrollments === 0 ? (
        <div className="w-full max-w-5xl mx-auto rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center bg-gray-50 dark:bg-gray-900/40">
          <div className="mx-auto w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow flex items-center justify-center mb-3">
            <Users className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">No enrollments yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your students’ enrollments will appear here once they start joining.</p>
        </div>
      ) : (
        <div className="w-full max-w-6xl mx-auto overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-50/80 dark:bg-gray-800/60 backdrop-blur border-b border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center w-12 hidden sm:table-cell">#</th>
                  <th className="px-4 py-3 font-semibold text-left">Student</th>
                  <th className="px-4 py-3 font-semibold text-left">Course</th>
                  <th className="px-4 py-3 font-semibold text-left hidden sm:table-cell">Enrolled On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {enrolledStudents.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-center text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.student.imageUrl}
                          alt={item.student.name}
                          className="w-9 h-9 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-gray-900 dark:text-white font-medium truncate">
                            {item.student.name}
                          </p>
                          {item.student?.email && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.student.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className="inline-flex items-center gap-2 max-w-full">
                        <span className="inline-block truncate px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                          {item.courseTitle}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                      {new Date(item.purchaseDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsEnrolled;
