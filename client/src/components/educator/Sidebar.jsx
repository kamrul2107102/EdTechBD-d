import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FilePlus, BookOpen, Users, Menu, MessageCircleQuestion, ChevronLeft } from "lucide-react";

const Sidebar = () => {
  const { isEducator, currentTheme } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  const menuItems = [
    { name: "Dashboard", path: "/educator", icon: LayoutDashboard },
    { name: "Add Course", path: "/educator/add-course", icon: FilePlus },
    { name: "My Courses", path: "/educator/my-courses", icon: BookOpen },
    { name: "Doubts", path: "/educator/doubts", icon: MessageCircleQuestion },
    { name: "Earnings", path: "/educator/student-enrolled", icon: Users },
    { name: "Audited Courses", path: "/educator/audited-courses", icon: BookOpen },
  ];

  return (
    isEducator && (
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${isOpen ? "w-64" : "w-20"} min-h-screen border-r ${currentTheme.border} flex flex-col transition-all duration-300 ease-in-out ${currentTheme.bg} fixed md:relative z-50`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/10">
            <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">ET</span>
              </div>
              <div className="flex flex-col">
                <span className={`text-base font-bold ${currentTheme.text}`}>EdTechBd</span>
                <span className={`text-xs ${currentTheme.text} opacity-60`}>Educator Portal</span>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className={`${currentTheme.buttonBg} p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group ${!isOpen && 'mx-auto'}`}
              aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            >
              <ChevronLeft
                className={`w-5 h-5 ${currentTheme.text} transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  to={item.path}
                  key={item.name}
                  end={item.path === "/educator"}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                      isActive
                        ? `bg-gradient-to-r from-indigo-500/10 to-purple-500/10 ${currentTheme.text} shadow-sm`
                        : `${currentTheme.text} hover:bg-gray-100/50 dark:hover:bg-gray-800/50`
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-full" />
                      )}
                      <div className={`${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                        {Icon && <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />}
                      </div>
                      <span
                        className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                          isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 w-0"
                        }`}
                      >
                        {item.name}
                      </span>
                      {!isOpen && (
                        <span className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                          {item.name}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={`p-4 border-t ${currentTheme.border}`}>
            <div className={`text-xs ${currentTheme.text} opacity-50 text-center transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
              © 2024 EdTechBd
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-40 transition-all duration-300" onClick={toggleSidebar}></div>}
      </div>
    )
  );
};

export default Sidebar;
