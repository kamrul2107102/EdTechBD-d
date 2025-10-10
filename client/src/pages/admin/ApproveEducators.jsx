import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import EducatorTable from "../../components/admin/EducatorTable";
import { toast } from "react-toastify";

const ApproveEducators = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const [educators, setEducators] = useState(null);

  const fetchPendingEducators = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/admin/pending-educators`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setEducators(data.educators);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleApproveEducator = async (id) => {
    try {
      const token = await getToken();
      const { data } = await axios.patch(
        `${backendUrl}/api/admin/approve-educator/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Educator approved!");
        fetchPendingEducators();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this educator?")) return;
    try {
      const token = await getToken();
      const { data } = await axios.delete(`${backendUrl}/api/admin/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Educator deleted!");
        fetchPendingEducators();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPendingEducators();
  }, []);

  if (!educators) return <Loading />;

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Approve Educators</h2>
      <EducatorTable
        educators={educators}
        handleApproveEducator={handleApproveEducator}
        handleDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default ApproveEducators;
