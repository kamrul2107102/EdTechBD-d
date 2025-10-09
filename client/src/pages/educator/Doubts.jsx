import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Doubts = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [filterResolved, setFilterResolved] = useState("all"); // all, resolved, unresolved

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      console.log("Fetching doubts from:", `${backendUrl}/api/educator/doubts`);
      const { data } = await axios.get(`${backendUrl}/api/educator/doubts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Doubts response:", data);
      if (data.success) {
        setDoubts(data.doubts || []);
        console.log("Doubts set:", data.doubts);
        if (!data.doubts || data.doubts.length === 0) {
          console.log("No doubts found for this educator");
        }
      } else {
        console.error("Error response:", data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Fetch doubts error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (doubtId) => {
    const message = replyText[doubtId];
    if (!message?.trim()) return toast.error("Please enter a reply");

    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/doubt/reply`,
        { doubtId, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Reply added");
        setReplyText({ ...replyText, [doubtId]: "" });
        fetchDoubts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredDoubts = doubts.filter((doubt) => {
    if (filterResolved === "resolved") return doubt.isResolved;
    if (filterResolved === "unresolved") return !doubt.isResolved;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading doubts...</div>
      </div>
    );
  }

  console.log("Current doubts state:", doubts);
  console.log("Filtered doubts:", filteredDoubts);

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Student Doubts</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterResolved("all")}
              className={`px-4 py-2 rounded-md transition ${
                filterResolved === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              All ({doubts.length})
            </button>
            <button
              onClick={() => setFilterResolved("unresolved")}
              className={`px-4 py-2 rounded-md transition ${
                filterResolved === "unresolved"
                  ? "bg-orange-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Unresolved ({doubts.filter((d) => !d.isResolved).length})
            </button>
            <button
              onClick={() => setFilterResolved("resolved")}
              className={`px-4 py-2 rounded-md transition ${
                filterResolved === "resolved"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Resolved ({doubts.filter((d) => d.isResolved).length})
            </button>
          </div>
        </div>

        {/* Doubts List */}
        {filteredDoubts.length === 0 ? (
          <div className="bg-white p-10 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">
              {doubts.length === 0
                ? "No doubts have been submitted yet. Students can ask questions from the course player page."
                : `No ${filterResolved} doubts found`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDoubts.map((doubt) => (
              <div key={doubt._id} className="bg-white p-6 rounded-lg shadow-md">
                {/* Course Tag */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                    {doubt.courseId?.courseTitle || "Unknown Course"}
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <img
                    src={doubt.userId?.imageUrl || assets.placeholder_image}
                    alt={doubt.userId?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {doubt.userId?.name || "Student"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {new Date(doubt.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {doubt.isResolved && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          ✓ Resolved
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 mb-3">{doubt.question}</p>

                    {/* Attachments */}
                    {doubt.attachments && doubt.attachments.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {doubt.attachments.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={url}
                              alt={`Attachment ${idx + 1}`}
                              className="w-32 h-32 object-cover rounded-md border border-gray-300 hover:opacity-90 transition cursor-pointer"
                            />
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Replies */}
                    {doubt.replies && doubt.replies.length > 0 && (
                      <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200">
                        {doubt.replies.map((reply, idx) => (
                          <div key={idx} className="flex gap-3 bg-gray-50 p-3 rounded">
                            <img
                              src={reply.userId?.imageUrl || assets.placeholder_image}
                              alt={reply.userId?.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-gray-800">
                                {reply.userId?.name || "User"}
                              </p>
                              <p className="text-gray-700 text-sm">{reply.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(reply.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Form */}
                    {!doubt.isResolved && (
                      <div className="mt-4 flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyText[doubt._id] || ""}
                          onChange={(e) =>
                            setReplyText({ ...replyText, [doubt._id]: e.target.value })
                          }
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleReply(doubt._id);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleReply(doubt._id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          Reply
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doubts;
