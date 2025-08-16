import { Input } from "@/components/ui/input";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle, PlusCircle, Trash2 } from "lucide-react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "../../../../../../service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import type { Skills as SkillsType } from "@/types/types";
import { JobAnalysisContext, JobAnalysisDisplay } from "@/forms/JobDescription";

import { useAuth } from "@clerk/clerk-react"; // ✅ Import useAuth for token

interface SkillsProps{
  enableNext: (enabled: boolean) => void;
}

const Skills:React.FC<SkillsProps>=({enableNext})=> {
  const [skills, setSkills] = useState<SkillsType>({
    languages: "",
    tools: "",
    coursework: "",
    other: [],
  });
const { getToken } = useAuth(); //
  const { resumeid } = useParams<{ resumeid: string }>();
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const context = useContext(JobAnalysisContext);
  if (!context) {
    throw new Error(
      "JobAnalysisContext not found. Make sure to wrap in JobAnalysisProvider."
    );
  }
  const jobAnalysis = context?.jobAnalysis;

  // Sync resumeInfo context to local state
  useEffect(() => {
    if (
      resumeInfo?.skills &&
      JSON.stringify(resumeInfo.skills) !== JSON.stringify(skills)
    ) {
      setSkills(resumeInfo.skills as SkillsType);
    }
  }, [resumeInfo, skills]);

  const updateSkills = (updatedSkills: SkillsType) => {
    setSkills(updatedSkills);
    if (resumeInfo) {
      setResumeInfo({ ...resumeInfo, skills: updatedSkills });
    }
  };

  const handleChange = (field: keyof SkillsType, value: string) => {
    const updated = { ...skills, [field]: value };
    updateSkills(updated);
    enableNext(false);
  };

  const handleOtherSkillChange = (index: number, value: string) => {
    const updatedOther = [...skills.other];
    updatedOther[index] = { name: value };
    updateSkills({ ...skills, other: updatedOther });
  };

  const addOtherSkill = () => {
    const safeOther = Array.isArray(skills.other) ? skills.other : [];
    updateSkills({ ...skills, other: [...safeOther, { name: "" }] });
  };

  const removeOtherSkill = (index: number) => {
    const safeOther = Array.isArray(skills.other) ? skills.other : [];
    const updatedOther = safeOther.filter((_, i) => i !== index);
    updateSkills({ ...skills, other: updatedOther });
  };

  const onSave = async () => {
    if (!resumeid) {
      toast.error("Resume ID is missing");
      return;
    }

    setLoading(true);
    const data = {
      data: {
        skills,
      },
    };

    try {
      const token = await getToken();
      if(!token){
        toast("User is not authenticated.");
                setLoading(false);
                return;
      }
      await GlobalApi.UpdateResumeDetails(resumeid, data, token);
      toast.success("Skills updated!");
      enableNext(true);
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Enter your professional and technical skills.</p>

      <div className="space-y-4 mt-4">
        <div>
          <label className="text-sm font-medium">Languages</label>
          <Input
            placeholder="e.g., JavaScript, Python"
            value={skills.languages}
            onChange={(e) => handleChange("languages", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Tools</label>
          <Input
            placeholder="e.g., Git, Docker"
            value={skills.tools}
            onChange={(e) => handleChange("tools", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Coursework</label>
          <Input
            placeholder="e.g., Data Structures, Operating Systems"
            value={skills.coursework}
            onChange={(e) => handleChange("coursework", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Other Skills</label>
          {skills.other?.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <Input
                value={item.name}
                onChange={(e) => handleOtherSkillChange(index, e.target.value)}
                placeholder={`Skill ${index + 1}`}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeOtherSkill(index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addOtherSkill}
            className="mt-1 text-primary"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Other Skill
          </Button>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
      {jobAnalysis && (
        <div className="mt-8 border-t pt-6">
          <JobAnalysisDisplay showMinimized={false} />
        </div>
      )}
    </div>
  );
}

export default Skills;
