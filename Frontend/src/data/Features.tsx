import {
  CheckCircle,
  Layout,
  Search,
  ShieldCheck,
  UserPlus,
  PenTool,
} from "lucide-react";
import type { Feature } from "@/types/resumeTemplate";

export const RESUME_FEATURES: Feature[] = [
  {
    icon: <CheckCircle className="w-8 h-8 text-violet-500" />,
    title:
      "ATS-Optimized Templates – Professionally designed resumes that pass Applicant Tracking Systems with ease, ensuring higher chances of landing interviews.",
  },
  {
    icon: <Layout className="w-8 h-8 text-violet-500" />,
    title:
      "Expert-Crafted Templates – Designed by professionals to make a lasting impression with clean aesthetics and readability.",
  },
  {
    icon: <Search className="w-8 h-8 text-violet-500" />,
    title:
      "Keyword Optimization – Enhance your resume with strategic keywords for higher ATS scores and better recruiter visibility.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-violet-500" />,
    title:
      "Data Privacy & Security – Your personal data is protected with advanced encryption and secure storage for complete peace of mind.",
  },
  {
    icon: <UserPlus className="w-8 h-8 text-violet-500" />,
    title:
      "Student & Fresher Friendly – Simplified templates and suggestions tailored for students and freshers entering the professional world.",
  },
  {
    icon: <PenTool className="w-8 h-8 text-violet-500" />,
    title:
      "Easy Editing – Edit your resume directly in Microsoft Word or our builder with guided instructions for quick finalization.",
  },
];
