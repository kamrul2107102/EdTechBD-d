import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Code, Award } from "lucide-react";

const blogs = [
  {
    id: 1,
    title: "React Native 0.72-0.76: Lessons from the Trenches",
    desc: "Key insights and lessons learned from working with React Native 0.72 to 0.76 in production apps.",
    category: "React Native",
    img: "https://miro.medium.com/v2/resize:fit:720/format:webp/0*YZmCV5XHm8VleSjM", // add your image
    link: "https://medium.com/@abijith.b/react-native-0-72-0-76-lessons-from-the-trenches-0a548ba6b83f",
  },
  {
    id: 2,
    title: "Designing a State Manager for Performance",
    desc: "A deep dive into hierarchical reactivity for creating fast and efficient state management in React.",
    category: "React",
    img: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*A8eW027sQmTaHxK2nZtP1Q.png", // add your image
    link: "https://medium.com/itnext/designing-a-state-manager-for-performance-a-deep-dive-into-hierarchical-reactivity-013e70a97347",
  },
  {
    id: 3,
    title: "React 19 Broke Update Stability",
    desc: "How to maintain update stability and avoid developer frustration with React 19.",
    category: "React",
    img: "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*fZK5TVyqSmnEJlQc_O9IUQ.png", // add your image
    link: "https://medium.com/@drpicox/react-19-broke-update-stability-keeping-half-of-developers-stuck-8f6f152dd695",
  },
  {
    id: 4,
    title: "Why Every React Developer Must Master useEffect",
    desc: "A guide to mastering useEffect for React interviews and production-ready applications.",
    category: "React",
    img: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*GDaLP1HQ_X4cXLp8iTzNng.jpeg", // add your image
    link: "https://javascript.plainenglish.io/why-every-react-developer-must-master-useeffect-before-any-interview-97fe9cb425b0",
  },
  {
    id: 5,
    title: "React Jobs in 2025: Skills That Actually Get You Hired",
    desc: "The most in-demand React skills you should master to get hired in 2025.",
    category: "React",
    img: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*YpHRMHI7ugz1VLd-8_SHpQ.png", // add your image
    link: "https://javascript.plainenglish.io/react-jobs-in-2025-skills-that-actually-get-you-hired-ba891a62c855",
  },
  {
    id: 6,
    title: "7 Real-World Frontend Interview Scenarios",
    desc: "Must-know frontend interview scenarios for developers with 3+ years of experience.",
    category: "Frontend",
    img: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*32DRgKDgXlwlHPnpPNG_5g.png", // add your image
    link: "https://javascript.plainenglish.io/7-real-world-frontend-interview-scenarios-every-developer-must-master-3-years-exp-8e9d35ccccaa",
  },
  {
    id: 7,
    title: "Hidden GitHub Features Every Developer Should Use",
    desc: "Discover lesser-known GitHub features that can boost productivity and collaboration.",
    category: "GitHub",
    img: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*Hyz4DgsACOD8ZDLmC1RcQQ.png", // add your image
    link: "https://javascript.plainenglish.io/hidden-github-features-every-developer-should-use-in-2025-c4e35124fe37",
  },
  {
    id: 8,
    title: "Revolutionize Loading UX with React 18",
    desc: "Use React 18 Suspense, streaming, and selective hydration to improve UX.",
    category: "React",
    img: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*i3vYwT2hmEBTEkNSW5FNBg.png", // add your image
    link: "https://medium.com/javascript-in-plain-english/revolutionize-loading-ux-with-react-18-suspense-streaming-selective-hydration-d8aab5ab77c1",
  },
  {
    id: 9,
    title: "Best Squarespace Alternatives in 2025",
    desc: "Explore three powerful options to replace Squarespace for website building in 2025.",
    category: "Web Development",
    img: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*Idl4LhNpkOGc66DK-mZjVA.png", // add your image
    link: "https://javascript.plainenglish.io/the-best-squarespace-alternatives-in-2025-3-powerful-options-69583b95d0ee",
  },
  {
    id: 10,
    title: "React Interview Experience July 2025",
    desc: "Real-life React interview experiences at Capgemini, Publicis Sapient, Siemens, and more.",
    category: "React",
    img: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*s4ENur1lmY8pZEdixeQihw.png", // add your image
    link: "https://javascript.plainenglish.io/react-interview-experience-july-2025-capgemini-publicis-sapient-siemens-eed8f5bdce8a",
  },
];

const Blog = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Learn Section */}
      <div className="mb-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={32} />
                <h2 className="text-3xl md:text-4xl font-bold">Start Learning Today</h2>
              </div>
              <p className="text-blue-100 text-lg mb-6">
                Master programming from scratch with our interactive courses. Learn at your own pace with hands-on examples.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Code size={20} />
                  <span>Interactive Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={20} />
                  <span>Free to Start</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/learn")}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg hover:shadow-xl"
              >
                Explore Courses →
              </button>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">3+</div>
                  <div className="text-blue-100">Courses Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800">Latest Tutorials & Blogs 📝</h1>
        <p className="text-gray-500 mt-3 text-lg">
          Stay updated with trending tech tutorials, best practices, and career guides
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white border rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden group">
            <div className="relative">
              <img
                src={blog.img || "https://via.placeholder.com/480x270?text=Blog+Image"} 
                alt={blog.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
              />
              <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                {blog.category}
              </span>
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition">
                {blog.title}
              </h2>
              <p className="text-gray-600 mt-2 text-sm">{blog.desc}</p>
              <a
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-indigo-600 font-semibold hover:underline"
              >
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
