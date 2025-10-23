import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../../components/student/SearchBar";
import { useParams, useNavigate } from "react-router-dom";
import CourseCard from "../../components/student/CourseCard";
import {
  Code,
  Briefcase,
  Globe,
  BarChart,
  Cpu,
  BookOpen,
  Star,
  SlidersHorizontal,
  GraduationCap,
} from "lucide-react";

const CoursesList = () => {
  const { allCourses } = useContext(AppContext);
  const { input } = useParams();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sticky Search 
      <div className="sticky top-[60px] z-40 bg-white/90 backdrop-blur-md py-4 shadow-md border-b border-gray-200">
        <div className="w-full max-w-xl mx-auto px-4">
          <SearchBar data={input} />
        </div>
      </div>*/}

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-0 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 🧩 Sticky Filter Sidebar */}
          <aside className="lg:sticky lg:top-[130px] self-start w-full lg:w-72 shrink-0 lg:ml-0">
            {/* Free Tutorial Section */}
            <div className="mb-6 bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50 rounded-xl shadow-lg border-2 border-blue-200 p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full shadow-lg">
                  <GraduationCap size={32} className="text-white" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Try Our Free Tutorial Course
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Start your learning journey with our comprehensive free tutorial. Perfect for beginners and those looking to explore new topics!
              </p>
              <button
                onClick={() => navigate('/learn')}
                className="group relative w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  <GraduationCap size={18} />
                  Free Tutorial
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal size={20} className="text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Filters</h3>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">
                  Categories
                </h4>
                <div className="flex flex-col gap-3">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                        selectedCategories.includes(cat.name)
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "hover:bg-gray-50 text-gray-700 border border-transparent"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.name)}
                        onChange={() => handleCategoryChange(cat.name)}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {cat.icon} {cat.name}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">
                  Ratings
                </h4>
                <div className="flex flex-col gap-2">
                  {[5, 4, 3, 0].map((star) => (
                    <div
                      key={star}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                        selectedRating === star
                          ? "bg-blue-50 text-blue-700 border border-blue-200 font-semibold"
                          : "hover:bg-gray-50 text-gray-700 border border-transparent"
                      }`}
                      onClick={() => setSelectedRating(selectedRating === star ? null : star)}
                    >
                      {star > 0 ? (
                        <>
                          <div className="flex">
                            {[...Array(star)].map((_, i) => (
                              <Star key={i} size={16} fill="#facc15" stroke="#facc15" />
                            ))}
                          </div>
                          <span className="text-sm">{star}.0 & up</span>
                        </>
                      ) : (
                        <span className="text-sm font-medium">All Ratings</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* 🧩 Main Course Section */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {input ? `Results for "${input}"` : "All Courses"}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Showing <span className="font-semibold text-blue-600">{filteredCourses.length}</span> courses
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm font-medium">Sorted by:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border-2 border-gray-200 text-gray-700 text-sm font-medium bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="default">⭐ Featured</option>
                    <option value="mostPopular">🔥 Most Popular</option>
                    <option value="newest">🆕 Newest</option>
                    <option value="mostRated">⭐ Highest Rated</option>
                    <option value="lowToHigh">💰 Price: Low to High</option>
                    <option value="highToLow">💎 Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Course List */}
            <div className="space-y-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <CourseCard course={course} />
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <BookOpen size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No courses found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or search term
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CoursesList;
