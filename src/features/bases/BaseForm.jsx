import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSave, FaMapMarkerAlt, FaHashtag, FaUser, FaStickyNote } from "react-icons/fa";

export default function BaseForm({ onSubmit, initialValues }) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    location: "",
    contact: "",
    notes: "",
  });

  useEffect(() => {
    if (initialValues) {
      const { name, code, location, contact, notes } = initialValues;
      setForm({ name: name || "", code: code || "", location: location || "", contact: contact || "", notes: notes || "" });
    } else {
      setForm({ name: "", code: "", location: "", contact: "", notes: "" });
    }
  }, [initialValues]);

  const handleChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Base name is required");
      return;
    }
    onSubmit(form);
  };

  return (
    <motion.form
      onSubmit={submit}
      className="relative overflow-hidden rounded-2xl bg-white/90 shadow border border-rose-100 p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm">
          <span className="mb-1 flex items-center gap-2 text-gray-700"><FaMapMarkerAlt /> Base Name *</span>
          <input
            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Camp Alpha"
            required
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 flex items-center gap-2 text-gray-700"><FaHashtag /> Code</span>
          <input
            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
            value={form.code}
            onChange={(e) => handleChange("code", e.target.value)}
            placeholder="e.g. ALP"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 flex items-center gap-2 text-gray-700"><FaMapMarkerAlt /> Location</span>
          <input
            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="City / Coordinates"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 flex items-center gap-2 text-gray-700"><FaUser /> Contact</span>
          <input
            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
            value={form.contact}
            onChange={(e) => handleChange("contact", e.target.value)}
            placeholder="Name/Phone/Email"
          />
        </label>

        <label className="text-sm md:col-span-2">
          <span className="mb-1 flex items-center gap-2 text-gray-700"><FaStickyNote /> Notes</span>
          <textarea
            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none"
            rows={3}
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Operational notes, access rules, etc."
          />
        </label>
      </div>

      <div className="mt-4 flex justify-end">
        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-200/60"
        >
          <FaSave /> {initialValues ? "Update Base" : "Add Base"}
        </motion.button>
      </div>
    </motion.form>
  );
}
