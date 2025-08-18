// --- IngredientForm.jsx ---
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBalanceScale, FaCalculator, FaLeaf } from "react-icons/fa";

const unitConversions = {
  // normalize to base units: kg for mass, lt for volume
  kg: 1,
  g: 0.001,
  lb: 0.453592,
  oz: 0.0283495,
  lt: 1,
  ml: 0.001,
  jug: 1.89, // approx 1 jug = 1.89 lt
  pcs: 1,
};

export function IngredientForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    unit: "kg",
    purchaseQuantity: "",
    originalPrice: "",
    kcal: "",
    yield: "",
    category: "",
    warehouse: "",
    standardWeight: "",
    supplier: "",
  });

  const [pricePerKg, setPricePerKg] = useState("0.00");
  const [errors, setErrors] = useState({});

  // derived: normalized quantity in base unit (kg or lt)
  const normalizedQty = useMemo(() => {
    const qty = parseFloat(form.purchaseQuantity);
    const factor = unitConversions[form.unit] ?? 1;
    if (Number.isFinite(qty) && qty > 0) return qty * factor;
    return 0;
  }, [form.purchaseQuantity, form.unit]);

  useEffect(() => {
    const price = parseFloat(form.originalPrice);
    const yieldVal = parseFloat(form.yield);
    if (normalizedQty > 0 && Number.isFinite(price) && Number.isFinite(yieldVal) && yieldVal > 0) {
      // price per base unit (kg or lt), adjusted for yield
      const basePrice = (price / normalizedQty) / (yieldVal / 100);
      setPricePerKg(basePrice.toFixed(4));
    } else {
      setPricePerKg("0.00");
    }
  }, [normalizedQty, form.originalPrice, form.yield]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const yieldVal = parseFloat(form.yield);
    const price = parseFloat(form.originalPrice);
    const quantity = parseFloat(form.purchaseQuantity);

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.unit) newErrors.unit = "Unit is required";
    if (!Number.isFinite(quantity) || quantity <= 0) newErrors.purchaseQuantity = "Quantity must be greater than 0";
    if (!Number.isFinite(price) || price < 0) newErrors.originalPrice = "Price must be 0 or greater";
    if (!Number.isFinite(yieldVal) || yieldVal <= 0 || yieldVal > 100)
      newErrors.yield = "Yield must be between 1 and 100";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalData = {
      name: form.name,
      purchaseUnit: form.unit,
      purchaseQuantity: parseFloat(form.purchaseQuantity),
      originalUnit: form.unit,
      originalPrice: parseFloat(form.originalPrice),
      pricePerKg: parseFloat(pricePerKg), // actually price per base unit (kg/lt)
      kcal: parseFloat(form.kcal),
      yield: parseFloat(form.yield),
      category: form.category,
      warehouse: form.warehouse,
      standardWeight: parseFloat(form.standardWeight),
      supplier: form.supplier,
    };

    onSubmit(finalData);

    setForm({
      name: "",
      unit: "kg",
      purchaseQuantity: "",
      originalPrice: "",
      kcal: "",
      yield: "",
      category: "",
      warehouse: "",
      standardWeight: "",
      supplier: "",
    });
    setPricePerKg("0.00");
    setErrors({});
  };

  const fieldCls = (err) =>
    `w-full px-3 py-2 rounded-xl border ${err ? "border-rose-400 ring-rose-200" : "border-gray-200"} focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 outline-none transition-all`;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 shadow-xl rounded-2xl p-6 mb-8 border border-gray-100 relative overflow-hidden"
    >
      {/* decorative */}
      <span className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-gradient-to-tr from-rose-200 to-pink-200 blur-2xl opacity-70" />

      <div className="flex items-center gap-3 mb-6">
        <div className="grid place-items-center h-10 w-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
          <FaLeaf />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Add New Ingredient</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-sm mb-1 text-gray-700">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Potato"
            className={fieldCls(errors.name)}
          />
          {errors.name && <p className="text-rose-600 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="text-sm mb-1 text-gray-700">Purchase Unit</label>
          <select name="unit" value={form.unit} onChange={handleChange} className={fieldCls(errors.unit)}>
            {Object.keys(unitConversions)
              .filter((u) => ["kg", "lt"].includes(u))
              .map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
          </select>
          {errors.unit && <p className="text-rose-600 text-xs mt-1">{errors.unit}</p>}
        </div>

        <div>
          <label className="text-sm mb-1 text-gray-700">Purchase Quantity</label>
          <input
            type="number"
            name="purchaseQuantity"
            value={form.purchaseQuantity}
            onChange={handleChange}
            placeholder="e.g. 5"
            className={fieldCls(errors.purchaseQuantity)}
          />
          {errors.purchaseQuantity && <p className="text-rose-600 text-xs mt-1">{errors.purchaseQuantity}</p>}
        </div>

        <div>
          <label className="text-sm mb-1 text-gray-700">Total Purchase Price</label>
          <input
            type="number"
            name="originalPrice"
            value={form.originalPrice}
            onChange={handleChange}
            placeholder="e.g. 20.00"
            className={fieldCls(errors.originalPrice)}
          />
          {errors.originalPrice && <p className="text-rose-600 text-xs mt-1">{errors.originalPrice}</p>}
        </div>

        <div>
          <label className="text-sm mb-1 text-gray-700">Supplier</label>
          <input
            name="supplier"
            value={form.supplier}
            onChange={handleChange}
            placeholder="e.g. FreshFarms Ltd."
            className={fieldCls()}
          />
        </div>

        <div>
          <label className="text-sm mb-1 text-gray-700">Yield (%)</label>
          <input
            type="number"
            name="yield"
            value={form.yield}
            onChange={handleChange}
            placeholder="e.g. 85"
            className={fieldCls(errors.yield)}
          />
          {errors.yield && <p className="text-rose-600 text-xs mt-1">{errors.yield}</p>}
        </div>

        <div>
          <label className="text-sm mb-1 text-gray-700">KCAL / 1000g</label>
          <input name="kcal" type="number" value={form.kcal} onChange={handleChange} placeholder="e.g. 770" className={fieldCls()} />
        </div>

        <div>
          <label className="text-sm mb-1 text-gray-700">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className={fieldCls()}>
            {[
              "Proteins",
              "Vegetables",
              "Fruits",
              "Grains and Flours",
              "Oils and Sauces",
              "Liquors",
              "Soft Drinks",
              "Condiments",
            ].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm mb-1 text-gray-700">Warehouse</label>
          <select name="warehouse" value={form.warehouse} onChange={handleChange} className={fieldCls()}>
            {["Refrigeration", "Freezing", "Dry"].map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm mb-1 text-gray-700">Standard Weight (kg)</label>
          <input
            type="number"
            name="standardWeight"
            value={form.standardWeight}
            onChange={handleChange}
            placeholder="e.g. 1"
            className={fieldCls()}
          />
        </div>

        {/* Price Per Kg (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Calculated Price per Base Unit</label>
          <div className="flex items-center gap-2">
            <div className="grid place-items-center h-9 w-9 rounded-lg bg-gray-100 text-gray-500 border border-gray-200">
              <FaCalculator />
            </div>
            <input
              type="text"
              value={pricePerKg}
              readOnly
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-800"
            />
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Base unit is kg for mass and lt for volume. Adjusted for yield.</p>
        </div>
      </div>

      <div className="mt-6 text-right">
        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-2 rounded-xl hover:bg-rose-700 shadow focus:outline-none focus:ring-4 focus:ring-rose-200/60"
        >
          <FaBalanceScale /> Add Ingredient
        </motion.button>
      </div>
    </motion.form>
  );
}