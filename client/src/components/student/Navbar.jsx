// import React, { useContext, useState } from "react";
// import { assets } from "../../assets/assets";
// import { Link, useLocation } from "react-router-dom"; // ✅ useLocation added
// import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
// import { AppContext } from "../../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Navbar = () => {
//   const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
//     useContext(AppContext);

//   const location = useLocation(); // ✅ Get current path
//   const isCourseListPage = location.pathname.includes("/course-list");

//   const { openSignIn } = useClerk();
//   const { user } = useUser();

//   const [showMobileMenu, setShowMobileMenu] = useState(false);

//   const becomeEducator = async () => {
//     try {
//       if (isEducator) {
//         navigate("/educator");
//         return;
//       }
//       const token = await getToken();
//       const { data } = await axios.get(
//         backendUrl + "/api/educator/update-role",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (data.success) {
//         setIsEducator(true);
//         toast.success(data.message);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const Logo = () => (
//     <div
//       className="flex items-center gap-3 cursor-pointer"
//       onClick={() => navigate("/")}
//     >
//       <div className="flex items-center justify-center rounded-full bg-white shadow-lg border-2 border-blue-400 hover:scale-105 transition-transform duration-300 w-12 h-12">
//         <img src="/src/assets/e.svg" alt="Logo" className="h-8 w-8 object-contain" />
//       </div>
//       <span className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 uppercase">
//         EdTechBd
//       </span>
//     </div>
//   );

//   // ✅ Helper: check active link
//   const isActive = (path) => location.pathname === path;

//   return (
//     <nav className={`w-full ${isCourseListPage ? "bg-white shadow-md" : "bg-cyan-100/70 backdrop-blur-md"} sticky top-0 z-50`}>
//       <div className="max-w-7xl mx-auto px-6 md:px-14 lg:px-36 flex items-center justify-between py-4">

//         {/* Logo */}
//         <Logo />

//         {/* Desktop Links */ }
//         <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">
//           <Link
//             className={`${isActive("/") ? "text-blue-600 font-bold" : "hover:text-blue-600"} transition`}
//             to="/"
//           >
//             Home
//           </Link>
//           <Link
//             to={"/course-list"}
//             className={`${isActive("/course-list") ? "text-blue-600 font-bold" : "hover:text-blue-600"} transition`}
//             onClick={() => scrollTo(0, 0)}
//           >
//             All Courses
//           </Link>
//           <Link
//             className={`${isActive("/deals") ? "text-blue-600 font-bold" : "hover:text-blue-600"} transition`}
//             to="/deals"
//           >
//             Deals
//           </Link>
//           <Link
//             className={`${isActive("/blog") ? "text-blue-600 font-bold" : "hover:text-blue-600"} transition`}
//             to="/blog"
//           >
//             Blog
//           </Link>
//         </div>

//         {/* Right Section */}
//         <div className="hidden md:flex items-center gap-4">
//           {user && (
//             <>
//               <button
//                 onClick={becomeEducator}
//                 className="px-4 py-2 rounded-md hover:text-blue-600 transition"
//               >
//                 {isEducator ? "Educator Dashboard" : "Become Educator"}
//               </button>
//               <Link
//                 className={`${isActive("/my-enrollments") ? "text-blue-600 font-bold" : "hover:text-blue-600"} transition`}
//                 to="/my-enrollments"
//               >
//                 My Enrollments
//               </Link>
//             </>
//           )}
//           {user ? (
//             <UserButton
//               appearance={{
//                 elements: {
//                   userButtonBox: "bg-white rounded-full shadow-md hover:scale-105 transition-transform duration-200",
//                 },
//               }}
//             />
//           ) : (
//             <button
//               onClick={() => openSignIn()}
//               className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-shadow shadow-md"
//             >
//               Sign In / Sign Up
//             </button>
//           )}
//         </div>

//         {/* Mobile Menu Toggle */}
//         <div className="md:hidden flex items-center gap-3">
//           <button
//             onClick={() => setShowMobileMenu(!showMobileMenu)}
//             className="text-gray-700 focus:outline-none"
//           >
//             {showMobileMenu ? "✖" : "☰"}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Dropdown Menu */}
//       {showMobileMenu && (
//         <div className="md:hidden bg-white shadow-lg w-full px-6 py-4 flex flex-col gap-4">
//           <Link className={`${isActive("/") ? "text-blue-600 font-bold" : ""}`} to="/">Home</Link>
//           <Link className={`${isActive("/course-list") ? "text-blue-600 font-bold" : ""}`} to="/courses">All Courses</Link>
//           <Link className={`${isActive("/deals") ? "text-blue-600 font-bold" : ""}`} to="/deals">Deals</Link>
//           <Link className={`${isActive("/blog") ? "text-blue-600 font-bold" : ""}`} to="/blog">Blog</Link>
//           {user && (
//             <>
//               <button onClick={becomeEducator}>
//                 {isEducator ? "Educator Dashboard" : "Become Educator"}
//               </button>
//               <Link className={`${isActive("/my-enrollments") ? "text-blue-600 font-bold" : ""}`} to="/my-enrollments">My Enrollments</Link>
//             </>
//           )}
//           {!user && (
//             <button onClick={() => openSignIn()} className="bg-blue-600 text-white px-4 py-2 rounded-full">
//               Sign In / Sign Up
//             </button>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";
import logo from "../../assets/logof.png";

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
    useContext(AppContext);
  const location = useLocation();
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  // ✅ Become Educator handler
  const becomeEducator = async () => {
    if (!user) {
      openSignIn();
      return;
    }

    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }

      const token = await getToken();
      if (!token) {
        toast.error("User session expired. Please sign in again.");
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/educator/update-role`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
        navigate("/educator"); // Automatically navigate after success
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const Logo = () => (
    <div
      className="flex items-center gap-1 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <div className="flex items-center justify-center hover:scale-105 transition-transform duration-300 w-9 h-9">
        <img src={logo} alt="Logo" className="h-5 w-5 object-contain" />
      </div>
      <span
  className="text-2xl font-extrabold tracking-tight transition-transform duration-300 hover:scale-101"
  style={{
    fontFamily: "'Bitcount Prop Single Ink', sans-serif",
  }}
>
  {/* <span className="bg-gradient-to-r from-[#003087] to-[#009cde] text-transparent bg-clip-text drop-shadow-[0_0_8px_rgba(0,156,222,0.4)]">
    Ed
  </span>
  <span className="bg-gradient-to-r from-[#003087] to-[#009cde] text-transparent bg-clip-text drop-shadow-[0_0_8px_rgba(0,156,222,0.4)]">
    Tech
  </span>
  <span className="text-[#1877F2] drop-shadow-[0_0_6px_rgba(24,119,242,0.4)] font-extrabold tracking-tight">
  BD
</span> */}
<span className="text-black " onClick={() => navigate("/") }>EdTechBD</span>
</span>




    </div>
  );

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-md bg-white/80 shadow-md border-b border-gray-200">
      <div className="max-w-8xl mx-auto px-2 md:px-6 flex items-center justify-between py-2">
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-3 md:gap-5">
          <Logo />
          <div className="hidden lg:block w-48">
            <SearchBar compact />
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-4 font-medium text-gray-700">
            {["/", "/course-list", "/deals", "/blog"].map((path, idx) => {
              const label = ["Home", "All Courses", "Deals", "Blog"][idx];
              return (
                <Link
                  key={idx}
                  to={path}
                  className={`relative px-2 py-1 transition group ${
                    isActive(path)
                      ? "text-blue-600 font-semibold after:content-[''] after:block after:h-0.5 after:bg-blue-600 after:rounded-full after:w-full after:mt-1"
                      : "hover:text-blue-600"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <>
                <button
                  onClick={becomeEducator}
                  className="px-3 py-1.5 rounded-lg text-gray-700 font-semibold hover:bg-blue-50 transition shadow-sm text-sm"
                >
                  {isEducator ? "Dashboard" : "Become Educator"}
                </button>
                <Link
                  to="/my-enrollments"
                  className={`px-2 py-1.5 rounded-lg hover:bg-blue-50 transition text-sm ${
                    isActive("/my-enrollments")
                      ? "text-blue-600 font-semibold"
                      : ""
                  }`}
                >
                  My Enrollments
                </Link>
              </>
            )}
            {!user && (
              <button
                onClick={openSignIn}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1.5 rounded-full hover:scale-105 transition-transform shadow-md text-sm"
              >
                Sign In / Sign Up
              </button>
            )}
            {user && (
              <UserButton
                appearance={{
                  elements: {
                    userButtonBox:
                      "bg-white rounded-full shadow-md hover:scale-105 transition-transform duration-200 w-8 h-8",
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-gray-700 text-2xl focus:outline-none"
          >
            {showMobileMenu ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white shadow-lg w-full px-4 py-4 flex flex-col gap-3 animate-slide-down">
          {["/", "/course-list", "/deals", "/blog"].map((path, idx) => (
            <Link
              key={idx}
              to={path}
              className={`${
                isActive(path) ? "text-blue-600 font-semibold" : ""
              }`}
            >
              {["Home", "All Courses", "Deals", "Blog"][idx]}
            </Link>
          ))}
          {user && (
            <>
              <button
                onClick={becomeEducator}
                className="px-4 py-2 rounded-md hover:bg-blue-50 transition text-sm"
              >
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              <Link
                to="/my-enrollments"
                className={`${
                  isActive("/my-enrollments")
                    ? "text-blue-600 font-semibold"
                    : ""
                }`}
              >
                My Enrollments
              </Link>
            </>
          )}
          {!user && (
            <button
              onClick={openSignIn}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full shadow-md font-semibold hover:scale-105 transition-transform text-sm"
            >
              Sign In / Sign Up
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
