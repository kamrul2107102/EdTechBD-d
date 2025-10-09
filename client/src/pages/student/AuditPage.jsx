import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Footer from "../../components/student/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading"; // ✅ Loading Component Import


const AuditPage = () => {
  const { userData, backendUrl, getToken, navigate } = useContext(AppContext);
  const [auditedCourses, setAuditedCourses] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state

  const fetchAuditedCourses = async () => {
    setLoading(true); // ✅ Fetch শুরু হওয়ার সাথে সাথে Loading true
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/user/audited-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) setAuditedCourses(data.auditedCourses);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTimeout(() => setLoading(false), 300); // ✅ Minimum 500ms Loading show
    }
  };

  useEffect(() => {
    if (userData) fetchAuditedCourses();
  }, [userData]);

  if (loading) return <Loading />; // ✅ Loading Screen Show

  return (
    <div className="md:px-36 px-8 pt-10">
      <h1 className="text-2xl font-semibold mb-6">My Audited Courses</h1>

      {auditedCourses.length === 0 ? (
        <p>No courses audited yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {auditedCourses.map((course) => (
            <div key={course._id} className="border rounded p-4 shadow-md">
              <img
                src={course.courseThumbnail || "/placeholder.png"}
                alt={course.courseTitle}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="mt-2 font-semibold">{course.courseTitle}</h2>
              <button
                onClick={() => navigate("/player/" + course._id)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Access Course
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AuditPage;
