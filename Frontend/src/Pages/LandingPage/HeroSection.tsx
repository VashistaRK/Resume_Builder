import { useState, useEffect } from "react";
import { resumeTemplates } from "../../data/resumeTemplates";
import axios from "axios";
const HeroSection = () => {
  //taking only limited images from templetes images
  const images = resumeTemplates.slice(0, 5).map((template) => template.image);

  //Both in Single Event
  const handleCombinedMouseDown = (
    index: number,
    e: React.MouseEvent<HTMLImageElement>
  ) => {
    handleDrag(index, e); // Calls the existing drag handler
    handleImageClick(index); // Calls the existing image click handler
  };

  // Random positions for scattering effect
  const generateRandomPosition = () => ({
    x: Math.random() * 300 - 175, // Random offset between -50px and 50px
    y: Math.random() * 200 - 150,
  });

  // Initialize all images at the center
  const [positions, setPositions] = useState(
    images.map(() => ({ x: 0, y: 0 }))
  );

  // Add a state to track when the animation starts
  const [scattered, setScattered] = useState(false);

  // State to track which image is clicked (active)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  /*eslint-disable */
  // Scatter images after the component mounts
  useEffect(() => {
    setTimeout(() => {
      setPositions(images.map(() => generateRandomPosition()));
      setScattered(true);
    }, 500);
  }, []);

  const handleDrag = (index: number, e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    const startX = e.clientX - positions[index].x;
    const startY = e.clientY - positions[index].y;

    const onMouseMove = (event: MouseEvent) => {
      const newX = (event.clientX - startX) * 1.2;
      const newY = (event.clientY - startY) * 1.2;

      setPositions((prev) =>
        prev.map((pos, i) => (i === index ? { x: newX, y: newY } : pos))
      );
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleImageClick = (index: number) => {
    setActiveIndex(index); // Set the clicked image as active
  };

  /* File Count  */
  const [fileCount, setFileCount] = useState(null);
  const countFile = async () => {
    const [resumeRes, coverLetterRes] = await Promise.all([
      axios.get(import.meta.env.VITE_BASE_URL + "/api/docitems"),
      axios.get(import.meta.env.VITE_BASE_URL + "/api/coverLetters"),
    ]);

    const totalLength = resumeRes.data.length + coverLetterRes.data.length;

    setFileCount(totalLength);
  };

  useEffect(() => {
    countFile();
  }, []);

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between px-6 sm:px-2 py-12 max-w-7xl mx-auto">
      {/* Left Content */}
      <div className="max-w-2xl">
        <span className="text-neutral-600 font-semibold sm:text-sm text-[11px] btn-shine">
          <span>[ </span>
          {fileCount == null ? 30 : fileCount} + FREE TEMPLATES TO DOWNLOAD{" "}
          <span> ]</span>
        </span>
        <h1 className="my-5 md:text-6xl text-5xl font-bold font-goldman text-zinc-300">
          Resume Templates for Students
        </h1>
        <p className="text-stone-400 text-lg">
          Leverage our professionally designed, ATS-optimized resume templates featuring well-organized layouts aligned with job-specific requirements. Fully editable in Word and Google Docs, these templates are crafted to enhance visibility, readability, and impact throughout your job search.
        </p>
      </div>

      <svg className="absolute w-100 h-100 md:top-10 md:left-0 md:w-full md:h-full opacity-30 z-0 select-none pointer-events-none">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#292524" /> {/* stone-800 */}
            <stop offset="50%" stopColor="#fbcfe8" /> {/* pink-200 */}
            <stop offset="100%" stopColor="#c084fc" /> {/* purple-400 */}
          </linearGradient>
          <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
        </defs>

        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="300"
          fontFamily="Dancing Script"
          fontWeight="bold"
          fill="url(#grad)"
          filter="url(#blur)"
          style={{ userSelect: "none" }}
        >
          <tspan x="50%" dy="-0.6em">
            Resume
          </tspan>
          <tspan x="50%" dy="1.2em">
            Forge
          </tspan>
        </text>
      </svg>

      {/* Right Image Section */}
      <div className="relative hidden lg:block w-[400px] h-[300px]">
        {images.map((img, index) => (
          <img
            key={index}
            alt={`Template ${index + 1}`}
            src={img}
            draggable="false"
            loading="lazy"
            className="absolute object-cover shadow-lg cursor-grab active:cursor-grabbing transition-transform rounded-2xl"
            style={{
              left: "50%",
              top: "20%",
              transition: scattered ? "transform 0.3s ease-out" : "none",
              transform: `translate(${positions[index].x}px, ${
                positions[index].y
              }px) scale(1) rotate(${index * 5 - 10}deg)`,
              width: "200px",
              zIndex: activeIndex === index ? 10 : 1, // Set higher z-index for active image
            }}
            onMouseDown={(e) => handleCombinedMouseDown(index, e)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
