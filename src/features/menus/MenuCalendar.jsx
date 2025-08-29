// src/components/MenuCalendar.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  FaUtensils,
  FaMapMarkerAlt,
  FaDollarSign,
  FaFireAlt,
  FaTag,
  FaCalendarDay,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRecipes } from "../../contexts/RecipeContext";

// ---------- Helpers: kcal & cost ----------
const calculateRecipeKcal = (recipe, ingredientsMap) => {
  if (!recipe?.ingredients) return 0;
  return recipe.ingredients.reduce((sum, ing) => {
    const meta = ingredientsMap[ing.ingredientId] || {};
    const kcal = parseFloat(meta.kcal || 0);
    const qty = parseFloat(ing.quantity || 0);
    return sum + (qty * kcal) / 1000;
  }, 0);
};

const calculateRecipeCost = (recipe, ingredientsMap) => {
  if (!recipe?.ingredients) return 0;
  return recipe.ingredients.reduce((sum, ing) => {
    const meta = ingredientsMap[ing.ingredientId] || {};
    const price = parseFloat(meta.pricePerKg || 0);
    const yieldPct = parseFloat(meta.yield || 100);
    const qty = parseFloat(ing.quantity || 0);
    const adjustedQty = yieldPct === 0 ? 0 : qty / (yieldPct / 100);
    return sum + adjustedQty * price;
  }, 0);
};

// ---------- Precompute recipe aggregates ----------
const usePrecomputedRecipeData = (recipes, ingredientsMap) => {
  return useMemo(() => {
    const data = new Map();
    recipes.forEach((recipe) => {
      if (recipe && recipe._id) {
        data.set(recipe._id, {
          kcal: calculateRecipeKcal(recipe, ingredientsMap),
          cost: calculateRecipeCost(recipe, ingredientsMap),
          name: recipe.name || "Unnamed",
          type: recipe.type || "",
          portions: recipe.portions || 0,
          yieldWeight: recipe.yieldWeight || 0,
          ingredients: recipe.ingredients || [],
        });
      }
    });
    return data;
  }, [recipes, ingredientsMap]);
};

// ==================================================
export default function MenuCalendar({ menus = [], ingredientsMap = {} }) {
  const { recipes: allRecipeList } = useRecipes();

  // Build a lookup for recipes available in context
  const recipesById = useMemo(() => {
    const m = new Map();
    (allRecipeList || []).forEach((r) => r?._id && m.set(r._id, r));
    return m;
  }, [allRecipeList]);

  // Normalize recipeIds to full recipe objects (skip missing)
  const toRecipeObjects = useMemo(
    () => (arr = []) =>
      arr
        .map((r) => (typeof r === "string" ? recipesById.get(r) : r))
        .filter(Boolean),
    [recipesById]
  );

  const [openIdx, setOpenIdx] = useState(null);
  const [openDate, setOpenDate] = useState(null);

  // Collect unique recipes across all menus for precomputation
  const allRecipes = useMemo(() => {
    const acc = [];
    const seen = new Set();
    menus.forEach((menu) => {
      if (Array.isArray(menu.recipeIds)) {
        toRecipeObjects(menu.recipeIds).forEach((recipe) => {
          if (recipe && recipe._id && !seen.has(recipe._id)) {
            seen.add(recipe._id);
            acc.push(recipe);
          }
        });
      }
    });
    return acc;
  }, [menus, toRecipeObjects]);

  const precomputedRecipeData = usePrecomputedRecipeData(allRecipes, ingredientsMap);

  // Group menus by date
  const groupedByDate = useMemo(() => {
    return (menus || []).reduce((acc, menu) => {
      const key = menu?.date || "—";
      if (!acc[key]) acc[key] = [];
      acc[key].push(menu);
      return acc;
    }, {});
  }, [menus]);

  const dayKeysSorted = useMemo(
    () => Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b)),
    [groupedByDate]
  );

  const mealFrom = (m) => (m?.mealType || m?.meal || m?.type || "").toLowerCase();
  const baseFrom = (m) => m?.base || m?.location || m?.site || "—";

  const labelForMeal = (mealType) => {
    switch ((mealType || "").toLowerCase()) {
      case "breakfast":
        return "Breakfast";
      case "lunch":
        return "Lunch";
      case "dinner":
        return "Dinner";
      case "snack":
        return "Snack";
      case "extra":
        return "Extra";
      default:
        return mealType || "—";
    }
  };

  const getRecipeNames = (recipes = []) =>
    recipes.map((r) => r?.name || "Unnamed").join(", ");

  const getTotalKcal = (recipes = []) =>
    recipes.reduce((sum, recipe) => {
      const data = precomputedRecipeData.get(recipe._id);
      return sum + (data?.kcal || 0);
    }, 0);

  const getTotalCost = (recipes = []) =>
    recipes.reduce((sum, recipe) => {
      const data = precomputedRecipeData.get(recipe._id);
      return sum + (data?.cost || 0);
    }, 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString || "—";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const handleOpen = (dateKey, idx) => {
    setOpenDate(dateKey);
    setOpenIdx(idx);
  };
  const handleClose = () => {
    setOpenDate(null);
    setOpenIdx(null);
  };

  const currentOpenMenu =
    openDate != null && openIdx != null ? (groupedByDate[openDate] || [])[openIdx] : null;

  // ESC to close modal
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ---------- UI pieces ----------
  const DayHeader = ({ date, tags }) => (
    <div className="sticky top-0 z-10">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500" />
        <div className="pointer-events-none absolute inset-0 backdrop-blur-[1px] opacity-70" />
        <div className="relative p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaCalendarDay className="text-xl drop-shadow" />
              <h2 className="text-xl font-bold drop-shadow-sm">{formatDate(date)}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[...new Set(tags)].map((mn, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs bg-white/20 text-white px-3 py-1 rounded-full shadow-sm"
                >
                  <FaTag size={10} /> {mn}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Card = ({ menu, onOpen }) => {
    const recipes = toRecipeObjects(Array.isArray(menu?.recipeIds) ? menu.recipeIds : []);
    const totalKcal = getTotalKcal(recipes);
    const totalCost = getTotalCost(recipes);

    return (
      <button
        onClick={onOpen}
        className="group relative text-left rounded-2xl p-4 bg-white/80 border border-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm text-gray-900"
      >
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-rose-200" />

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-semibold capitalize text-rose-600">
            {labelForMeal(mealFrom(menu))}
          </h3>
          <span className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-full">
            {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-rose-400">
              <FaUtensils />
            </div>
            <div>
              <p className="text-xs text-gray-500">Recipes</p>
              <p className="text-sm font-medium text-gray-800 line-clamp-2">
                {getRecipeNames(recipes)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-orange-500">
                <FaFireAlt size={14} />
                <span className="text-xs font-medium">Calories</span>
              </div>
              <p className="text-lg font-extrabold mt-1 tabular-nums">
                {Math.round(totalKcal).toLocaleString()}{" "}
                <span className="text-xs font-semibold">kcal</span>
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-green-600">
                <FaDollarSign size={14} />
                <span className="text-xs font-medium">Cost</span>
              </div>
              <p className="text-lg font-extrabold mt-1 tabular-nums">
                ${totalCost.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 border-t pt-2">
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt size={12} className="text-gray-400" />
              <span>{baseFrom(menu)}</span>
            </div>
          </div>
        </div>

        <span className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-gradient-to-tr from-rose-200 to-pink-200 opacity-60 blur-2xl" />
      </button>
    );
  };

  // ---------- Render ----------
  return (
    <div className="space-y-8 text-gray-900">
      {dayKeysSorted.map((date) => {
        const menuEntries = groupedByDate[date] || [];
        return (
          <motion.section
            key={date}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="relative z-0 rounded-2xl overflow-hidden border border-rose-100/70 shadow-sm bg-white"
          >
            <DayHeader
              date={date}
              tags={menuEntries.map((m) => m?.menuName).filter(Boolean)}
            />

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuEntries.map((menu, idx) => (
                <div key={menu?._id || idx}>
                  <Card menu={menu} onOpen={() => handleOpen(date, idx)} />
                </div>
              ))}
            </div>
          </motion.section>
        );
      })}

      {menus.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto max-w-md">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-200 to-pink-200 animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-3 rounded-full bg-white border border-rose-100 grid place-items-center text-rose-400">
                <FaCalendarDay size={28} />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No menus scheduled
            </h3>
            <p className="text-gray-500">
              Add menus to see them displayed in your calendar
            </p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {currentOpenMenu && (
          <motion.div
            className="fixed inset-0 z-[5000] flex items-start justify-center p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50"
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu details"
              className="relative bg-white w-full max-w-[680px] rounded-2xl p-6 shadow-2xl border border-rose-100 z-[5001] text-gray-900 max-h-[85vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <FaTimes />
              </button>

              <div className="mb-4">
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-2 font-medium">
                    <FaCalendarDay />
                    {(() => {
                      const d = currentOpenMenu?.date;
                      const dt = new Date(d);
                      return isNaN(dt) ? d || "—" : dt.toLocaleDateString("en-US", {
                        weekday: "long", month: "short", day: "numeric",
                      });
                    })()}
                  </span>
                  {currentOpenMenu?.menuName && (
                    <span className="inline-flex items-center gap-1 text-xs bg-rose-50 text-rose-700 px-2 py-1 rounded border border-rose-100">
                      <FaTag /> {currentOpenMenu.menuName}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mt-2 text-gray-900">
                  {labelForMeal(mealFrom(currentOpenMenu))} — {baseFrom(currentOpenMenu)}
                </h3>
              </div>

              <div className="space-y-3">
                {toRecipeObjects(currentOpenMenu?.recipeIds || []).map((r, i) => {
                  const recipeData = precomputedRecipeData.get(r._id);
                  if (!recipeData) return null;

                  return (
                    <div
                      key={r?._id || i}
                      className="border rounded-xl p-3 hover:border-rose-200/80 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900">{recipeData.name}</div>
                        {recipeData.type && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200 text-gray-700">
                            {recipeData.type}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 gap-2">
                        <div>
                          Portions: <span className="font-medium">{recipeData.portions}</span>
                        </div>
                        <div>
                          Yield:{" "}
                          <span className="font-medium">
                            {Number.isFinite(recipeData.yieldWeight)
                              ? Number(recipeData.yieldWeight).toFixed(2)
                              : recipeData.yieldWeight || "—"}{" "}
                            g
                          </span>
                        </div>
                      </div>
                      {recipeData.ingredients?.length ? (
                        <div className="mt-2 text-xs text-gray-600">
                          <span className="font-semibold">Ingredients:</span>{" "}
                          {recipeData.ingredients.map((ing, idx) => {
                            const meta = ingredientsMap[ing.ingredientId] || {};
                            return (
                              <span key={idx}>
                                {meta.name || "Item"} {Number(ing.quantity || 0).toFixed(2)}{" "}
                                {meta.originalUnit || ""}
                                {idx < recipeData.ingredients.length - 1 ? ", " : ""}
                              </span>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
