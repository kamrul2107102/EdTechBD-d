import React from "react";
import { Star } from "lucide-react";
import { dummyCourses } from "../../assets/assets"; // make sure your dummyCourses is exported

// Existing deals
const deals = [
  {
    id: 1,
    title: "Web Development ",
    price: "$9.99",
    oldPrice: "$99.99",
    rating: 4.7,
    students: "120k",
    img: "https://img-c.udemycdn.com/course/480x270/1565838_e54e_18.jpg",
    tag: "🔥 Hot Deal",
  },
  {
    id: 4,
    title: "Python for Data Science",
    price: "$10.99",
    oldPrice: "$109.99",
    rating: 4.8,
    students: "200k",
    img: "https://img-c.udemycdn.com/course/480x270/543600_64d1_4.jpg",
    tag: "🔥 Trending",
  },
  {
    id: 5,
    title: "Machine Learning A-Z",
    price: "$11.99",
    oldPrice: "$129.99",
    rating: 4.7,
    students: "180k",
    img: "https://img-c.udemycdn.com/course/480x270/950390_270f_3.jpg",
    tag: "⭐ Bestseller",
  },
  {
    id: 6,
    title: "Digital Marketing 2025",
    price: "$9.49",
    oldPrice: "$89.99",
    rating: 4.6,
    students: "95k",
    img: "https://img-c.udemycdn.com/course/480x270/914296_3670_8.jpg",
    tag: "✨ New",
  },
  {
    id: 7,
    title: "React - The Complete Guide",
    price: "$12.49",
    oldPrice: "$149.99",
    rating: 4.8,
    students: "300k",
    img: "https://img-c.udemycdn.com/course/480x270/1362070_b9a1_2.jpg",
    tag: "🔥 Hot",
  },
  {
    id: 8,
    title: "AWS Certified Solutions Architect",
    price: "$14.99",
    oldPrice: "$169.99",
    rating: 4.7,
    students: "220k",
    img: "https://img-c.udemycdn.com/course/480x270/2196488_8fc7_10.jpg",
    tag: "⭐ Bestseller",
  },
  {
    id: 9,
    title: "Excel from Beginner to Advanced",
    price: "$8.49",
    oldPrice: "$79.99",
    rating: 4.6,
    students: "500k",
    img: "https://img-c.udemycdn.com/course/480x270/793796_0e89_2.jpg",
    tag: "💼 Career Boost",
  },
  {
    id: 10,
    title: "Cyber Security Masterclass",
    price: "$13.99",
    oldPrice: "$139.99",
    rating: 4.7,
    students: "110k",
    img: "https://img-c.udemycdn.com/course/480x270/1565838_e54e_11.jpg",
    tag: "🔐 Secure Future",
  },
];

// Map dummyCourses to deal format with automatic tags
const courseDeals = dummyCourses.map((course, index) => {
  const oldPrice = (course.coursePrice / (1 - course.discount / 100)).toFixed(2);

  // Calculate average rating
  const avgRating =
    course.courseRatings.length > 0
      ? course.courseRatings.reduce((acc, r) => acc + r.rating, 0) / course.courseRatings.length
      : 4.5; // default rating

  // Determine tag
  let tag = "🔥 Trending";
  const createdDate = new Date(course.createdAt);
  const now = new Date();
  const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);

  if (course.discount >= 25) tag = "🔥 Hot Deal";
  else if (avgRating >= 4.7 && course.enrolledStudents.length >= 100) tag = "⭐ Bestseller";
  else if (daysDiff <= 30) tag = "✨ New";

  return {
    id: course._id || `course-${index}`,
    title: course.courseTitle,
    price: `$${course.coursePrice}`,
    oldPrice: `$${oldPrice}`,
    rating: avgRating.toFixed(1),
    students: course.enrolledStudents.length + " students",
    img: course.courseThumbnail,
    tag,
  };
});

// Merge previous deals with dummy courses
const allDeals = [...deals, ...courseDeals];

const Deals = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Today's Special Deals for You 🎉
        </h1>
        <p className="text-gray-500 mt-3 text-lg">
          Explore our best-selling, trending, and new courses at unbeatable prices
        </p>
      </div>

      {/* Deals Grid */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {allDeals.map((deal) => (
          <div
            key={deal.id}
            className="bg-white border rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden group flex flex-col"
          >
            {/* Image with Tag */}
            <div className="relative h-48 flex-shrink-0">
              <img
                src={deal.img}
                alt={deal.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                {deal.tag}
              </span>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <h2 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition mb-2">
                {deal.title}
              </h2>

              {/* Ratings & Students */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Star className="text-yellow-500 w-4 h-4 fill-yellow-500" />
                <span>{deal.rating}</span>
                <span>({deal.students})</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mt-auto">
                <span className="text-indigo-600 font-bold text-lg">{deal.price}</span>
                <span className="line-through text-gray-400">{deal.oldPrice}</span>
              </div>

              {/* CTA Button */}
              <button className="mt-5 w-fit mx-auto bg-gray-10 text-blue-600 py-2.5 rounded-lg font-medium hover:bg-indigo-100 transition">
  Enroll Now
</button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deals;
