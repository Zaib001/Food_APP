import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function FoodLoader({
  fullscreen = false,
  label = "Loading...",
  sublabel = "",
  /** optional 0–100 for determinate mode */
  progress,
  /** 96–140 looks best */
  size = 112,
  /** rose | emerald | sky */
  variant = "rose",
}) {
  const colors = useMemo(() => {
    switch (variant) {
      case "emerald":
        return ["#10b981", "#22c55e", "#06b6d4"];
      case "sky":
        return ["#0ea5e9", "#60a5fa", "#a78bfa"];
      default:
        return ["#f43f5e", "#ec4899", "#a855f7"]; // rose
    }
  }, [variant]);

  const r = 38;
  const C = 2 * Math.PI * r;
  const dashOffset = progress != null ? C * (1 - Math.min(Math.max(progress, 0), 100) / 100) : C * 0.25;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={
        fullscreen
          ? "fixed inset-0 z-[70] grid place-items-center bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm"
          : "grid place-items-center"
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        {/* Loader Core */}
        <div style={{ width: size, height: size }} className="relative">
          {/* soft plate shadow */}
          <motion.div
            className="absolute inset-x-0 bottom-1 mx-auto h-3 w-24 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"
            initial={{ scaleX: 0.6, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 18 }}
          />

          {/* progress ring */}
          <svg
            className="absolute inset-0 mx-auto"
            width={size}
            height={size}
            viewBox="0 0 100 100"
          >
            <defs>
              <linearGradient id="food-loader-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={colors[0]} />
                <stop offset="50%" stopColor={colors[1]} />
                <stop offset="100%" stopColor={colors[2]} />
              </linearGradient>
            </defs>
            {/* track */}
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="rgba(229,231,235,0.65)"
              strokeWidth="6"
            />
            {/* progress */}
            <motion.circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="url(#food-loader-grad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 50 50)"
              animate={
                progress == null
                  ? { strokeDashoffset: [C * 0.75, C * 0.25, C * 0.75] }
                  : { strokeDashoffset: dashOffset }
              }
              transition={
                progress == null
                  ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                  : { type: "spring", stiffness: 120, damping: 20 }
              }
            />
          </svg>

          {/* cloche (floats slightly) */}
          <motion.div
            className="absolute left-1/2 top-6 -translate-x-1/2"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="92" height="66" viewBox="0 0 88 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* dome */}
              <path d="M6 44c0-17.12 14.88-31 33.22-31S72.44 26.88 72.44 44" stroke="url(#food-loader-grad)" strokeWidth="4" strokeLinecap="round" />
              {/* knob */}
              <circle cx="39.2" cy="10.5" r="4" stroke="url(#food-loader-grad)" strokeWidth="3" fill="white" />
              {/* base line */}
              <line x1="2" y1="44" x2="76" y2="44" stroke="#e5e7eb" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* rising steam */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-4 h-5 w-5 -translate-x-1/2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: [0, 1, 0], y: [-2, -10, -18] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 18c2-3-2-5 0-8" stroke={colors[0]} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.div>
          ))}
        </div>

        {/* caption + percent */}
        <div className="mt-4 text-center">
          <motion.div
            className="text-sm font-semibold bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent
                       dark:from-rose-400 dark:via-pink-400 dark:to-fuchsia-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {label}
            {progress != null && (
              <span className="ml-1 text-gray-500 dark:text-gray-300 font-normal">
                {Math.round(Math.min(Math.max(progress, 0), 100))}%
              </span>
            )}
          </motion.div>
          {sublabel ? (
            <motion.div
              className="text-xs text-gray-500 dark:text-gray-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {sublabel}
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
