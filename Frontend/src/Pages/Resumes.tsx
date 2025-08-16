import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FaEye, FaFileAlt, FaTimes, FaArrowUp } from "react-icons/fa";
import { categories } from "../data/categories";
import Particles from "@/components/magicui/Particles";
// import axios from "axios";
import GlobalApi from "@/../service/GlobalApi";

interface TemplateItem {
  _id: string;
  id: number;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  documentUrl: string;
  [key: string]: unknown;
}

const ResumeTemplates = () => {
  const [selectedImage, setSelectedImage] = useState<null | TemplateItem>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showTopButton, setShowTopButton] = useState(false);
  const [width, setWidth] = useState(1200);
  const imgRef = useRef<HTMLImageElement>(null);

  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryKeys = useMemo(() => Object.keys(categories), []);
  const [activeCategory, setActiveCategory] = useState(categoryKeys[0]);

  // ✅ Fetch templates from backend
  useEffect(() => {
  const fetchTemplates = async () => {
    try {
      const data = await GlobalApi.GETResumeTemplates();
      setTemplates(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setLoading(false);
    }
  };

  fetchTemplates();
}, []);

  // ✅ Filtered templates based on active category
  const filteredTemplates = useMemo(
    () => templates.filter((template) => template.category === activeCategory),
    [templates, activeCategory]
  );

  const resetImageZoom = useCallback(() => {
    setSelectedImage(null);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") resetImageZoom();
    };

    const handleScroll = () => {
      setShowTopButton(window.scrollY > 400);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) setWidth(entry.contentRect.width);
      }
    });

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll);
    resizeObserver.observe(document.body);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [resetImageZoom]);

  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : "";
  }, [selectedImage]);

  const renderButtonGroup = useCallback(
    (template: TemplateItem) => (
      <div className="flex gap-3 mt-4">
        <button
          className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setSelectedImage(template)}
        >
          <FaEye /> View
        </button>
        <a
          className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          href={template.documentUrl}
          download={`${template.name}.docx`}
        >
          <FaFileAlt /> Download
        </a>
      </div>
    ),
    []
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Hero Section */}
      <div className="relative w-full h-[600px]">
        <Particles
          particleColors={["#ffffff"]}
          particleCount={1000}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-violet-700/20 border border-violet-500/30 rounded-full text-gray-200 text-sm font-medium mb-6 backdrop-blur-md shadow-lg animate-pulse">
            <FaFileAlt className="mr-2 text-violet-400" />
            Professional Resume Templates
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-100 mb-4 leading-tight tracking-tight">
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-violet-400 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent animate-gradient">
              Resume Template
            </span>
          </h2>

          <p className="text-gray-300 max-w-2xl mb-10 text-lg px-4">
            Choose from a wide range of professionally designed resume templates to stand out in your career journey.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-10">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Resume Templates</h1>
          <p className="text-gray-400">Explore professionally designed resume templates by category.</p>

          <div className="flex flex-wrap justify-center gap-4 mt-6 border-b border-gray-700 pb-4">
            {categoryKeys.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-2 px-4 text-sm font-medium border-b-2 ${
                  activeCategory === cat
                    ? "border-violet-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-400 text-lg py-10">Loading templates...</div>
          ) : filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <div
                key={template._id}
                className="bg-[#141414] rounded-2xl overflow-hidden shadow border border-gray-800 group transition hover:shadow-lg"
              >
                <div className="relative cursor-pointer">
                  <img
                    loading="lazy"
                    src={template.imageUrl}
                    alt={template.name}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImage(template)}
                  />

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    {renderButtonGroup(template)}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{template.name}</h3>
                  <p className="text-gray-400 text-sm">{template.description}</p>
                  {width < 1200 && renderButtonGroup(template)}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 text-lg py-10">
              No templates found for this category.
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="relative bg-stone-300 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col sm:flex-row overflow-hidden">
            <button
              onClick={resetImageZoom}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 bg-white rounded-full p-2 shadow-md z-10"
            >
              <FaTimes size={20} />
            </button>

            <div className="w-full sm:w-2/3 h-full flex items-center justify-center bg-gray-300 p-4 overflow-auto">
              <img
                ref={imgRef}
                src={selectedImage.imageUrl}
                alt={selectedImage.name}
                className="object-contain max-h-full rounded-md transition-transform"
                style={{
                  transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                  cursor: isDragging ? "grabbing" : "grab",
                }}
                onWheel={(e) => {
                  e.preventDefault();
                  setZoomLevel((prev) => Math.min(Math.max(prev + e.deltaY * -0.001, 1), 3));
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              />
            </div>

            {width >= 1200 && (
              <div className="w-full sm:w-1/3 h-full p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedImage.name}</h2>
                <p className="text-gray-700">{selectedImage.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showTopButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-stone-400 hover:bg-stone-500 text-white p-3 rounded-full shadow-lg transition"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default ResumeTemplates;
