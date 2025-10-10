import React from "react";
import { FaTrash } from "react-icons/fa";

const CourseTable = ({ courses, handleDeleteCourse, currency }) => {
  return (
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
          {courses.map((course, i) => (
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
  );
};

export default CourseTable;
