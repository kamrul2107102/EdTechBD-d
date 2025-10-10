import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import UserTable from "../../components/admin/UserTable";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const [users, setUsers] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setUsers(data.users);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const token = await getToken();
      const { data } = await axios.delete(`${backendUrl}/api/admin/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("User deleted!");
        fetchUsers();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!users) return <Loading />;

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Users</h2>
      <UserTable users={users} handleDeleteUser={handleDeleteUser} />
    </div>
  );
};

export default ManageUsers;
