import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { InputField, SelectField } from '../../components/FormFields';

const unitConversions = {
  kg: 1,
  g: 0.001,
  lb: 0.453592,
  oz: 0.0283495,
  lt: 1,
  ml: 0.001,
  jug: 1.89,
  pcs: 1,
};

export default function IngredientForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    unit: 'kg',
    purchaseQuantity: '',
    originalPrice: '',
    kcal: '',
    yield: '',
    category: '',
    warehouse: '',
    standardWeight: '',
    supplier: '', // 👈 new
  });


  const [pricePerKg, setPricePerKg] = useState('0.00');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const quantity = parseFloat(form.purchaseQuantity);
    const price = parseFloat(form.originalPrice);
    const yieldVal = parseFloat(form.yield);

    if (!isNaN(quantity) && !isNaN(price) && !isNaN(yieldVal) && yieldVal > 0) {
      const converted = (price / quantity) / (yieldVal / 100);
      setPricePerKg(converted.toFixed(4));
    } else {
      setPricePerKg('0.00');
    }
  }, [form.purchaseQuantity, form.originalPrice, form.yield]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const yieldVal = parseFloat(form.yield);
    const price = parseFloat(form.originalPrice);
    const quantity = parseFloat(form.purchaseQuantity);

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (isNaN(yieldVal) || yieldVal <= 0 || yieldVal > 100)
      newErrors.yield = 'Yield must be between 1 and 100';
    if (isNaN(price) || price < 0)
      newErrors.originalPrice = 'Price must be 0 or greater';
    if (isNaN(quantity) || quantity <= 0)
      newErrors.purchaseQuantity = 'Quantity must be greater than 0';

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
      pricePerKg: parseFloat(pricePerKg),
      kcal: parseFloat(form.kcal),
      yield: parseFloat(form.yield),
      category: form.category,
      warehouse: form.warehouse,
      standardWeight: parseFloat(form.standardWeight),
      supplier: form.supplier, // 👈 added
    };


    onSubmit(finalData);

    setForm({
      name: '',
      unit: 'kg',
      purchaseQuantity: '',
      originalPrice: '',
      kcal: '',
      yield: '',
      category: '',
      warehouse: '',
      standardWeight: '',
    });
    setPricePerKg('0.00');
    setErrors({});
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-800">Add New Ingredient</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Potato"
          error={errors.name}
        />

        <SelectField
          label="Purchase Unit"
          name="unit"
          value={form.unit}
          onChange={handleChange}
          options={['kg', 'lt']}
        />

        <InputField
          label="Purchase Quantity"
          name="purchaseQuantity"
          type="number"
          value={form.purchaseQuantity}
          onChange={handleChange}
          placeholder="e.g. 5"
          tooltip="Total quantity purchased in the selected unit"
          error={errors.purchaseQuantity}
        />

        <InputField
          label="Total Purchase Price"
          name="originalPrice"
          type="number"
          value={form.originalPrice}
          onChange={handleChange}
          placeholder="e.g. 20.00"
          tooltip="Total price for the entered quantity"
          error={errors.originalPrice}
        />
        <InputField
          label="Supplier"
          name="supplier"
          value={form.supplier}
          onChange={handleChange}
          placeholder="e.g. FreshFarms Ltd."
        />

        <InputField
          label="Yield (%)"
          name="yield"
          type="number"
          value={form.yield}
          onChange={handleChange}
          placeholder="e.g. 85"
          tooltip="Usable portion after cleaning/preparation (between 1–100)"
          error={errors.yield}
        />

        <InputField
          label="KCAL / 1000g"
          name="kcal"
          type="number"
          value={form.kcal}
          onChange={handleChange}
          placeholder="e.g. 770"
        />

        <SelectField
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          options={['Proteins', 'Vegetables', 'Fruits', 'Grains and Flours', 'Oils and Sauces', 'Liquors', 'Soft Drinks', 'Condiments']}
        />

        <SelectField
          label="Warehouse"
          name="warehouse"
          value={form.warehouse}
          onChange={handleChange}
          options={['Refrigeration', 'Freezing', 'Dry']}
        />

        <InputField
          label="Standard Weight (kg)"
          name="standardWeight"
          type="number"
          value={form.standardWeight}
          onChange={handleChange}
          placeholder="e.g. 1"
        />

        {/* Price Per Kg (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Calculated Price per Kg</label>
          <input
            type="text"
            value={pricePerKg}
            readOnly
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Add Ingredient
        </button>
      </div>
    </motion.form>
  );
}
