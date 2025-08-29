// src/components/EditModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditModal({
  isOpen,
  onClose,
  onSave,
  title = "Edit",
  initialValues = {},
  fields = [],
  saveLabel = "Save",
  cancelLabel = "Cancel",
  ingredientMap = {},
}) {
  const [form, setForm] = useState({});
  const initialValuesRef = useRef(initialValues);
  const isOpenRef = useRef(isOpen);

  // Update ref when initialValues changes
  useEffect(() => {
    initialValuesRef.current = initialValues;
  }, [initialValues]);

  // Update ref when isOpen changes
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Initialize form only when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log("EditModal useEffect - initializing form", initialValuesRef.current);
      setForm({ ...initialValuesRef.current });
    }
  }, [isOpen]); // Only depend on isOpen

  const setField = (name, value) => {
    console.log("setField called", { name, value, currentForm: form });
    
    const nextForm = { ...form, [name]: value };
    
    // If ingredient is selected and exists in our map, auto-fill fields
    if (name === "ingredientId" && value && ingredientMap[value]) {
      console.log("Ingredient selected, attempting auto-fill", { value, ingredient: ingredientMap[value] });
      const ingredient = ingredientMap[value];
      
      // Only auto-fill if fields are empty or haven't been modified
      if (!nextForm.item || nextForm.item.trim() === "") {
        nextForm.item = ingredient.name || "";
        console.log("Auto-filled item field", nextForm.item);
      }
      
      if (!nextForm.unit || nextForm.unit.trim() === "") {
        nextForm.unit = ingredient.originalUnit || ingredient.unit || "";
        console.log("Auto-filled unit field", nextForm.unit);
      }
      
      if ((!nextForm.supplier || nextForm.supplier.trim() === "") && ingredient.supplier) {
        nextForm.supplier = ingredient.supplier;
        console.log("Auto-filled supplier field", nextForm.supplier);
      }
    }
    
    console.log("Setting form to", nextForm);
    setForm(nextForm);
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    console.log("Form submitted", form);
    const normalized = { ...form };
    fields.forEach((f) => {
      if (f.type === "number" && normalized[f.name] !== undefined && normalized[f.name] !== "") {
        const n = Number(normalized[f.name]);
        normalized[f.name] = Number.isNaN(n) ? normalized[f.name] : n;
      }
    });
    
    // Check if we're adding a new item or editing existing
    if (form._id) {
      // Editing existing - extract the item fields for the items array
      const itemData = {
        item: form.item,
        quantity: form.quantity,
        unit: form.unit,
        supplier: form.supplier,
        ingredientId: form.ingredientId,
      };
      
      onSave?.({
        ...form,
        items: [itemData]
      });
    } else {
      // Adding new - create the full payload
      onSave?.({
        ...normalized,
        items: [{
          item: normalized.item,
          quantity: normalized.quantity,
          unit: normalized.unit,
          supplier: normalized.supplier,
          ingredientId: normalized.ingredientId,
        }]
      });
    }
    
    onClose?.();
  };

  const renderField = (f) => {
    const value = form[f.name] ?? "";
    const common =
      "w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none";

    if (f.type === "select") {
      return (
        <label key={f.name} className="text-sm">
          <span className="mb-1 block font-medium text-gray-700">{f.label}</span>
          <select
            value={value}
            onChange={(e) => {
              console.log(`Select field ${f.name} changed to:`, e.target.value);
              setField(f.name, e.target.value);
            }}
            className={common}
          >
            {(f.options || []).map((opt, i) =>
              typeof opt === "string" ? (
                <option key={`${f.name}-${i}`} value={opt}>
                  {opt}
                </option>
              ) : (
                <option key={`${f.name}-${opt.value}-${i}`} value={opt.value}>
                  {opt.label}
                </option>
              )
            )}
          </select>
          {f.help && <p className="text-xs text-gray-500 mt-1">{f.help}</p>}
        </label>
      );
    }

    if (f.type === "textarea") {
      return (
        <label key={f.name} className="text-sm">
          <span className="mb-1 block font-medium text-gray-700">{f.label}</span>
          <textarea
            rows={f.rows || 4}
            value={value}
            onChange={(e) => {
              console.log(`Textarea field ${f.name} changed to:`, e.target.value);
              setField(f.name, e.target.value);
            }}
            className={common}
            placeholder={f.placeholder}
          />
          {f.help && <p className="text-xs text-gray-500 mt-1">{f.help}</p>}
        </label>
      );
    }

    return (
      <label key={f.name} className="text-sm">
        <span className="mb-1 block font-medium text-gray-700">{f.label}</span>
        <input
          type={f.type || "text"}
          value={value}
          onChange={(e) => {
            console.log(`Input field ${f.name} changed to:`, e.target.value);
            setField(f.name, e.target.value);
          }}
          className={common}
          placeholder={f.placeholder}
          step={f.type === "number" ? (f.step ?? "any") : undefined}
        />
        {f.help && <p className="text-xs text-gray-500 mt-1">{f.help}</p>}
      </label>
    );
  };

  console.log("EditModal rendering with form state:", form);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            console.log("Modal background clicked, closing");
            onClose();
          }}
        >
          <motion.div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-rose-100 overflow-hidden"
            initial={{ y: 16, opacity: 0.98 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0.98 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => {
              console.log("Modal content clicked, preventing close");
              e.stopPropagation();
            }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="px-5 py-4 border-b bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{title}</h3>
                <button
                  type="button"
                  onClick={() => {
                    console.log("Close button clicked");
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25"
                >
                  Close
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(renderField)}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    console.log("Cancel button clicked");
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {cancelLabel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold shadow hover:bg-rose-700"
                >
                  {saveLabel}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}