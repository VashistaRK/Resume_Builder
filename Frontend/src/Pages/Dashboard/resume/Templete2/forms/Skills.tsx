import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircleIcon } from "lucide-react";
import React, { useContext, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../../service/GlobalApi";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { JobAnalysisContext, JobAnalysisDisplay } from "@/forms/JobDescription";

interface AdditionalDetailsProps {
  enableNext: (enabled: boolean) => void;
}

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
  enableNext,
}) => {
  const { resumeid } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const context = useContext(JobAnalysisContext);
  if (!context) {
    throw new Error(
      "JobAnalysisContext not found. Make sure to wrap in JobAnalysisProvider."
    );
  }
  const jobAnalysis = context?.jobAnalysis;

  const [technicalSkills, setTechnicalSkills] = useState(
    resumeInfo?.technicalSkills?.join(", ") || ""
  );
  const [academicAchievements, setAcademicAchievements] = useState(
    resumeInfo?.academicAchievements || ""
  );
  const [volunteerExperience, setVolunteerExperience] = useState(
    resumeInfo?.volunteerExperience || ""
  );

  const onSave = async (e: FormEvent) => {
    e.preventDefault();

    if (!resumeid) {
      alert("Missing resume ID");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast("User is not authenticated.");
        setLoading(false);
        return;
      }

      const updatedData = {
        technicalSkills: technicalSkills.split(",").map((s) => s.trim()),
        academicAchievements,
        volunteerExperience,
      };

      // 🔑 Send token with API call
      await GlobalApi.UpdateResumeDetails(resumeid, updatedData, token);

      // ✅ Update context state safely
      setResumeInfo((prev) =>
        prev
          ? {
              ...prev,
              technicalSkills: technicalSkills.split(",").map((s) => s.trim()),
              academicAchievements,
              volunteerExperience,
            }
          : prev
      );

      enableNext(true);
      toast("Additional details saved successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Error saving additional details:",
        error.response?.data || error.message
      );
      toast("Failed to save additional details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-br from-white to-slate-50 p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Additional Details</h2>

        <form onSubmit={onSave}>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="col-span-2">
              <label className="text-sm">
                Technical Skills (comma separated)
              </label>
              <Input
                value={technicalSkills}
                onChange={(e) => {
                  setTechnicalSkills(e.target.value);
                  enableNext(false);
                }}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm">Academic Achievements</label>
              <Input
                value={academicAchievements}
                onChange={(e) => {
                  setAcademicAchievements(e.target.value);
                  enableNext(false);
                }}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm">Volunteer Experience</label>
              <Input
                value={volunteerExperience}
                onChange={(e) => {
                  setVolunteerExperience(e.target.value);
                  enableNext(false);
                }}
                required
              />
            </div>
          </div>

          <div className="flex justify-end mt-5">
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircleIcon className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>
      {jobAnalysis && (
        <div className="mt-8 border-t pt-6">
          <JobAnalysisDisplay showMinimized={false} />
        </div>
      )}
    </div>
  );
};

export default AdditionalDetails;
