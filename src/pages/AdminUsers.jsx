import { useEffect, useState } from "react";
import Table from "../components/Table";
import UserModal from "../components/UserModal";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  addUser
} from "../api/auth";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [modalUser, setModalUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const headers = ["Name", "Email", "Role", "Actions"];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      const data = Array.isArray(res.data) ? res.data : [];
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    }
  };

  const handleEdit = (user) => {
    setModalUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (formData._id) {
        await updateUser(formData._id, formData);
      } else {
        await addUser(formData);
      }
      setShowModal(false);
      setModalUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const rows = Array.isArray(users)
    ? users.map((user) => [
        <span
          onClick={() => handleEdit(user)}
          className="cursor-pointer text-indigo-600 underline"
        >
          {user.name}
        </span>,
        user.email,
        user.role,
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(user)}
            className="text-sm text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(user._id)}
            className="text-sm text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>,
      ])
    : [];

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <button
          onClick={() => {
            setModalUser(null);
            setShowModal(true);
          }}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </div>

      <Table headers={headers} rows={rows} />

      {showModal && (
        <UserModal
          user={modalUser}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          fields={["name", "email", "role", "password"]}
          labels={{
            name: "Full Name",
            email: "Email Address",
            role: "Role",
            password: "Password",
          }}
        />
      )}
    </div>
  );
};

export default AdminUsers;
