import React, { useState } from 'react';
import ProductionForm from '../features/production/ProductionForm';
import ProductionTable from '../features/production/ProductionTable';
import { FaFilePdf } from 'react-icons/fa';
import { exportProductionToPDF } from '../components/exportRecipesToPDF';
import { useIngredients } from '../contexts/IngredientContext';
import { useRecipes } from '../contexts/RecipeContext';

export default function Production() {
  const [logs, setLogs] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const { deductStock } = useIngredients();
  const { recipes, getIngredientsForRecipe } = useRecipes();

  const bases = ['Camp A', 'Camp B', 'Base Alpha'];
  const recipesMap = Object.fromEntries(recipes.map(r => [r.id, r]));

  const [filters, setFilters] = useState({ recipe: 'all', base: 'all', date: '' });

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
      const updated = [...logs];
      updated[editIndex] = entry;
      setLogs(updated);
      setEditIndex(null);
    } else {
      setLogs(prev => [...prev, entry]);
    }
  };

  const handleEdit = (index) => setEditIndex(index);

  const handleDelete = (index) => {
    const copy = [...logs];
    copy.splice(index, 1);
    setLogs(copy);
  };

  const filteredLogs = logs.filter(log =>
    (filters.recipe === 'all' || log.recipeId === filters.recipe) &&
    (filters.base === 'all' || log.base === filters.base) &&
    (!filters.date || log.date === filters.date)
  );

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <select
            value={filters.recipe}
            onChange={(e) => setFilters({ ...filters, recipe: e.target.value })}
            className="px-3 py-1 text-sm border border-gray-300 rounded"
          >
            <option value="all">All Recipes</option>
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
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
        bases={bases}
        onSubmit={handleSubmit}
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
