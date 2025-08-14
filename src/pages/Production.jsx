import React, { useState, useEffect } from 'react';
import ProductionForm from '../features/production/ProductionForm';
import ProductionTable from '../features/production/ProductionTable';
import { FaFilePdf } from 'react-icons/fa';
import { exportProductionToPDF } from '../components/exportRecipesToPDF';
import { useIngredients } from '../contexts/IngredientContext';
import { useRecipes } from '../contexts/RecipeContext';
import { useProductions } from '../contexts/ProductionContext';

export default function Production({ bases = [] }) {
  const { productions, addProduction, updateOne, deleteOne, fetchProductions } = useProductions();
  const { deductStock } = useIngredients();
  const { recipes, getIngredientsForRecipe } = useRecipes();

  const [editIndex, setEditIndex] = useState(null);
  const [filters, setFilters] = useState({ recipe: 'all', base: 'all', date: '' });

  const recipesMap = Object.fromEntries(recipes.map(r => [r._id || r.id, r]));

  const handleSubmit = async (entry) => {
    const qty = Number(entry.quantity || 0);
    const ingredientsUsed = getIngredientsForRecipe(entry.recipeId);

    if (ingredientsUsed && qty > 0) {
      ingredientsUsed.forEach(({ ingredientId, qtyPerUnit }) => {
        const totalQty = qtyPerUnit * qty;
        deductStock(ingredientId, totalQty);
      });
    }

    if (editIndex !== null) {
      const target = productions[editIndex];
      await updateOne(target._id, entry);
      setEditIndex(null);
    } else {
      await addProduction(entry);
    }
  };

  const handleEdit = (index) => setEditIndex(index);
  const handleDelete = async (index) => {
    const target = productions[index];
    await deleteOne(target._id);
  };

  useEffect(() => {
    const f = {};
    if (filters.recipe !== 'all') f.recipe = filters.recipe;
    if (filters.base !== 'all') f.base = filters.base;
    if (filters.date) f.date = filters.date;
    fetchProductions(f);
  }, [filters]);


  const filteredLogs = logs.filter(log =>
    (filters.recipe === 'all' || log.recipeId === filters.recipe) &&
    (filters.base === 'all' || log.base === filters.base) &&
    (!filters.date || log.date === filters.date)
  );

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <select
            value={filters.recipe}
            onChange={(e) => setFilters({ ...filters, recipe: e.target.value })}
            className="px-3 py-1 text-sm border border-gray-300 rounded"
          >
            <option value="all">All Recipes</option>
            {recipes.map((r) => (
              <option key={r._id || r.id} value={r._id || r.id}>{r.name}</option>
            ))}
          </select>

          <select
            value={filters.base}
            onChange={(e) => setFilters({ ...filters, base: e.target.value })}
            className="px-3 py-1 text-sm border border-gray-300 rounded"
          >
            <option value="all">All Bases</option>
            {bases.map((b, i) => (
              <option key={i} value={b}>{b}</option>
            ))}
          </select>

          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="px-3 py-1 text-sm border border-gray-300 rounded"
          />
        </div>

        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          onClick={() => exportProductionToPDF(filteredLogs, recipesMap)}
        >
          <FaFilePdf /> Export PDF
        </button>
      </div>

      <ProductionForm
        recipes={recipes}
        onSubmit={handleSubmit}
        initialValues={editIndex !== null ? productions[editIndex] : null}
      />

      <ProductionTable
        data={filteredLogs}
        recipesMap={recipesMap}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

