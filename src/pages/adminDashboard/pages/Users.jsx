import React, { useEffect, useState } from "react";
import api from "../../../../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:ml-56">
      <h2 className="text-xl font-bold font-ubuntu mb-6">
        Total Users: {users.length}
      </h2>

      <div className="overflow-x-auto bg-white shadow rounded-md font-ubuntu">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-black text-center">
            <tr>
              <th className="px-4 py-2 border text-white text-[16px]">Sr.</th>
              <th className="px-4 py-2 border text-white text-[16px]">Name</th>
              <th className="px-4 py-2 border text-white text-[16px]">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}

            {users.map((user, index) => (
              <tr key={index} className="text-center hover:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
