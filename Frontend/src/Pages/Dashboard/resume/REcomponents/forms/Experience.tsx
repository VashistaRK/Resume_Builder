import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState, Suspense } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../../service/GlobalApi";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import type { Experience as ExperienceType } from "@/types/types";
import type { FormEvent } from "react";
import { JobAnalysisContext, JobAnalysisDisplay } from "@/forms/JobDescription";
import { useAuth } from "@clerk/clerk-react"; // ✅ Import useAuth for token
/*eslint-disable*/
// Lazy load the heavy component
const RichTextEditor = React.lazy(() => import("../RichTextEditor"));

const defaultFormField: ExperienceType = {
  id: "",
  position: "",
  company: "",
  location: "",
  duration: "",
  responsibilities: [],
};

interface ExperienceProps {
  enableNext: (enabled: boolean) => void;
}

const Experience: React.FC<ExperienceProps> = ({ enableNext }) => {
  const [experienceList, setExperienceList] = useState<ExperienceType[]>([]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { resumeid } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const { getToken } = useAuth(); //

  // 🔐 SAFE CONTEXT ACCESS
  const jobCtx = useContext(JobAnalysisContext);
  const jobAnalysis = jobCtx?.jobAnalysis;

  useEffect(() => {
    if (resumeInfo?.experience?.length) {
      setExperienceList(resumeInfo.experience);
    }
  }, [resumeInfo?.experience]);

  const updateResumeInfo = (updatedList: ExperienceType[]) => {
    if (resumeInfo) {
      setResumeInfo({
        ...resumeInfo,
        experience: updatedList,
      });
    }
  };

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const updatedList = [...experienceList];
    if (name === "responsibilities") {
      updatedList[index].responsibilities = value.split("\n");
    } else {
      (updatedList[index] as any)[name] = value;
    }
    enableNext(false);
    setExperienceList(updatedList);
    updateResumeInfo(updatedList);
  };

  const addNewExperience = () => {
    const updatedList = [...experienceList, { ...defaultFormField }];
    setExperienceList(updatedList);
    updateResumeInfo(updatedList);
  };

  const removeExperience = async () => {
    if (experienceList.length === 0) return;

    const updatedList = experienceList.slice(0, -1);
    setExperienceList(updatedList);
    updateResumeInfo(updatedList);

    if (!resumeid) return;

    try {
      const token = await getToken();
      if (token) {
        await GlobalApi.UpdateResumeDetails(
          resumeid,
          { data: { experience: updatedList } },
          token
        );
        toast.success("Experience removed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove experience");
    }
  };

  // handleRichTextEditor
  const handleRichTextEditor = (
    value: string,
    name: keyof ExperienceType,
    index: number
  ) => {
    const updatedList = [...experienceList];

    if (name === "responsibilities") {
      updatedList[index].responsibilities = value.split("\n");
    } else {
      updatedList[index][name] = value as never;
    }

    setExperienceList(updatedList);
    updateResumeInfo(updatedList);
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();

    if (!resumeid) {
      toast.error("Resume ID is missing");
      return;
    }

    setLoading(true);

    const data = {
      data: {
        experience: experienceList,
      },
    };
    try {
      const token = await getToken(); // ✅ Get token

      if (!token) {
        toast("User is not authenticated.");
        setLoading(false);
        return;
      }
      await GlobalApi.UpdateResumeDetails(resumeid, data, token);
      setLoading(false);
      toast.success("Details updated!");
      enableNext(true);
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("Failed to update experience");
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Professional Experience</h2>
      <p>Add your previous job experience.</p>
      {experienceList.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg"
        >
          <div>
            <label className="text-xs">Position Title</label>
            <Input
              name="position"
              onChange={(e) => handleChange(index, e)}
              value={item.position}
            />
          </div>
          <div>
            <label className="text-xs">Company Name</label>
            <Input
              name="company"
              onChange={(e) => handleChange(index, e)}
              value={item.company}
            />
          </div>
          <div>
            <label className="text-xs">City</label>
            <Input
              name="location"
              onChange={(e) => handleChange(index, e)}
              value={item.location}
            />
          </div>
          <div>
            <label className="text-xs">End Date</label>
            <Input
              name="duration"
              onChange={(e) => handleChange(index, e)}
              value={item.duration}
            />
          </div>
          <div className="col-span-2">
            <Suspense fallback={<div>Loading editor...</div>}>
              <RichTextEditor
                index={index}
                defaultValue={item.responsibilities.join("\n")}
                onRichTextEditorChange={(value) =>
                  handleRichTextEditor(value, "responsibilities", index)
                }
              />
            </Suspense>
          </div>
        </div>
      ))}
      <div className="flex justify-between gap-2">
        <div className="flex gap-2 flex-col md:flex-row">
          <Button
            variant="outline"
            onClick={addNewExperience}
            className="text-primary w-40"
          >
            + Add More Experience
          </Button>
          <Button
            variant="outline"
            onClick={removeExperience}
            className="text-primary"
          >
            - Remove
          </Button>
        </div>
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
};

export default Experience;
