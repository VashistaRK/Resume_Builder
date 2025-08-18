import type { JSX } from "react";
import {
  FaBriefcase,
  FaGoogle,
  FaFileWord,
  // FaStar,
  FaPalette,
  FaHeart,
  FaImage,
  FaFilePdf,
  FaLaptopCode,
} from "react-icons/fa";

export interface Category {
  icon: JSX.Element;
  gradient: string;
  border: string;
  sty: string;
  accentColor: string;
  description: string; // ✅ Added description field
}

export const categories: Record<string, Category> = {
  // "Expert Choice": {
  //   icon: <FaStar className="text-yellow-400" />,
  //   gradient:
  //     "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:border-transparent",
  //   border: "text-white border-2",
  //   sty: "",
  //   accentColor: "yellow",
  //   description:
  //     "Handpicked templates by our experts, offering the best balance of design, readability, and impact.",
  // },
  Professional: {
    icon: <FaBriefcase className="text-blue-500" />,
    gradient: "radial-gradient(circle at top left, #bfdbfe, #dbeafe, #eff6ff)",
    border: "border-blue-500",
    sty: "",
    accentColor: "blue",
    description:
      "Clean, corporate-style resumes tailored for business, IT, and formal industry roles.",
  },
  Modern: {
    icon: <FaLaptopCode className="text-orange-500" />,
    gradient:
      "radial-gradient(circle at bottom right, #fed7aa, #ffedd5, #fff7ed)",
    border: "border-orange-500",
    sty: "",
    accentColor: "orange",
    description:
      "Trendy, minimal layouts with a modern aesthetic to stand out in creative and tech industries.",
  },
  Creative: {
    icon: <FaPalette className="text-green-500" />,
    gradient: "radial-gradient(ellipse at center, #bbf7d0, #dcfce7, #f0fdf4)",
    border: "border-green-500",
    sty: "",
    accentColor: "green",
    description:
      "Artistic and unconventional designs ideal for designers, artists, and creative professionals.",
  },
  Simple: {
    icon: <FaHeart className="text-pink-500" />,
    gradient:
      "radial-gradient(circle at bottom left, #fecdd3, #ffe4e6, #fff1f2)",
    border: "border-pink-500",
    sty: "",
    accentColor: "pink",
    description:
      "Minimalist and straightforward templates focusing purely on your content without visual clutter.",
  },
  Picture: {
    icon: <FaImage className="text-purple-500" />,
    gradient: "radial-gradient(circle at top right, #ddd6fe, #e9d5ff, #faf5ff)",
    border: "border-purple-500",
    sty: "",
    accentColor: "purple",
    description:
      "Templates designed to incorporate your professional photo seamlessly for a personal touch.",
  },
  "Google Docs": {
    icon: <FaGoogle className="text-yellow-500" />,
    gradient:
      "radial-gradient(circle at bottom left, #fef08a, #fef9c3, #fefce8)",
    border: "border-yellow-500",
    sty: "",
    accentColor: "yellow",
    description:
      "Templates fully compatible with Google Docs for easy online editing and sharing.",
  },
  CV: {
    icon: <FaFilePdf className="text-blue-500" />,
    gradient: "radial-gradient(circle at center, #93c5fd, #bfdbfe, #e0f2fe)",
    border: "border-blue-500",
    sty: "",
    accentColor: "blue",
    description:
      "Formal Curriculum Vitae layouts suitable for academic, research, and international job applications.",
  },
  "Microsoft Word": {
    icon: <FaFileWord className="text-indigo-500" />,
    gradient: "radial-gradient(circle at center, #c7d2fe, #e0e7ff, #eef2ff)",
    border: "border-indigo-500",
    sty: "",
    accentColor: "indigo",
    description:
      "Templates optimized for Microsoft Word, ensuring smooth editing and formatting on desktop.",
  },
};
