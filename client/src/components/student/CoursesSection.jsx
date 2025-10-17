import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <section className="py-20 md:px-40 px-8 w-full bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Our Courses
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our top-rated courses across various categories. From coding
            and design to business and wellness, our courses are crafted to
            deliver results.
          </p>
        </div>

        {/* Popular Categories Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Development Category */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-left">Development</h3>
              <div className="space-y-3">
                <Link to="/courses/python" className="flex justify-between items-center text-purple-600 hover:text-purple-700 text-left">
                  <span className="font-semibold">Python</span>
                  <span className="text-sm text-gray-500">49,443,004 learners</span>
                </Link>
                <Link to="/courses/web-development" className="flex justify-between items-center text-purple-600 hover:text-purple-700 text-left">
                  <span className="font-semibold">Web Development</span>
                  <span className="text-sm text-gray-500">14,323,155 learners</span>
                </Link>
                <Link to="/courses/data-science" className="flex justify-between items-center text-purple-600 hover:text-purple-700 text-left">
                  <span className="font-semibold">Data Science</span>
                  <span className="text-sm text-gray-500">8,151,734 learners</span>
                </Link>
              </div>
            </div>

            {/* Design Category */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-left">Design</h3>
              <div className="space-y-3">
                <Link to="/courses/blender" className="flex justify-between items-center text-purple-600 hover:text-purple-700 text-left">
                  <span className="font-semibold">Blender</span>
                  <span className="text-sm text-gray-500">3,051,243 learners</span>
                </Link>
                <Link to="/courses/graphic-design" className="flex justify-between items-center text-purple-600 hover:text-purple-700 text-left">
                  <span className="font-semibold">Graphic Design</span>
                  <span className="text-sm text-gray-500">4,630,706 learners</span>
                </Link>
                <Link to="/courses/ux-design" className="flex justify-between items-center text-purple-600 hover:text-purple-700 text-left">
                  <span className="font-semibold">User Experience (UX) Design</span>
                  <span className="text-sm text-gray-500">2,123,523 learners</span>
                </Link>
              </div>
            </div>

            {/* Business Category */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-left">Business</h3>
              <div className="space-y-3">
                <Link to="/courses/pmp" className="flex justify-between items-center text-purple-600 hover:text-purple-700 text-left">
                  <span className="font-semibold">PMI Project Management Professional (PMP)</span>
                  <span className="text-sm text-gray-500">2,759,698 learners</span>
                </Link>
                <Link to="/courses/power-bi" className="flex justify-between items-center text-purple-600 hover:text-purple-700 text-left">
                  <span className="font-semibold">Microsoft Power BI</span>
                  <span className="text-sm text-gray-500">4,987,393 learners</span>
                </Link>
                <Link to="/courses/capm" className="flex justify-between items-center text-purple-600 hover:text-purple-700 text-left">
                  <span className="font-semibold">PMI Certified Associate in Project Management (CAPM)</span>
                  <span className="text-sm text-gray-500">463,187 learners</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="md:my-16 my-10">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="courses-swiper pb-12"
          >
            {allCourses.map((course, index) => (
              <SwiperSlide key={index}>
                <CourseCard course={course} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="text-center mt-12">
          <Link
            to={"/course-list"}
            onClick={() => scrollTo(0, 0)}
            className="inline-block text-white bg-gray-800 hover:bg-gray-900 px-12 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Show All Courses
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
