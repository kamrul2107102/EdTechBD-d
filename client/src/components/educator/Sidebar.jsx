import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FilePlus, BookOpen, Users, Menu, MessageCircleQuestion } from "lucide-react";

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
          className={`${isOpen ? "w-52" : "w-16"} min-h-screen border-r ${currentTheme.border} py-2 flex flex-col transition-[width] duration-700 ease-in-out ${currentTheme.bg} fixed md:relative z-50 shadow-lg`}
        >
          {/* Toggle + Brand */}
          <div className="relative flex items-center justify-start px-2 mb-4 md:mb-6">
            <button
              onClick={toggleSidebar}
              className={`${currentTheme.buttonBg} flex items-center justify-center p-2 group relative rounded-full shadow-sm hover:scale-105 transition-all duration-300`}
            >
              <Menu
                className={`w-6 h-6 ${currentTheme.text} transform transition-transform duration-700 ease-in-out ${isOpen ? "rotate-90" : "rotate-0"}`}
              />
              <span className={`absolute top-full left-[60%] -translate-x-0 mt-1 whitespace-nowrap text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${currentTheme.text}`}>
                {isOpen ? "Close Sidebar" : "Open Sidebar"}
              </span>
            </button>

            <span className={`text-lg font-bold leading-none ml-3 overflow-hidden transition-all duration-500 whitespace-nowrap ${currentTheme.text} ${isOpen ? "opacity-100 max-w-full" : "opacity-0 max-w-0"}`}>
              EdTechBd
            </span>
          </div>

          {/* Menu Items */}
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                to={item.path}
                key={item.name}
                end={item.path === "/educator"}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 rounded-r-full transition-all duration-500 ease-in-out ${
                    isActive
                      ? `${currentTheme.activeBg} border-r-[2px] border-indigo-500`
                      : `${currentTheme.hoverBg} border-r-[6px] ${currentTheme.border}`
                  }`
                }
              >
                {Icon && <Icon className={`w-6 h-6 ${currentTheme.text} flex-shrink-0`} strokeWidth={1.7} />}
                <p className={`overflow-hidden whitespace-nowrap transition-all duration-500 ${isOpen ? "opacity-100 ml-3" : "opacity-0 ml-0 w-0"}`}>
                  {item.name}
                </p>
              </NavLink>
            );
          })}
        </div>

        {/* Mobile Overlay */}
        {isOpen && <div className="fixed inset-0 bg-black/30 md:hidden z-40 transition-opacity duration-700" onClick={toggleSidebar}></div>}
      </div>
    )
  );
};

export default Sidebar;
