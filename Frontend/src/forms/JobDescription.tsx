import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import React, { useContext, useEffect, useState, createContext } from "react";
import type { ChangeEvent } from "react";
/*eslint-disable*/
import {
  Brain,
  LoaderCircle,
  Sparkles,
  CheckCircle,
  Target,
  Lightbulb,
  FileText,
  Search,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { AIChatSession } from "../../service/AIModal";

// Import types from your types file (adjust path as needed)
import type {
  OtherSkills,
  Experience,
  Education,
  Project,
  Certification,
} from "@/types/types";

const jobAnalysisPromptTemplate = `
Analyze this job description and provide:
1. 8-12 key skills/keywords that are important for this role
2. 4-6 key points/achievements that should be highlighted in a resume for this position

Job Description: {jobDescription}

Return JSON format with:
{
  "keywords": ["keyword1", "keyword2", ...],
  "keyPoints": [
    "Achievement/responsibility point 1",
    "Achievement/responsibility point 2",
    ...
  ]
}
`;

interface JobAnalysis {
  keywords: string[];
  keyPoints: string[];
}

interface KeywordItem {
  keyword: string;
  isFound: boolean;
}

interface JobDescriptionProps {
  enableNext: (enabled: boolean) => void;
}

interface JobAnalysisContextType {
  jobAnalysis: JobAnalysis | null;
  setJobAnalysis: (analysis: JobAnalysis | null) => void;
  jobDescription: string;
  setJobDescription: (description: string) => void;
  isAnalyzed: boolean;
  setIsAnalyzed: (analyzed: boolean) => void;
}

// Create a context for persisting job analysis across form steps
export const JobAnalysisContext = createContext<JobAnalysisContextType>({
  jobAnalysis: null,
  setJobAnalysis: () => {},
  jobDescription: "",
  setJobDescription: () => {},
  isAnalyzed: false,
  setIsAnalyzed: () => {},
});

// Provider component that should wrap your entire form
export const JobAnalysisProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);

  return (
    <JobAnalysisContext.Provider
      value={{
        jobAnalysis,
        setJobAnalysis,
        jobDescription,
        setJobDescription,
        isAnalyzed,
        setIsAnalyzed,
      }}
    >
      {children}
    </JobAnalysisContext.Provider>
  );
};

// Enhanced Analysis Display Component that can be used anywhere in the form
export const JobAnalysisDisplay: React.FC<{
  showMinimized?: boolean;
  onToggleView?: () => void;
  className?: string;
}> = ({ showMinimized = false, onToggleView, className = "" }) => {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const { jobAnalysis } = useContext(JobAnalysisContext);
  const [keywordItems, setKeywordItems] = useState<KeywordItem[]>([]);

  // Function to check if keywords exist in resume
  const checkKeywordsInResume = (keywords: string[]): KeywordItem[] => {
    if (!resumeInfo) {
      return keywords.map((k) => ({ keyword: k, isFound: false }));
    }

    const resumeText = [
      resumeInfo.summary || "",
      resumeInfo.jobTitle || "",
      // Experience section
      ...(resumeInfo.experience || []).map((exp: Experience) =>
        [
          exp.position || "",
          exp.company || "",
          (exp.responsibilities || []).join(" "),
          exp.location || "",
          exp.duration || "",
        ].join(" ")
      ),
      // Education section
      ...(resumeInfo.education || []).map((edu: Education) =>
        [
          edu.degree || "",
          edu.major || "",
          edu.college || "",
          edu.description || "",
          edu.gpa || "",
          edu.location || "",
          edu.year || "",
        ].join(" ")
      ),
      // Skills section - combining all skill fields
      resumeInfo.skills?.languages || "",
      resumeInfo.skills?.tools || "",
      resumeInfo.skills?.coursework || "",
      ...(resumeInfo.skills?.other || []).map((other: OtherSkills) => [
        other.name || "",
      ]),
      // Projects section
      ...(resumeInfo.projects || []).map((project: Project) =>
        [
          project.name || "",
          project.description || "",
          project.role || "",
          project.technologies || "",
          project.duration || "",
          project.link || "",
        ].join(" ")
      ),
      // Certifications section
      ...(resumeInfo.certifications || []).map((cert: Certification) =>
        [
          cert.name || "",
          cert.description || "",
          cert.technologies || "",
          cert.date || "",
          cert.link || "",
        ].join(" ")
      ),
      // Technical skills
      ...(resumeInfo.technicalSkills || []),
      // Other sections
      resumeInfo.academicAchievements || "",
      resumeInfo.volunteerExperience || "",
    ]
      .join(" ")
      .toLowerCase();

    return keywords.map((keyword) => ({
      keyword,
      isFound: resumeText.includes(keyword.toLowerCase()),
    }));
  };

  // Update keyword checking whenever resume info changes
  useEffect(() => {
    if (jobAnalysis && jobAnalysis.keywords) {
      const updatedKeywords = checkKeywordsInResume(jobAnalysis.keywords);
      setKeywordItems(updatedKeywords);
    }
  }, [resumeInfo, jobAnalysis]);

  const copyKeyword = async (text: string) => {
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success(`"${text}" copied to clipboard!`, {
          duration: 2000,
        });
        return;
      } catch (err) {
        console.error("Clipboard API failed:", err);
      }
    }

    // Fallback: create temporary textarea
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      toast.success(`"${text}" copied to clipboard!`, {
        duration: 2000,
      });
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }
    document.body.removeChild(textarea);
  };

  const foundKeywordsCount = keywordItems.filter((item) => item.isFound).length;
  const totalKeywords = keywordItems.length;
  const completionPercentage =
    totalKeywords > 0
      ? Math.round((foundKeywordsCount / totalKeywords) * 100)
      : 0;

  if (!jobAnalysis) return null;

  if (showMinimized) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <div className="bg-white shadow-xl rounded-lg border border-gray-200 p-4 max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Job Match</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {completionPercentage}%
              </span>
              {onToggleView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleView}
                  className="h-6 w-6 p-0"
                >
                  <Eye className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-600">
            {foundKeywordsCount} of {totalKeywords} keywords found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Keywords Section */}
      <div className="p-6 shadow-lg rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg text-gray-800">
              Key Skills & Keywords
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {foundKeywordsCount} of {totalKeywords} found (
              {completionPercentage}%)
            </div>
            {onToggleView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleView}
                className="h-8 w-8 p-0"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {keywordItems.map((item, index) => (
            <div
              key={index}
              onClick={() => copyKeyword(item.keyword)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                item.isFound
                  ? "bg-green-50 border border-green-200 hover:bg-green-100"
                  : "bg-red-50 border border-red-200 hover:bg-red-100"
              }`}
            >
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  item.isFound
                    ? "bg-green-500 border-green-500"
                    : "border-red-300 bg-white"
                }`}
              >
                {item.isFound && <CheckCircle className="h-3 w-3 text-white" />}
              </div>
              <span
                className={`text-sm font-medium ${
                  item.isFound ? "text-green-800" : "text-red-700"
                }`}
              >
                {item.keyword}
              </span>
              <span className="text-xs text-gray-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                Click to copy
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>Tip:</strong>{" "}
              {foundKeywordsCount < totalKeywords
                ? `Add missing keywords (marked in red) to your resume to improve your match score. Click any keyword to copy it.`
                : `Great job! You've included all key keywords in your resume.`}
            </div>
          </div>
        </div>
      </div>

      {/* Key Points Section */}
      <div className="p-6 shadow-lg rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-lg text-gray-800">
            Key Points to Highlight
          </h3>
        </div>

        <div className="space-y-3">
          {jobAnalysis.keyPoints.map((point, index) => (
            <div
              key={index}
              onClick={() => {
                navigator.clipboard.writeText(point);
                toast.success("Key point copied to clipboard!", {
                  duration: 2000,
                });
              }}
              className="group p-4 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors">
                  {point}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 ml-9">
                <span className="text-xs text-gray-500">
                  Click to copy this point
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
            <div className="text-sm text-purple-800">
              <strong>Suggestion:</strong> Use these points as inspiration to
              craft powerful bullet points in your experience section. Click any
              point to copy it.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobDescription: React.FC<JobDescriptionProps> = ({ enableNext }) => {
  //   const { resumeid } = useParams();
  //   const { resumeInfo } = useContext(ResumeInfoContext);
  const {
    jobAnalysis,
    setJobAnalysis,
    jobDescription,
    setJobDescription,
    isAnalyzed,
    setIsAnalyzed,
  } = useContext(JobAnalysisContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [showAnalysisExpanded, setShowAnalysisExpanded] =
    useState<boolean>(false);

  // Set enableNext based on existing analysis when component mounts
  useEffect(() => {
    if (jobAnalysis && isAnalyzed) {
      enableNext(true);
      setShowAnalysisExpanded(true);
    }
  }, [jobAnalysis, isAnalyzed, enableNext]);

  const analyzeJobDescription = async (): Promise<void> => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description first");
      return;
    }

    setLoading(true);
    try {
      const prompt = jobAnalysisPromptTemplate.replace(
        "{jobDescription}",
        jobDescription
      );
      const result = await AIChatSession.sendMessage(prompt);
      const jsonString = await result.response.text();

      // Clean the response if it contains markdown formatting
      const cleanedJsonString = jsonString
        .replace(/```json\n?|\n?```/g, "")
        .trim();

      const parsed: JobAnalysis = JSON.parse(cleanedJsonString);

      if (
        !parsed.keywords ||
        !parsed.keyPoints ||
        !Array.isArray(parsed.keywords) ||
        !Array.isArray(parsed.keyPoints)
      ) {
        throw new Error("Invalid AI response format");
      }

      setJobAnalysis(parsed);
      setIsAnalyzed(true);
      setShowAnalysisExpanded(true);

      toast.success("Job description analyzed successfully!", {
        icon: <Brain className="h-4 w-4" />,
      });
      enableNext(true);
    } catch (error) {
      console.error("Job analysis failed", error);
      toast.error(
        "Analysis failed. Please try again or check your job description."
      );
      setJobAnalysis(null);
      setIsAnalyzed(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
    // Reset analysis when job description changes significantly
    if (
      jobAnalysis &&
      Math.abs(e.target.value.length - jobDescription.length) > 50
    ) {
      setJobAnalysis(null);
      setIsAnalyzed(false);
      enableNext(false);
      setShowAnalysisExpanded(false);
    }
  };

  const toggleAnalysisView = () => {
    setShowAnalysisExpanded(!showAnalysisExpanded);
  };

  return (
    <div className="space-y-6 mt-10">
      <div className="p-6 shadow-lg rounded-lg border-t-primary border-t-4 bg-gradient-to-br from-white to-slate-50">
        <div className="mb-6">
          <h2 className="font-bold text-xl text-gray-800 mb-2">
            Job Description Analysis
          </h2>
          <p className="text-gray-600">
            Paste the job description to get AI-powered insights on key skills
            and points to highlight in your resume
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">
              Job Description
            </label>
            <Button
              onClick={analyzeJobDescription}
              type="button"
              size="sm"
              disabled={loading || !jobDescription.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {loading ? (
                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {jobAnalysis ? "Re-analyze" : "Analyze with AI"}
            </Button>
          </div>

          <Textarea
            placeholder="Paste the job description here. Include responsibilities, requirements, preferred skills, and qualifications..."
            className="min-h-[150px] resize-none border-2 focus:border-primary transition-colors"
            value={jobDescription}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {jobAnalysis && showAnalysisExpanded && (
        <div className="text-purple-800">
          <JobAnalysisDisplay onToggleView={toggleAnalysisView} />
        </div>
      )}

      {jobAnalysis && !showAnalysisExpanded && (
        <div className="text-purple-800">
          <JobAnalysisDisplay
            showMinimized={true}
            onToggleView={toggleAnalysisView}
          />
        </div>
      )}

      {!jobAnalysis && !loading && jobDescription && (
        <div className="text-center py-8 text-gray-500">
          <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            Click "Analyze with AI" button above to get insights from your job
            description.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobDescription;
