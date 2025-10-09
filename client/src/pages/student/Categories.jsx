import React from "react";
import { BookOpen, Code, Briefcase, Globe, Cpu, BarChart } from "lucide-react";

const categories = [
  { id: 1, name: "Development", icon: <Code size={28} />, courses: "12,450" },
  { id: 2, name: "Business", icon: <Briefcase size={28} />, courses: "8,320" },
  { id: 3, name: "Design", icon: <Globe size={28} />, courses: "5,210" },
  { id: 4, name: "Data Science", icon: <BarChart size={28} />, courses: "6,780" },
  { id: 5, name: "IT & Software", icon: <Cpu size={28} />, courses: "9,140" },
  { id: 6, name: "Personal Development", icon: <BookOpen size={28} />, courses: "3,870" },
];

const Categories = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Explore Categories</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-4 p-6 rounded-xl shadow-md bg-white border hover:shadow-lg hover:border-blue-500 transition cursor-pointer"
          >
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              {cat.icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{cat.name}</h2>
              <p className="text-sm text-gray-500">{cat.courses} Courses</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
