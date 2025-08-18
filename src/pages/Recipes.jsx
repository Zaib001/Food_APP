import React, { useEffect, useMemo, useState } from "react";
import RecipeForm from "../features/recipes/RecipeForm";
import RecipeCard from "../features/recipes/RecipeCard";
import { exportRecipesToCSV, exportRecipesToPDF } from "../components/exportRecipesToPDF";
import { FaFileCsv, FaFilePdf, FaFilter, FaTimes } from "react-icons/fa";
import { useRecipes } from "../contexts/RecipeContext";
import { getAllIngredients } from "../api/ingredientApi";
import { motion, AnimatePresence } from "framer-motion";

const RECIPE_TYPES = [
  "All",
  "Fruit",
  "Protein",
  "Side Dish",
  "Salad",
  "Soup",
  "Cold Drink",
  "Hot Drink",
  "Bakery",
  "Desserts",
  "Base Recipes",
];

export default function Recipes() {
  const { recipes, addRecipe, updateRecipeAtIndex, deleteRecipeAtIndex, quickScaleRecipeAtIndex } =
    useRecipes();

  const [ingredients, setIngredients] = useState([]);
  const [loadingIngredients, setLoadingIngredients] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [editIndex, setEditIndex] = useState(null);
  const [viewIndex, setViewIndex] = useState(null);
  const [scaledPreview, setScaledPreview] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllIngredients();
        setIngredients(res.data);
      } catch (err) {
        console.error("Error fetching ingredients:", err);
      } finally {
        setLoadingIngredients(false);
      }
    })();
  }, []);

  const ingredientsMap = useMemo(
    () => Object.fromEntries(ingredients.map((i) => [i._id, i])),
    [ingredients]
  );

  const handleAddRecipe = (formData) => addRecipe(formData);

  const handleUpdateRecipe = (formData) => {
    updateRecipeAtIndex(editIndex, formData);
    setEditIndex(null);
  };

  const handleDelete = (index) => deleteRecipeAtIndex(index);

  const handleQuickScale = async (index, clientCount) => {
    const preview = await quickScaleRecipeAtIndex(index, clientCount);
    setScaledPreview(preview);
    setViewIndex(index);
  };

  const handleApplyScaleAndSave = async (index, clientCount) => {
    const formData = new FormData();
    formData.append("name", recipes[index].name);
    formData.append("portions", recipes[index].portions);
    formData.append("yieldWeight", recipes[index].yieldWeight);
    formData.append("type", recipes[index].type);
    formData.append("ingredients", JSON.stringify(recipes[index].ingredients));
    formData.append("procedure", recipes[index].procedure || "");
    formData.append("isLocked", recipes[index].isLocked ? "true" : "false");
    formData.append("clientCount", clientCount);
    await updateRecipeAtIndex(index, formData);
  };

  const list = recipes.filter((r) => (filterType === "All" ? true : r.type === filterType));

  // ====== UI helpers
  const section = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  const chipCls = (active) =>
    `px-3 py-1.5 rounded-full border text-sm transition-all ${
      active
        ? "bg-rose-600 text-white border-rose-600 shadow"
        : "bg-white text-gray-700 border-gray-200 hover:border-rose-300"
    }`;

  // ====== Loading skeleton
  if (loadingIngredients) {
    return (
      <div className="p-6">
        <div className="animate-pulse grid gap-4">
          <div className="h-20 rounded-2xl bg-gray-100" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-gray-100" />)
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-rose-200 via-pink-200 to-fuchsia-200 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 blur-3xl opacity-70" />

      {/* Header + Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-rose-100 shadow bg-white"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 opacity-95" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="relative p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Recipes</h1>
              <p className="text-white/80 text-sm">Create, edit, scale, and export your recipes.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => exportRecipesToCSV(recipes, ingredientsMap)}
                className="relative inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200/60"
              >
                <FaFileCsv /> Export CSV
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => exportRecipesToPDF(recipes, ingredientsMap)}
                className="relative inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200/60"
              >
                <FaFilePdf /> Export PDF
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter bar */}
      <motion.div variants={section} initial="hidden" animate="show" className="mt-5">
        <div className="sticky top-2 z-10">
          <div className="rounded-2xl border bg-white/80 backdrop-blur shadow-sm p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <FaFilter />
                <span className="text-sm font-semibold">Recipe Types</span>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {RECIPE_TYPES.map((t) => (
                  <button key={t} onClick={() => setFilterType(t)} className={chipCls(filterType === t)}>
                    {t}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setFilterType("All")}
                className="px-3 py-1.5 rounded-xl border bg-white hover:bg-gray-50 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Create or Edit Form */}
      <motion.div
        variants={section}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-6"
      >
        <div className="rounded-2xl border border-gray-100 bg-white/80 shadow-sm p-4">
          {editIndex === null ? (
            <RecipeForm ingredientsList={ingredients} onSubmit={handleAddRecipe} />
          ) : (
            <RecipeForm
              ingredientsList={ingredients}
              onSubmit={handleUpdateRecipe}
              isEditing
              initialRecipe={recipes[editIndex]}
            />
          )}
        </div>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={section}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {list.map((recipe, index) => (
            <motion.div
              key={recipe._id || index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
            >
              <RecipeCard
                recipe={recipe}
                ingredientsMap={ingredientsMap}
                onEdit={() => setEditIndex(index)}
                onDelete={() => handleDelete(index)}
                onView={() => setViewIndex(index)}
                onQuickScale={(count) => handleQuickScale(index, count)}
                onApplyScale={(count) => handleApplyScaleAndSave(index, count)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* View / Scale Modal */}
      <AnimatePresence>
        {viewIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setViewIndex(null);
                setScaledPreview(null);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Recipe details"
              className="absolute inset-x-3 sm:inset-x-auto sm:right-6 top-10 sm:top-1/2 sm:-translate-y-1/2 bg-white w-auto sm:w-[640px] rounded-2xl p-6 shadow-2xl border border-rose-100"
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setViewIndex(null);
                  setScaledPreview(null);
                }}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <FaTimes />
              </button>

              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {recipes[viewIndex]?.name} — Details
              </h3>

              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {(scaledPreview || recipes[viewIndex])?.ingredients?.map((it, i) => (
                  <div key={i} className="flex justify-between text-sm border-b py-1">
                    <span>{ingredientsMap[it.ingredientId]?.name || "Unknown"}</span>
                    <span>
                      {Number(it.quantity).toFixed(2)} {ingredientsMap[it.ingredientId]?.originalUnit || ""}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-700 flex flex-wrap gap-4">
                <span>
                  Portions: <strong>{(scaledPreview || recipes[viewIndex])?.portions}</strong>
                </span>
                <span>
                  Weight: <strong>{Number((scaledPreview || recipes[viewIndex])?.yieldWeight || 0).toFixed(2)} g</strong>
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
