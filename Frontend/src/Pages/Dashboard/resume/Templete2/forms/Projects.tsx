import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircleIcon, Plus, Trash } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../../service/GlobalApi";
import type { Project } from "@/types/types";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { JobAnalysisContext, JobAnalysisDisplay } from "@/forms/JobDescription";

interface ProjectsProps {
  enableNext: (enabled: boolean) => void;
}

const Projects: React.FC<ProjectsProps> = ({ enableNext }) => {
  const { resumeid } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);
  const [projectsList, setProjectsList] = useState<Project[]>(
    resumeInfo?.projects || []
  );
  const { jobAnalysis } = useContext(JobAnalysisContext);

  const { getToken } = useAuth();

  useEffect(() => {
    setProjectsList(resumeInfo?.projects || []);
  }, [resumeInfo]);

  const handleInputChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    enableNext(false);
    const { name, value } = e.target;
    const updated = [...projectsList];
    updated[index][name as keyof Project] = value;
    setProjectsList(updated);
    setResumeInfo((prev) => (prev ? { ...prev, projects: updated } : prev));
  };

  const addProject = () => {
    setProjectsList([
      ...projectsList,
      {
        name: "",
        description: "",
        role: "",
        technologies: "",
        duration: "",
        link: "",
      },
    ]);
  };

  const removeProject = (index: number) => {
    const updated = projectsList.filter((_, i) => i !== index);
    setProjectsList(updated);
    setResumeInfo((prev) => (prev ? { ...prev, projects: updated } : prev));
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!resumeid) return alert("Missing resume ID");
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast("User is not authenticated");
        setLoading(false);
        return;
      }
      await GlobalApi.UpdateResumeDetails(
        resumeid,
        { data: { projects: projectsList } },
        token
      );
      enableNext(true);
      toast("Projects saved successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Error saving projects:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white p-5 shadow-lg rounded-lg mt-10">
        <h2 className="font-bold text-lg">Projects</h2>

        <form onSubmit={onSave}>
          {projectsList.map((project, idx) => (
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
                  onClick={() => removeProject(idx)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              <InputField
                name="name"
                value={project.name}
                onChange={(e) => handleInputChange(idx, e)}
                label="Name"
                required
              />
              <InputField
                name="description"
                value={project.description}
                onChange={(e) => handleInputChange(idx, e)}
                label="Description"
                required
              />
              <InputField
                name="role"
                value={project.role}
                onChange={(e) => handleInputChange(idx, e)}
                label="Role"
                required
              />
              <InputField
                name="technologies"
                value={project.technologies}
                onChange={(e) => handleInputChange(idx, e)}
                label="Technologies"
                required
              />
              <InputField
                name="duration"
                value={project.duration}
                onChange={(e) => handleInputChange(idx, e)}
                label="Duration"
                required
              />
              <InputField
                name="link"
                value={project.link || ""}
                onChange={(e) => handleInputChange(idx, e)}
                label="Link"
              />
            </div>
          ))}

          <div className="flex justify-between mt-4">
            <Button type="button" onClick={addProject} variant="outline">
              <Plus className="h-4 w-4 mr-2" /> Add Project
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

const InputField = ({
  name,
  value,
  onChange,
  label,
  required,
}: {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
}) => (
  <div>
    <label className="text-sm">{label}</label>
    <Input name={name} value={value} onChange={onChange} required={required} />
  </div>
);

export default Projects;
