import {
  Network,
  Rocket,
  Briefcase,
} from "lucide-react";
import type { JSX } from "react";
export interface Future{
    icon: JSX.Element;
    title: string;
    description: string;
}
export const ATS_FEATURES :Future[] = [
  {
    icon: <Briefcase className="text-purple-600" />,
    title: "Company-specific resumes",
    description:
      "Our AI technology analyzes job descriptions and company culture to create tailored resumes that speak directly to each employer's unique requirements and values. The system automatically adjusts tone, keywords, and formatting to match the specific industry standards and company preferences, significantly increasing your chances of getting noticed by hiring managers.",
  },
  {
    icon: <Network className="text-purple-600" />,
    title: "Full experience section parsing",
    description:
      "Advanced parsing algorithms intelligently extract and reorganize your work history, automatically identifying key achievements, quantifying accomplishments, and restructuring content for maximum impact. The system recognizes patterns in your career progression and highlights transferable skills while ensuring chronological accuracy and professional formatting across all experience entries",
  },
  {
    icon: <Rocket className=" text-purple-600" />,
    title: "Optimized skills section",
    description:
      "Machine learning algorithms strategically position and prioritize your technical and soft skills based on job requirements, ensuring ATS compatibility while maintaining readability for human recruiters. The system automatically suggests relevant skills from your experience, removes outdated technologies, and organizes competencies in order of relevance to create a compelling skills profile that matches employer expectations.RetryClaude can make mistakes. Please double-check responses.",
  },
];