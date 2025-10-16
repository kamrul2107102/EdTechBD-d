import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../../components/student/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "../../components/student/CourseCard";
import {
  Code,
  Briefcase,
  Globe,
  BarChart,
  Cpu,
  BookOpen,
  Star,
} from "lucide-react";

const CoursesList = () => {
  const { allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [selectedRating, setSelectedRating] = useState(null);
  
  const categories = [
    { id: 1, name: "Development", icon: <Code size={18} /> },
    { id: 2, name: "Business", icon: <Briefcase size={18} /> },
    { id: 3, name: "Design", icon: <Globe size={18} /> },
    { id: 4, name: "Data Science", icon: <BarChart size={18} /> },
    { id: 5, name: "IT & Software", icon: <Cpu size={18} /> },
    { id: 6, name: "Personal Development", icon: <BookOpen size={18} /> },
  ];

  const calculateAverageRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) return 0;
    const totalRating = course.courseRatings.reduce((sum, rating) => {
      const ratingValue = typeof rating === "object" ? rating.rating : rating;
      return sum + ratingValue;
    }, 0);
    return totalRating / course.courseRatings.length;
  };

  useEffect(() => {
    if (!allCourses || allCourses.length === 0) return;

    let tempCourses = [...allCourses];

    tempCourses = tempCourses.map((c, i) => ({
      ...c,
      category: c.category || categories[i % categories.length].name,
      averageRating: calculateAverageRating(c),
      totalRatings: c.courseRatings ? c.courseRatings.length : 0,
    }));

    if (input) {
      const searchText = input.toLowerCase();
      tempCourses = tempCourses.filter((item) =>
        item.courseTitle.toLowerCase().includes(searchText)
      );
    }

    if (selectedCategories.length > 0) {
      tempCourses = tempCourses.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }

    if (selectedRating !== null) {
      tempCourses = tempCourses.filter((item) =>
        item.averageRating >= selectedRating
      );
    }

    switch (sortOption) {
      case "lowToHigh":
        tempCourses.sort((a, b) => a.coursePrice - b.coursePrice);
        break;
      case "highToLow":
        tempCourses.sort((a, b) => b.coursePrice - a.coursePrice);
        break;
      case "mostRated":
        tempCourses.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "mostPopular":
        tempCourses.sort((a, b) => b.totalRatings - a.totalRatings);
        break;
      case "newest":
        tempCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredCourses(tempCourses);
  }, [allCourses, input, selectedCategories, sortOption, selectedRating]);

  const handleCategoryChange = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <>
      {/* Sticky Search */}
      <div className="sticky top-[60px] z-40 bg-gray-50 py-2 shadow-sm flex justify-center">
  <div className="w-full max-w-xl px-4">
    <SearchBar data={input} />
  </div>
</div>


      <div className="flex flex-col md:flex-row pr-6 py-10 gap-8">
        {/* 🧩 Sticky Filter Sidebar */}
          <aside
          className="nline-block md:sticky md:top-[110px] self-start h-[calc(100vh-120px)] 
             overflow-y-auto border-r pr-2 pl-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >

            <h3 className="text-xl font-semibold mb-4">Filter by</h3>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Categories</h4>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.name)}
                onChange={() => handleCategoryChange(cat.name)}
                className="accent-blue-600"
              />
              <div className="flex items-center gap-2 text-sm">
                {cat.icon} {cat.name}
              </div>
            </label>
                ))}
              </div>
            </div>

            {/* Ratings */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Ratings</h4>
              <div className="flex flex-col gap-2 text-gray-600 text-sm">
                {[5, 4, 3, 0].map((star) => (
            <div 
              key={star} 
              className={`flex items-center gap-1 cursor-pointer hover:text-blue-600 ${
                selectedRating === star ? 'text-blue-600 font-medium' : ''
              }`}
              onClick={() => setSelectedRating(selectedRating === star ? null : star)}
            >
              {star > 0 ? (
                <>
                  {[...Array(star)].map((_, i) => (
              <Star key={i} size={14} fill="#facc15" stroke="none" />
                  ))}
                  <span>&nbsp;{star}.0 & up</span>
                </>
              ) : (
                <span>All Ratings</span>
              )}
            </div>
                ))}
              </div>
            </div>
          </aside>

          {/* 🧩 Main Course Section */}
        <main className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-700 font-medium">
              Showing {filteredCourses.length} results
            </p>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border px-3 py-2 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Sort by: Featured</option>
              <option value="mostPopular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="mostRated">Highest Rated</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          {/* Course List */}
          <div className="flex flex-col divide-y divide-gray-200">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <div
                  key={index}
                  className="py-6 hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">
                No courses found matching your filters.
              </p>
            )}
          </div>
        </main>
      </div>

    </>
  );
};

export default CoursesList;


// import React, { useContext, useEffect, useState } from "react";
// import { AppContext } from "../../context/AppContext";
// import SearchBar from "../../components/student/SearchBar";
// import { useParams } from "react-router-dom";
// import CourseCard from "../../components/student/CourseCard";
// import { assets } from "../../assets/assets";
// import Footer from "../../components/student/Footer";

// // Icons
// import { Code, Briefcase, Globe, BarChart, Award,Cpu, BookOpen } from "lucide-react";

// const CoursesList = () => {
//   const { navigate, allCourses } = useContext(AppContext);
//   const { input } = useParams();
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [sortOption, setSortOption] = useState("default");

//   // ✅ Static Categories
//   const categories = [
//     { id: 1, name: "Development", icon: <Code size={20} />, courses: "12,450" },
//     { id: 2, name: "Business", icon: <Briefcase size={20} />, courses: "8,320" },
//     { id: 3, name: "Design", icon: <Globe size={20} />, courses: "5,210" },
//     { id: 4, name: "Data Science", icon: <BarChart size={20} />, courses: "6,780" },
//     { id: 5, name: "IT & Software", icon: <Cpu size={20} />, courses: "9,140" },
//     { id: 6, name: "Personal Development", icon: <BookOpen size={20} />, courses: "3,870" },
//   ];

//   // ✅ Function to calculate average rating
//   const calculateAverageRating = (course) => {
//     if (!course.courseRatings || course.courseRatings.length === 0) return 0;
//     const totalRating = course.courseRatings.reduce((sum, rating) => {
//       const ratingValue = typeof rating === "object" ? rating.rating : rating;
//       return sum + ratingValue;
//     }, 0);
//     return totalRating / course.courseRatings.length;
//   };

//   useEffect(() => {
//     if (!allCourses || allCourses.length === 0) return;

//     let tempCourses = [...allCourses];

//     tempCourses = tempCourses.map((c, i) => ({
//       ...c,
//       category: c.category || categories[i % categories.length].name,
//       averageRating: calculateAverageRating(c),
//       totalRatings: c.courseRatings ? c.courseRatings.length : 0,
//     }));

//     if (input) {
//       const searchText = input.toLowerCase();
//       tempCourses = tempCourses.filter((item) =>
//         item.courseTitle.toLowerCase().includes(searchText)
//       );
//     }

//     if (selectedCategories.length > 0) {
//       tempCourses = tempCourses.filter((item) =>
//         selectedCategories.includes(item.category)
//       );
//     }

//     switch (sortOption) {
//       case "lowToHigh":
//         tempCourses.sort((a, b) => a.coursePrice - b.coursePrice);
//         break;
//       case "highToLow":
//         tempCourses.sort((a, b) => b.coursePrice - a.coursePrice);
//         break;
//       case "mostRated":
//         tempCourses.sort((a, b) => {
//           if (b.averageRating !== a.averageRating) return b.averageRating - a.averageRating;
//           return b.totalRatings - a.totalRatings;
//         });
//         break;
//       default:
//         break;
//     }

//     setFilteredCourses(tempCourses);
//   }, [allCourses, input, selectedCategories, sortOption]);

//   const handleCategoryChange = (categoryName) => {
//     setSelectedCategories((prev) =>
//       prev.includes(categoryName)
//         ? prev.filter((c) => c !== categoryName)
//         : [...prev, categoryName]
//     );
//   };

//   return (
//     <>
//       {/* ✅ Sticky Search Bar below Navbar */}
//       <div className="w-full bg-gray-50 py-4 px-8 md:px-36 shadow-sm  top-[60px] z-40">
//         <SearchBar tall data={input} />
//       </div>
// <div className="mb-16">
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-8">
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-3">
//                 <BookOpen size={32} />
//                 <h2 className="text-3xl md:text-4xl font-bold">Start Learning Today</h2>
//               </div>
//               <p className="text-blue-100 text-lg mb-6">
//                 Master programming from scratch with our interactive courses. Learn at your own pace with hands-on examples.
//               </p>
//               <div className="flex flex-wrap gap-4 mb-6">
//                 <div className="flex items-center gap-2">
//                   <Code size={20} />
//                   <span>Interactive Lessons</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Award size={20} />
//                   <span>Free to Start</span>
//                 </div>
//               </div>
//               <button
//                 onClick={() => navigate("/learn")}
//                 className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg hover:shadow-xl"
//               >
//                 Explore Courses →
//               </button>
//             </div>
//             <div className="flex-shrink-0">
//               <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
//                 <div className="text-center">
//                   <div className="text-5xl font-bold mb-2">3+</div>
//                   <div className="text-blue-100">Courses Available</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="relative md:px-36 px-8 pt-8 text-left">
//         {/* Title + Sorting */}
//         <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full mt-4">
//           <div>
//             <h1 className="text-4xl font-semibold text-gray-800">
//               Course List
//             </h1>
//           </div>

//           {/* ✅ Sorting Dropdown */}
//           <select
//             value={sortOption}
//             onChange={(e) => setSortOption(e.target.value)}
//             className="border px-3 py-2 rounded-lg text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="default">Sort by: Default</option>
//             <option value="lowToHigh">Price: Low to High</option>
//             <option value="highToLow">Price: High to Low</option>
//             <option value="mostRated">Highest Rated</option>
//           </select>
//         </div>

//         {/* Search Input visible when searching */}
//         {input && (
//           <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 text-gray-600 rounded-lg bg-gray-50 shadow-sm">
//             <p className="font-medium">{input}</p>
//             <img
//               src={assets.cross_icon}
//               alt="clear_search"
//               className="cursor-pointer hover:scale-110 transition-transform"
//               onClick={() => navigate("/course-list")}
//             />
//           </div>
//         )}

//         {/* ✅ Category Filter */}
//         <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
//           {categories.map((cat) => (
//             <label
//               key={cat.id}
//               className={`flex items-center gap-3 p-4 border rounded-lg shadow-sm cursor-pointer transition-all ${
//                 selectedCategories.includes(cat.name)
//                   ? "bg-blue-50 border-blue-600"
//                   : "bg-white hover:border-gray-400"
//               }`}
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedCategories.includes(cat.name)}
//                 onChange={() => handleCategoryChange(cat.name)}
//                 className="w-4 h-4 accent-blue-600"
//               />
//               <div className="flex items-center gap-2">
//                 {cat.icon}
//                 <div>
//                   <p className="font-semibold text-gray-800">{cat.name}</p>
//                   <span className="text-sm text-gray-500">{cat.courses} courses</span>
//                 </div>
//               </div>
//             </label>
//           ))}
//         </div>

//         {/* ✅ Course Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 my-16 gap-6 px-2 md:p-0">
//           {filteredCourses.length > 0 ? (
//             filteredCourses.map((course, index) => (
//               <CourseCard key={index} course={course} />
//             ))
//           ) : (
//             <p className="col-span-full text-center text-gray-500 text-lg">
//               No courses found matching your filters.
//             </p>
//           )}
//         </div>
//       </div>

      
//     </>
//   );
// };

// export default CoursesList;
