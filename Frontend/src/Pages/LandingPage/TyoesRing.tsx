import React, { useState } from "react";
import { motion } from "framer-motion";
import { categories } from "../../data/categories";

const RingCheckpoints: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categoryEntries = Object.entries(categories);
  const total = categoryEntries.length;

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-around py-16 px-4 overflow-hidden">
      {/* Glowing rotating background */}
      <div className="absolute w-72 h-72 md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-purple-600 blur-3xl opacity-20 animate-spin-slow z-0" />

      {/* Left Ring */}
      <div
        className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center rounded-full z-10"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Connecting Lines */}
        {hovered ? (
          <svg
            className="absolute w-full h-full"
            viewBox="0 0 320 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            {categoryEntries.map(([label], index) => {
              const angle = (360 / total) * index;
              const radius = 160;
              const x = 160 + radius * Math.cos((angle * Math.PI) / 180);
              const y = 160 + radius * Math.sin((angle * Math.PI) / 180);

              return (
                <line
                  key={`line-${label}`}
                  x1="160"
                  y1="160"
                  x2={x}
                  y2={y}
                  stroke="#888"
                  strokeWidth="0.5"
                  opacity="0.5"
                />
              );
            })}
          </svg>
        ):(
          <div className="h-8 w-8 border-2 border-cyan-200 rounded-full"></div>
        )}

        {/* Orbiting Items */}
        {categoryEntries.map(([label, data], index) => {
          const angle = (360 / total) * index;
          const radius = 200;

          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);

          return (
            <motion.div
              key={label}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={
                hovered
                  ? { x, y, opacity: 1 }
                  : { x: 0, y: 0, opacity: 0 }
              }
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
              onMouseEnter={() => setHoveredCategory(label)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="absolute flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="p-2 md:p-3 text-white">
                <div className="text-xl md:text-2xl">{data.icon}</div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
                transition={{ duration: 0.3 }}
                className="text-xs md:text-sm mt-1 text-white text-center w-20 md:w-24"
              >
                {label}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Right Description */}
      <div className="max-w-md w-full z-10 mt-10 md:mt-0">
        {hoveredCategory ? (
          <motion.div
            key={hoveredCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 text-center md:text-left"
          >
            <h3 className="text-xl md:text-2xl text-stone-200 font-Rubik">
              {hoveredCategory}
            </h3>
            <p className="text-stone-400 text-sm md:text-base px-2 md:px-0">
              {categories[hoveredCategory].description}
            </p>
            <p className="text-purple-700 text-sm md:text-base">
              To view templates, visit the Resumes section.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-stone-400 text-center"
          >
            <h2 className="text-2xl md:text-3xl text-stone-200 font-Rubik">
              We Offer More
            </h2>
            <p className="text-sm md:text-base px-2 md:px-0">
              <span className="hidden md:inline">
                Move your cursor over each icon to learn more about the
                different resume types we offer.
              </span>
              <span className="inline md:hidden">
                To view templates, visit the Resumes section.
              </span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RingCheckpoints;
