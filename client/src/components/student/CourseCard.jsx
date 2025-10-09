// import React, { useContext } from "react";
// import { assets } from "../../assets/assets";
// import { AppContext } from "../../context/AppContext";
// import { Link } from "react-router-dom";

// const CourseCard = ({ course }) => {
//   const { currency, calculateRating } = useContext(AppContext);

//   // Safe rating
//   const rating = calculateRating(course) || 0;
//   const totalRatings = course.courseRatings?.length || 0;

//   return (
//     <Link
//       to={"/course/" + course._id}
//       onClick={() => scrollTo(0, 0)}
//       className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg flex flex-col h-full"
//     >
//       <img
//         className="w-full h- object-cover"
//         src={course.courseThumbnail || assets.placeholder} // fallback image
//         alt="courseThumbnail"
//       />
//       <div className="p-3 text-left flex flex-col flex-grow">
//         <h3 className="text-base font-semibold line-clamp-2 min-h-[3rem]">{course.courseTitle}</h3>

//         {/* Optional chaining for educator name */}
//         <p className="text-gray-500 text-sm mb-2 line-clamp-1">{course.educator?.name || course.educator || "Unknown Educator"}</p>

//         <div className="flex items-center space-x-2 mb-2">
//           <p>{rating}</p>
//           <div className="flex">
//             {[...Array(5)].map((_, i) => (
//               <img
//                 key={i}
//                 src={i < Math.floor(rating) ? assets.star : assets.star_blank}
//                 alt="star"
//                 className="w-3.5 h-3.5"
//               />
//             ))}
//           </div>
//           <p className="text-gray-500">{totalRatings}</p>
//         </div>

//         <p className="text-base font-semibold text-gray-800 mt-auto">
//           {currency}
//           {(
//             course.coursePrice -
//             (course.discount * course.coursePrice) / 100
//           ).toFixed(2)}
//         </p>
//       </div>
//     </Link>
//   );
// };

// export default CourseCard;
import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  // Safe rating
  const rating = calculateRating(course) || 0;
  const totalRatings = course.courseRatings?.length || 0;

  return (
    <Link
      to={"/course/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="border border-gray-300 hover:shadow-md rounded-lg overflow-hidden flex flex-col h-full transition-shadow duration-300 bg-white"
    >
      {/* 🖼️ Course Thumbnail (fixed width & height like Udemy) */}
      <div className="relative w-full aspect-[15/6] bg-gray-100">
        <img
          src={course.courseThumbnail || assets.placeholder}
          alt="courseThumbnail"
          className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
        />
      </div>

      {/* 📘 Course Info */}
      <div className="p-3 text-left flex flex-col flex-grow">
        <h3 className="text-base font-semibold line-clamp-2 min-h-[3rem] hover:text-blue-600 transition-colors">
          {course.courseTitle}
        </h3>

        <p className="text-gray-500 text-sm mb-2 line-clamp-1">
          {course.educator?.name || course.educator || "Unknown Educator"}
        </p>

        <div className="flex items-center space-x-2 mb-2">
          <p className="text-sm font-medium">{rating}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                alt="star"
                className="w-3.5 h-3.5"
              />
            ))}
          </div>
          <p className="text-gray-500 text-sm">({totalRatings})</p>
        </div>

        <p className="text-base font-semibold text-gray-800 mt-auto">
          {currency}
          {(
            course.coursePrice -
            (course.discount * course.coursePrice) / 100
          ).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
