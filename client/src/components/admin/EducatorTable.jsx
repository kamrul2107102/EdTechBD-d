import React from "react";
import { FaCheckCircle, FaTrash } from "react-icons/fa";

const EducatorTable = ({ educators, handleApproveEducator, handleDeleteUser }) => {
  return (
    <div className="overflow-hidden rounded-lg shadow-sm bg-white border border-gray-200">
      <table className="w-full table-auto text-gray-600">
        <thead className="bg-gray-100 text-gray-700 text-sm font-medium">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {educators.map((user, i) => (
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
  );
};

export default EducatorTable;
