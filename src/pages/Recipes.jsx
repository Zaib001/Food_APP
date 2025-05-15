import React, { useState } from 'react';
import RecipeForm from '../features/recipes/RecipeForm';
import RecipeCard from '../features/recipes/RecipeCard';
import EditModal from '../components/EditModal';
import { exportRecipesToCSV, exportRecipesToPDF } from '../components/exportRecipesToPDF';
import { FaFileCsv, FaFilePdf } from 'react-icons/fa';
const sampleIngredients = [
    { id: '1', name: 'Potato', unit: 'kg', price: 2.5, kcal: 770, yield: 80 },
    { id: '2', name: 'Carrot', unit: 'kg', price: 1.8, kcal: 410, yield: 90 },
    { id: '3', name: 'Egg', unit: 'pc', price: 0.5, kcal: 150, yield: 100 },
    { id: '4', name: 'Bread', unit: 'slice', price: 0.3, kcal: 100, yield: 100 },
    { id: '5', name: 'Chicken', unit: 'kg', price: 6.0, kcal: 900, yield: 70 },
];

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const ingredientsMap = Object.fromEntries(
        sampleIngredients.map((i) => [i.id, i])
    );

    const handleAddRecipe = (newRecipe) => {
        setRecipes((prev) => [...prev, newRecipe]);
    };

    const handleUpdateRecipeName = (updated) => {
        const updatedList = [...recipes];
        updatedList[editIndex].name = updated.name;
        setRecipes(updatedList);
    };

    const handleDelete = (index) => {
        const updatedList = [...recipes];
        updatedList.splice(index, 1);
        setRecipes(updatedList);
    };

    return (
        <div className="p-6">
            <div className="flex justify-end gap-3 mb-4">
                <button
                    onClick={() => exportRecipesToCSV(recipes, ingredientsMap)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    <FaFileCsv className="text-lg" />
                    Export to CSV
                </button>

                <button
                    onClick={() => exportRecipesToPDF(recipes, ingredientsMap)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    <FaFilePdf className="text-lg" />
                    Export to PDF
                </button>
            </div>

            {/* Recipe Form */}
            <RecipeForm ingredientsList={sampleIngredients} onSubmit={handleAddRecipe} />

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe, index) => (
                    <RecipeCard
                        key={index}
                        recipe={recipe}
                        ingredientsMap={ingredientsMap}
                        onEdit={() => {
                            setEditIndex(index);
                            setEditModalOpen(true);
                        }}
                        onDelete={() => handleDelete(index)}
                    />
                ))}
            </div>

            {/* Edit Modal (for recipe name only) */}
            <EditModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={handleUpdateRecipeName}
                title="Edit Recipe"
                initialValues={{ name: recipes[editIndex]?.name || '' }}
                fields={[{ name: 'name', label: 'Recipe Name' }]}
            />
        </div>
    );
}
