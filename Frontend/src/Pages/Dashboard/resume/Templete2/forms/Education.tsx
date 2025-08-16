import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircleIcon, Plus, Trash } from "lucide-react";
import React, { useContext, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../../service/GlobalApi";
import type { Education } from "@/types/types";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { JobAnalysisContext, JobAnalysisDisplay } from "@/forms/JobDescription";

interface EducationsProps {
  enableNext: (enabled: boolean) => void;
}

const Educations: React.FC<EducationsProps> = ({ enableNext }) => {
  const { resumeid } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);
  const { jobAnalysis } = useContext(JobAnalysisContext); //
  const [showAnalysisExpanded, setShowAnalysisExpanded] = useState<boolean>(true); //
  const [educationList, setEducationList] = useState<Education[]>(
    resumeInfo?.education || []
  );

  const { getToken } = useAuth();

  const handleInputChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    enableNext(false);
    const { name, value } = e.target;
    const updated = [...educationList];
    updated[index][name as keyof Education] = value;
    setEducationList(updated);
    setResumeInfo((prev) => (prev ? { ...prev, education: updated } : prev));
  };


  const addEducation = () => {
    setEducationList([
      ...educationList,
      {
        college: "",
        degree: "",
        gpa: "",
        location: "",
        year: "",
        major: "",
        description: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    const updated = educationList.filter((_, i) => i !== index);
    setEducationList(updated);
    setResumeInfo((prev) => (prev ? { ...prev, education: updated } : prev));
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
        education: educationList,
      };
      const response = await GlobalApi.UpdateResumeDetails(
        resumeid,
        updatedResumeInfo,
        token
      );

      console.log("Saved successfully:", response);

      setResumeInfo((prev) =>
        prev ? { ...prev, education: educationList } : prev
      );

      enableNext(true);
      toast("Education details saved successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Error saving education:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleAnalysisView = () => {
    setShowAnalysisExpanded(!showAnalysisExpanded);
  };

  return (
    <div>
      <div className="bg-gradient-to-br from-white to-slate-50 p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Education Details</h2>

        <form onSubmit={onSave}>
          {educationList.map((edu, idx) => (
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
                  onClick={() => removeEducation(idx)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div>
                <label className="text-sm">College</label>
                <Input
                  name="college"
                  value={edu.college}
                  onChange={(e) => handleInputChange(idx, e)}
                  required
                />
              </div>
              <div>
                <label className="text-sm">Degree</label>
                <Input
                  name="degree"
                  value={edu.degree}
                  onChange={(e) => handleInputChange(idx, e)}
                  required
                />
              </div>
              <div>
                <label className="text-sm">GPA</label>
                <Input
                  name="gpa"
                  value={edu.gpa}
                  onChange={(e) => handleInputChange(idx, e)}
                  required
                />
              </div>
              <div>
                <label className="text-sm">Location</label>
                <Input
                  name="location"
                  value={edu.location}
                  onChange={(e) => handleInputChange(idx, e)}
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm">Year</label>
                <Input
                  name="year"
                  value={edu.year}
                  onChange={(e) => handleInputChange(idx, e)}
                  required
                />
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-4">
            <Button type="button" onClick={addEducation} variant="outline">
              <Plus className="h-4 w-4 mr-2" /> Add Education
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircleIcon className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>
      {jobAnalysis && showAnalysisExpanded && (
        <div className="mt-8 border-t pt-6">
          <JobAnalysisDisplay onToggleView={toggleAnalysisView} />
        </div>
      )}

      {jobAnalysis && !showAnalysisExpanded && (
        <div className="text-purple-800 mt-8 border-t pt-6">
          <JobAnalysisDisplay
            showMinimized={true}
            onToggleView={toggleAnalysisView}
          />
        </div>
      )}
    </div>
  );
};

export default Educations;
