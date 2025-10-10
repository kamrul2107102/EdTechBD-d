import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200 p-5">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-3">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-medium"
                : "text-gray-600 hover:text-blue-500"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/manage-users"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-medium"
                : "text-gray-600 hover:text-blue-500"
            }
          >
            Manage Users
          </NavLink>
          <NavLink
            to="/admin/manage-courses"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-medium"
                : "text-gray-600 hover:text-blue-500"
            }
          >
            Manage Courses
          </NavLink>
          <NavLink
            to="/admin/approve-educators"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-medium"
                : "text-gray-600 hover:text-blue-500"
            }
          >
            Approve Educators
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
