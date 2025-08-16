import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useContext, useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../../service/GlobalApi";
import { Brain, LoaderCircle, Sparkles, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { AIChatSession } from "../../../../../../service/AIModal";
import { JobAnalysisContext, JobAnalysisDisplay } from "@/forms/JobDescription";
/*eslint-disable*/

import { useAuth } from "@clerk/clerk-react"; // ✅ Import useAuth for token

const promptTemplate =
  "Job Title: {jobTitle}, Based on job title give me a list of summaries for 3 experience levels - Mid Level, Fresher, and Senior - in 3-4 lines, as an array. Return JSON format with 'summary' and 'experience_level' fields. The experience_level field should contain only one fresher, one mid level and one senior level.";

interface SummarySuggestion {
  summary: string;
  experience_level: string;
}

interface SummaryProps {
  enableNext: (enabled: boolean) => void;
}

const Summary: React.FC<SummaryProps> = ({ enableNext }) => {
  const { resumeid } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { jobAnalysis } = useContext(JobAnalysisContext); /////

  const [summary, setSummary] = useState<string>(resumeInfo?.summary || "");
  const [jobTitle, setJobTitle] = useState<string>(resumeInfo?.jobTitle || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [titleLoading, setTitleLoading] = useState<boolean>(false);
  const [aiGeneratedSummaryList, setAiGeneratedSummaryList] = useState<
    SummarySuggestion[]
  >([]);

  const { getToken } = useAuth(); //

  useEffect(() => {
    if (resumeInfo?.summary) {
      setSummary(resumeInfo.summary);
    }
    if (resumeInfo?.jobTitle) {
      setJobTitle(resumeInfo.jobTitle);
    }
  }, [resumeInfo]);

  const promptForJobTitle = (isChanging = false) => {
    let tempTitle = jobTitle; // Pre-fill with current title when changing

    toast.dismiss();
    toast(
      () => (
        <div className="space-y-3 p-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">
              {isChanging ? "Update Your Job Title" : "Enter Your Job Title"}
            </p>
          </div>
          <Textarea
            placeholder="e.g. Frontend Developer, Data Scientist, Product Manager"
            className="min-h-[60px] resize-none"
            defaultValue={isChanging ? jobTitle : ""}
            autoFocus
            onChange={(e) => {
              tempTitle = e.target.value;
            }}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const trimmedTitle = tempTitle.trim();

                if (trimmedTitle.length < 2) {
                  toast.dismiss();
                  toast.error(
                    "Please enter a valid job title (at least 2 characters)"
                  );
                  return;
                }

                if (isChanging && trimmedTitle === jobTitle) {
                  toast.dismiss();
                  toast.info("Job title unchanged");
                  return;
                }

                toast.dismiss();
                await handleJobTitleSubmission(trimmedTitle, isChanging);
              }
            }}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Press Enter to continue
            </p>
            <div className="flex gap-2">
              {isChanging && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toast.dismiss()}
                  className="h-7 px-3 text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </Button>
              )}
              <Button
                size="sm"
                onClick={async () => {
                  const trimmedTitle = tempTitle.trim();

                  if (trimmedTitle.length < 2) {
                    toast.error("Please enter a valid job title");
                    return;
                  }

                  if (isChanging && trimmedTitle === jobTitle) {
                    toast.dismiss();
                    toast.info("Job title unchanged");
                    return;
                  }

                  toast.dismiss();
                  await handleJobTitleSubmission(trimmedTitle, isChanging);
                }}
                className="h-7 px-3"
              >
                {titleLoading ? (
                  <LoaderCircle className="h-3 w-3 animate-spin" />
                ) : isChanging ? (
                  "Update"
                ) : (
                  "Add"
                )}
              </Button>
            </div>
          </div>
        </div>
      ),
      {
        duration: 30000,
        dismissible: true,
        className: "w-80",
      }
    );
  };

  const handleJobTitleSubmission = async (
    newTitle: string,
    isChanging = false
  ) => {
    if (!newTitle || titleLoading) return;

    setTitleLoading(true);

    try {
      // Just save the job title, no auto-generation
      await saveJobTitle(newTitle);

      toast.success(
        isChanging
          ? "Job title updated successfully!"
          : "Job title saved successfully!",
        {
          duration: 3000,
          icon: <CheckCircle className="h-4 w-4" />,
        }
      );
    } catch (error) {
      console.error("Error in job title submission:", error);
      toast.error(
        isChanging
          ? "Failed to update job title. Please try again."
          : "Failed to save job title. Please try again."
      );
    } finally {
      setTitleLoading(false);
    }
  };

  const saveJobTitle = async (newTitle: string): Promise<void> => {
    if (!resumeid) {
      throw new Error("Resume ID is missing");
    }

    try {
      const token = await getToken(); // ✅ Get token

      if (!token) {
        toast("User is not authenticated.");
        setLoading(false);
        return;
      }
      await GlobalApi.UpdateResumeDetails(
        resumeid,
        {
          data: { jobTitle: newTitle },
        },
        token
      );

      // Update state
      setResumeInfo((prev: any) =>
        prev ? { ...prev, jobTitle: newTitle } : null
      );
      setJobTitle(newTitle);
    } catch (error) {
      console.error("Failed to update job title:", error);
      throw new Error("Failed to save job title");
    }
  };

  const generateSummaryFromAI = async (): Promise<void> => {
    if (!jobTitle.trim()) {
      toast.error("Job title is required for AI generation");
      return;
    }

    setLoading(true);

    try {
      const prompt = promptTemplate.replace("{jobTitle}", jobTitle);
      const result = await AIChatSession.sendMessage(prompt);

      if (!result?.response?.text) {
        throw new Error("No response from AI service");
      }

      const rawText = await result.response.text();
      console.log("AI Raw Response:", rawText);

      // Extract JSON even if there’s markdown, explanations, etc.
      const match = rawText.match(/\[.*?\]/s); // non-greedy multiline array match
      if (!match) {
        throw new Error("Could not extract JSON array from AI response");
      }

      const cleanedJsonString = match[0]; // the JSON array

      const parsed: SummarySuggestion[] = JSON.parse(cleanedJsonString);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Invalid AI response format");
      }

      setAiGeneratedSummaryList(parsed);
      toast.success("AI suggestions generated successfully!", {
        icon: <Brain className="h-4 w-4" />,
      });
    } catch (error: any) {
      console.error("AI summary generation failed:", error);
      toast.error(
        error?.message ||
          "AI generation failed. Please try again or check your job title."
      );
      setAiGeneratedSummaryList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    enableNext(false);
    const newSummary = e.target.value;
    setSummary(newSummary);
    // Update context but don't save to database
    setResumeInfo((prev: any) =>
      prev ? { ...prev, summary: newSummary } : null
    );
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();

    if (!summary.trim()) {
      toast.error("Please enter a summary before saving");
      return;
    }

    if (!resumeid) {
      toast.error(
        "Resume ID is missing. Please access this page through the resume editor."
      );
      return;
    }

    setLoading(true);
    try {
      const token = await getToken(); // ✅ Get token

      if (!token) {
        toast("User is not authenticated.");
        setLoading(false);
        return;
      }
      await GlobalApi.UpdateResumeDetails(
        resumeid,
        {
          data: { summary: summary.trim() },
        },
        token
      );

      setResumeInfo((prev: any) =>
        prev ? { ...prev, summary: summary.trim() } : null
      );
      toast.success("Summary saved successfully!", {
        icon: <CheckCircle className="h-4 w-4" />,
      });
      enableNext(true);
    } catch (error) {
      console.error("Error saving summary:", error);
      toast.error("Failed to save summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (item: SummarySuggestion) => {
    const selected = item.summary;
    setSummary(selected);
    // Update context but don't auto-save
    setResumeInfo((prev: any) =>
      prev ? { ...prev, summary: selected } : null
    );
    toast.info("Summary selected. Click 'Save Summary' to save changes.");
  };

  return (
    <div className="space-y-6 mt-10">
      <div className="p-6 shadow-lg rounded-lg border-t-primary border-t-4 bg-gradient-to-br from-white to-slate-50">
        <div className="mb-6">
          <h2 className="font-bold text-xl text-gray-800 mb-2">
            Professional Summary
          </h2>
          <p className="text-gray-600">
            Add a compelling summary that highlights your expertise and career
            objectives
          </p>
          {jobTitle && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
              <span className="text-sm font-medium text-primary">
                Current Title:
              </span>
              <span className="text-sm text-gray-700">{jobTitle}</span>
            </div>
          )}
        </div>

        <form className="space-y-4" onSubmit={onSave}>
          <div className="flex justify-between items-center flex-col md:flex-row">
            <label className="text-sm font-medium text-gray-700">
              Summary Content
            </label>
            <div className="flex items-center gap-2 flex-col md:flex-row">
              <Button
                size="sm"
                onClick={() => promptForJobTitle(!!jobTitle)}
                type="button"
                disabled={titleLoading}
                variant={jobTitle ? "outline" : "default"}
                className={
                  jobTitle
                    ? "border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-all duration-200"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                }
              >
                {titleLoading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    {jobTitle ? "Change Title" : "Add Job Title"}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (!jobTitle.trim()) {
                    toast.error(
                      "Please add a job title first to generate AI suggestions"
                    );
                    promptForJobTitle(false);
                  } else {
                    generateSummaryFromAI();
                  }
                }}
                type="button"
                size="sm"
                disabled={loading || titleLoading}
                className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
              >
                {loading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                Generate with AI
              </Button>
            </div>
          </div>

          <Textarea
            placeholder="Write a compelling professional summary that showcases your skills, experience, and career goals..."
            className="min-h-[120px] resize-none border-2 focus:border-primary transition-colors"
            required
            value={summary}
            onChange={handleInputChange}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading || !summary.trim()}
              className="bg-primary px-6"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin h-4 w-4 mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Summary
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummaryList.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg text-gray-800">
              AI-Generated Suggestions
            </h2>
          </div>
          <div className="grid gap-4">
            {aiGeneratedSummaryList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(item)}
                className="group p-5 shadow-md hover:shadow-lg rounded-lg cursor-pointer border border-gray-200 hover:border-primary/50 transition-all duration-300 bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {item.experience_level} Level
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-gray-500">
                      Click to select this summary
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {aiGeneratedSummaryList.length === 0 && !loading && jobTitle && (
        <div className="text-center py-8 text-gray-500">
          <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            Click "Generate with AI" button above to get AI-powered summary
            suggestions.
          </p>
        </div>
      )}
      {jobAnalysis && (
        <div className="mt-8 border-t pt-6">
          <JobAnalysisDisplay showMinimized={false} />
        </div>
      )}
    </div>
  );
};

export default Summary;
