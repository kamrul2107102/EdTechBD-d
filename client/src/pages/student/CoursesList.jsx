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


