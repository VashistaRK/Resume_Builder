import React from "react";
import { categories } from "../../data/categories";

type ButtonGroupProps = {
  onExpertClick: () => void;
  onCategoryClick: (category: string) => void;
  activeCategory?: string;
};

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  onExpertClick,
  onCategoryClick,
  activeCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-10">
      {Object.entries(categories).map(([label, data], index) => (
        <div key={index} className="flex items-center">
          <button
            onClick={() =>
              label === "Expert Choice"
                ? onExpertClick()
                : onCategoryClick(label)
            }
            className={`flex items-center gap-2 px-3 py-2 text-[1rem] font-small border rounded-2xl hover:cursor-pointer hover:border-transparent transition-all duration-300 ${
              label === "Expert Choice"
                ? `${data.gradient} text-white border-2`
                : data.border
            } ${activeCategory === label ? "ring-2 ring-purple-400" : ""}`}
            aria-label={`Filter by ${label}`}
          >
            <span>{data.icon}</span>
            <span
              className={
                label === "Expert Choice" ? "text-white" : "text-inherit"
              }
            >
              {label}
            </span>
          </button>
          {label === "Expert Choice" && (
            <div className="h-10 w-[1px] bg-gray-300 mx-1" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ButtonGroup;
