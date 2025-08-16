import React, { useRef, useEffect } from "react";

interface GooeyButtonGroupProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

const GooeyButtonGroup: React.FC<GooeyButtonGroupProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const activeButton = containerRef.current.querySelector(
      "button.active"
    ) as HTMLElement;
    if (activeButton) updateEffectPosition(activeButton);
  }, [activeCategory]);

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
    textRef.current.classList.add("active");
  };

  const handleClick = (cat: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveCategory(cat);
    updateEffectPosition(e.currentTarget);
  };

  return (
    <>
      <style>{`
        .effect {
          position: absolute;
          pointer-events: none;
          display: grid;
          place-items: center;
          z-index: 1;
          border-radius: 9999px;
        }
        .effect.text {
          color: white;
          transition: color 0.3s ease;
        }
        .effect.text.active {
          color: black;
        }
        .effect.filter {
          filter: blur(7px) contrast(100) blur(0);
          mix-blend-mode: lighten;
          background: white;
        }
        button.active {
          color: black;
        }
      `}</style>

      <div
        ref={containerRef}
        className="relative flex justify-center gap-6 mt-6 border-b border-gray-700"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={(e) => handleClick(cat, e)}
            className={`py-2 px-4 text-sm font-medium relative ${
              activeCategory === cat
                ? "active text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}

        {/* Effect overlays */}
        <span className="effect filter" ref={filterRef} />
        <span className="effect text" ref={textRef} />
      </div>
    </>
  );
};

export default GooeyButtonGroup;
