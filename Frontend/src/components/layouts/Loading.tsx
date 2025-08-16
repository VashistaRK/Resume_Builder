import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const messages = [
  "Success is where preparation and opportunity meet. – Bobby Unser",
  "Keep your resume concise and relevant—one page is ideal!",
  "Recruiters spend an average of 6 seconds scanning a resume!",
  "Use action words like 'developed,' 'led,' and 'achieved' to stand out.",
  "A well-optimized resume can increase interview chances by 40%!",
  "Your resume is your first impression—make it count!",
  "Dream big, work hard, stay focused!",
  "Opportunities don’t happen. You create them. – Chris Grosser",
  "Every job application is a new opportunity. Stay positive!",
  "Customize your resume for each job application for better results!",
  "Highlight skills that match the job description to beat ATS systems.",
  "Use a clean, professional font like Arial or Calibri.",
  "Adding numbers to your resume (like 'Increased sales by 30%') boosts credibility.",
  "Over 75% of resumes are never seen by human recruiters due to ATS filtering!",
  "The first resume was written by Leonardo da Vinci in 1482!",
];

const Loading = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  const panelColors = ["#1a1a1a", "#222", "#2a2a2a", "#333"];

  return (
    <div className="relative h-screen w-screen bg-[#0e0e0e] overflow-hidden">
      {/* Sliding Columns */}
      {panelColors.map((color, index) => (
        <motion.div
          key={index}
          initial={{ y: 0 }}
          animate={{ y: "-100%" }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            delay: index * 0.2,
          }}
          className="absolute top-0 h-full w-1/4"
          style={{
            left: `${index * 25}%`,
            backgroundColor: color,
          }}
        />
      ))}

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10">
        {/* Logo and Dots */}
        <div className="flex items-center space-x-2 text-xl font-semibold">
          <img
            src={`${import.meta.env.BASE_URL}images/logo.png`}
            alt="logo"
            className="h-36 w-auto"
          />
        </div>

        {/* Loading Message */}
        <motion.span
          className="absolute bottom-10 text-lg font-semibold text-center px-4 text-purple-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {message}
        </motion.span>
      </div>
    </div>
  );
};

export default Loading;
