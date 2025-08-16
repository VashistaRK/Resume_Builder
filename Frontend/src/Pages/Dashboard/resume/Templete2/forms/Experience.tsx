import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircleIcon, Plus, Trash } from "lucide-react";
import React, { useContext, useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../../service/GlobalApi";
import type { Experience as ExperienceType } from "@/types/types";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import {
  JobAnalysisContext,
  JobAnalysisDisplay,
} from "../../../../../forms/JobDescription";

interface ExperienceProps {
  enableNext: (enabled: boolean) => void;
}

const Experience: React.FC<ExperienceProps> = ({ enableNext }) => {
  const { resumeid } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);
  const [experienceList, setExperienceList] = useState<ExperienceType[]>(
    resumeInfo?.experience || []
  );
  const jobCtx = useContext(JobAnalysisContext);
  const jobAnalysis = jobCtx?.jobAnalysis;

  const { getToken } = useAuth();

  useEffect(() => {
    setExperienceList(resumeInfo?.experience || []);
  }, [resumeInfo]);

  const handleInputChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    enableNext(false);
    const { name, value } = e.target;
    const updated = [...experienceList];

    if (name === "responsibilities") {
      // If responsibilities is a string[], convert input string to array
      updated[index].responsibilities = value.split(",").map((s) => s.trim());
    } else {
      // For all other fields (string types)
      updated[index][name as keyof Omit<ExperienceType, "responsibilities">] =
        value;
    }

    setExperienceList(updated);
    setResumeInfo((prev) => (prev ? { ...prev, experience: updated } : prev));
  };

  const addExperience = () => {
    setExperienceList([
      ...experienceList,
      {
        position: "",
        company: "",
        responsibilities: [],
        location: "",
        duration: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    const updated = experienceList.filter((_, i) => i !== index);
    setExperienceList(updated);
    setResumeInfo((prev) => (prev ? { ...prev, experience: updated } : prev));
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!resumeid) return alert("Missing resume ID");
    setLoading(true);
    try {
      const token = await getToken(); // ✅ Get token

      if (!token) {
        toast("User is not authenticated.");
        setLoading(false);
        return;
      }
      const updatedResumeInfo = {
        ...(resumeInfo || {}),
        experience: experienceList,
      };
      await GlobalApi.UpdateResumeDetails(resumeid, updatedResumeInfo, token);
      setResumeInfo((prev) =>
        prev ? { ...prev, experience: experienceList } : prev
      );
      enableNext(true);
      toast("Experience details saved successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Error saving experience:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-br from-white to-slate-50 p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Experience Details</h2>

        <form onSubmit={onSave}>
          {experienceList.map((exp, idx) => (
            <div
              key={idx}
              className="grid grid-cols-2 gap-3 mt-3 border p-3 rounded"
            >
              <div className="col-span-2 flex justify-between items-center">
                <p className="font-semibold">Entry {idx + 1}</p>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeExperience(idx)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              <div>
                <label className="text-sm">Position</label>
                <Input
                  name="position"
                  value={exp.position}
                  onChange={(e) => handleInputChange(idx, e)}
                  required
                />
              </div>

              <div>
                <label className="text-sm">Company</label>
                <Input
                  name="company"
                  value={exp.company}
                  onChange={(e) => handleInputChange(idx, e)}
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm">
                  Responsibilities (comma separated)
                </label>
                <Input
                  name="responsibilities"
                  value={exp.responsibilities.join(", ")}
                  onChange={(e) => handleInputChange(idx, e)}
                  required
                />
              </div>

              <div>
                <label className="text-sm">Location</label>
                <Input
                  name="location"
                  value={exp.location}
                  onChange={(e) => handleInputChange(idx, e)}
                  required
                />
              </div>

              <div>
                <label className="text-sm">Duration</label>
                <Input
                  name="duration"
                  value={exp.duration}
                  onChange={(e) => handleInputChange(idx, e)}
                  required
                />
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-4">
            <Button type="button" onClick={addExperience} variant="outline">
              <Plus className="h-4 w-4 mr-2" /> Add Experience
            </Button>
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

export default Experience;
