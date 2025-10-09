import React, { useContext, useEffect, useState } from "react";
import Loading from "../../components/student/Loading";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const AuditedCourses = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const [auditedCourses, setAuditedCourses] = useState(null);

  const fetchAuditedCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/user/audited-courses",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setAuditedCourses(data.auditedCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // এখানে educator চেক করার দরকার নেই,
    // user দের জন্য audit কাজ করে তাই শুধু fetch করবো
    fetchAuditedCourses();
  }, []);

  return auditedCourses ? (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 pt-8 pb-0">
      <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <h2 className="text-xl font-semibold px-4 pt-4 pb-2">
          My Audited Courses
        </h2>
        <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                #
              </th>
              <th className="px-4 py-3 font-semibold">Course Title</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">
                Thumbnail
              </th>
              <th className="px-4 py-3 font-semibold">Audited On</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
            {auditedCourses.map((course, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  {index + 1}
                </td>
                <td className="px-4 py-3 truncate">{course.courseTitle}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <img
                    src={course.courseThumbnail || "/placeholder.png"}
                    alt={course.courseTitle}
                    className="w-12 h-12 rounded"
                  />
                </td>
                <td className="px-4 py-3">
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default AuditedCourses;
