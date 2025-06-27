import { useState, useEffect } from "react";

const UserModal = ({ user, onClose, onSave, fields, labels }) => {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (user) {
      setForm(user);
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg space-y-4">
        <h2 className="text-xl font-bold">{form?._id ? "Edit" : "Add"} User</h2>

        {/* Standard Fields */}
        {fields.map((field) => (
          <input
            key={field}
            name={field}
            type={field === "password" ? "password" : "text"}
            value={form[field] || ""}
            onChange={handleChange}
            placeholder={labels?.[field] || field}
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
        ))}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="text-gray-500 hover:underline">Cancel</button>
          <button onClick={handleSubmit} className="bg-red-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
