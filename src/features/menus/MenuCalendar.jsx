import React, { useEffect, useMemo, useRef, useState } from "react";
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

/**
 * MenuCalendar – Polished, animated UI
 * - Glassy gradient headers per day
 * - Staggered card entrance + hover lift/glow
 * - Animated counters for kcal & cost
 * - Sticky day header
 * - Modal with backdrop blur, spring transitions & ESC to close
 * - Keyboard & screen-reader friendly
 */

export default function MenuCalendar({ menus = [], ingredientsMap = {} }) {
  const [openIdx, setOpenIdx] = useState(null); // index within the day list
  const [openDate, setOpenDate] = useState(null); // the date key for modal

  // ===== Helpers
  const groupedByDate = useMemo(() => {
    return menus.reduce((acc, menu) => {
      if (!acc[menu.date]) acc[menu.date] = [];
      acc[menu.date].push(menu);
      return acc;
    }, {});
  }, [menus]);

  const dayKeysSorted = useMemo(
    () => Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b)),
    [groupedByDate]
  );

  const mealFrom = (m) => (m.mealType || m.meal || m.type || "").toLowerCase();
  const baseFrom = (m) => m.base || m.location || m.site || "—";

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

  const getRecipeNames = (recipes = []) => recipes.map((r) => r?.name || "Unnamed").join(", ");

  const getTotalKcal = (recipes = []) => {
    return (
      recipes.reduce((sum, recipe) => {
        const kcal =
          recipe?.ingredients?.reduce((s, ing) => {
            const data = ingredientsMap[ing.ingredientId] || {};
            const kcal = parseFloat(data.kcal || 0);
            const qty = parseFloat(ing.quantity || 0);
            return s + (qty * kcal) / 1000;
          }, 0) || 0;
        return sum + kcal;
      }, 0) || 0
    );
  };

  const getTotalCost = (recipes = []) => {
    return (
      recipes.reduce((sum, recipe) => {
        const cost =
          recipe?.ingredients?.reduce((s, ing) => {
            const data = ingredientsMap[ing.ingredientId] || {};
            const price = parseFloat(data.pricePerKg || 0);
            const yieldPct = parseFloat(data.yield || 100);
            const qty = parseFloat(ing.quantity || 0);
            const adjustedQty = yieldPct === 0 ? 0 : qty / (yieldPct / 100);
            return s + adjustedQty * price;
          }, 0) || 0;
        return sum + cost;
      }, 0) || 0
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
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

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ===== Small hook to animate numbers smoothly
  const useAnimatedNumber = (value, duration = 0.6) => {
    const [display, setDisplay] = useState(0);
    const rafRef = useRef();
    const startRef = useRef();
    const fromRef = useRef(0);

    useEffect(() => {
      cancelAnimationFrame(rafRef.current);
      const start = performance.now();
      startRef.current = start;
      const from = fromRef.current;
      const delta = value - from;

      const step = (t) => {
        const p = Math.min(1, (t - start) / (duration * 1000));
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        const next = from + delta * eased;
        setDisplay(next);
        if (p < 1) rafRef.current = requestAnimationFrame(step);
        else fromRef.current = value;
      };
      rafRef.current = requestAnimationFrame(step);
      return () => cancelAnimationFrame(rafRef.current);
    }, [value, duration]);

    return display;
  };

  const DayHeader = ({ date, tags }) => (
    <div className="sticky top-0 z-10">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500" />
        <div className="absolute inset-0 backdrop-blur-[1px] opacity-70" />
        <div className="relative p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaCalendarDay className="text-xl drop-shadow" />
              <h2 className="text-xl font-bold drop-shadow-sm">{formatDate(date)}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[...new Set(tags)].map((mn, i) => (
                <motion.span
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-1 text-xs bg-white/20 text-white px-3 py-1 rounded-full shadow-sm"
                >
                  <FaTag size={10} /> {mn}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Card = ({ menu, idx, onOpen }) => {
    const recipes = Array.isArray(menu.recipeIds) ? menu.recipeIds : [];
    const totalKcal = getTotalKcal(recipes);
    const totalCost = getTotalCost(recipes);

    const kcalAnim = useAnimatedNumber(totalKcal);
    const costAnim = useAnimatedNumber(totalCost);

    return (
      <motion.button
        layout
        key={idx}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOpen}
        className="group relative text-left rounded-2xl p-4 bg-white/70 dark:bg-white/80 border border-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] transition-all duration-300 backdrop-blur-sm"
      >
        {/* Glow ring */}
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
                {Math.round(kcalAnim).toLocaleString()} <span className="text-xs font-semibold">kcal</span>
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-green-600">
                <FaDollarSign size={14} />
                <span className="text-xs font-medium">Cost</span>
              </div>
              <p className="text-lg font-extrabold mt-1 tabular-nums">
                ${costAnim.toFixed(2)}
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

        {/* Subtle gradient corner */}
        <span className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-gradient-to-tr from-rose-200 to-pink-200 opacity-60 blur-2xl" />
      </motion.button>
    );
  };

  return (
    <div className="space-y-8">
      <AnimatePresence mode="popLayout">
        {dayKeysSorted.map((date) => {
          const menuEntries = groupedByDate[date] || [];
          return (
            <motion.section
              key={date}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl overflow-hidden border border-rose-100/70 shadow-sm bg-white"
            >
              <DayHeader date={date} tags={menuEntries.map((m) => m.menuName)} />

              <motion.div
                className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.06 },
                  },
                }}
              >
                {menuEntries.map((menu, idx) => (
                  <motion.div
                    key={idx}
                    variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  >
                    <Card menu={menu} idx={idx} onOpen={() => handleOpen(date, idx)} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          );
        })}
      </AnimatePresence>

      {/* Empty state */}
      {menus.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="mx-auto max-w-md">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-200 to-pink-200"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              />
              <div className="absolute inset-3 rounded-full bg-white border border-rose-100 grid place-items-center text-rose-400">
                <FaCalendarDay size={28} />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No menus scheduled</h3>
            <p className="text-gray-500">Add menus to see them displayed in your calendar</p>
          </div>
        </motion.div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {currentOpenMenu && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu details"
              className="absolute inset-x-3 sm:inset-x-auto sm:right-6 top-10 sm:top-1/2 sm:-translate-y-1/2 bg-white w-auto sm:w-[640px] rounded-2xl p-6 shadow-2xl border border-rose-100"
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
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
                  <span className="inline-flex items-center gap-2 font-medium"><FaCalendarDay />{formatDate(currentOpenMenu.date)}</span>
                  {currentOpenMenu.menuName && (
                    <span className="inline-flex items-center gap-1 text-xs bg-rose-50 text-rose-700 px-2 py-1 rounded border border-rose-100">
                      <FaTag /> {currentOpenMenu.menuName}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mt-2 text-gray-900">
                  {labelForMeal(mealFrom(currentOpenMenu))} — {baseFrom(currentOpenMenu)}
                </h3>
              </div>

              {/* Recipes list */}
              <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
                {(currentOpenMenu.recipeIds || []).map((r, i) => (
                  <motion.div
                    key={r?._id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-xl p-3 hover:border-rose-200/80 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900">{r?.name || "Unnamed"}</div>
                      {r?.type && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200 text-gray-700">
                          {r.type}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 gap-2">
                      <div>
                        Portions: <span className="font-medium">{r?.portions ?? "—"}</span>
                      </div>
                      <div>
                        Yield: <span className="font-medium">{(r?.yieldWeight ?? 0).toFixed ? r.yieldWeight.toFixed(2) : r?.yieldWeight || "—"} g</span>
                      </div>
                    </div>
                    {r?.ingredients?.length ? (
                      <div className="mt-2 text-xs text-gray-600">
                        <span className="font-semibold">Ingredients:</span>{" "}
                        {r.ingredients.map((ing, idx) => {
                          const meta = ingredientsMap[ing.ingredientId] || {};
                          return (
                            <span key={idx}>
                              {meta.name || "Item"} {Number(ing.quantity || 0).toFixed(2)} {meta.originalUnit || ""}
                              {idx < r.ingredients.length - 1 ? ", " : ""}
                            </span>
                          );
                        })}
                      </div>
                    ) : null}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
