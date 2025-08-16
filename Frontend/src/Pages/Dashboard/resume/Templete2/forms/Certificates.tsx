import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircleIcon, Plus, Trash } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../../service/GlobalApi";
import type { Certification } from "@/types/types";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";

import { JobAnalysisContext, JobAnalysisDisplay } from "@/forms/JobDescription";

interface CertificationsProps {
  enableNext: (enabled: boolean) => void;
}

const Certifications: React.FC<CertificationsProps> = ({ enableNext }) => {
  const { resumeid } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);
  const [certificationList, setCertificationList] = useState<Certification[]>(
    resumeInfo?.certifications || []
  );
  const { jobAnalysis } = useContext(JobAnalysisContext);

  const { getToken } = useAuth();
  useEffect(() => {
    setCertificationList(resumeInfo?.certifications || []);
  }, [resumeInfo]);

  const handleInputChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    enableNext(false);
    const { name, value } = e.target;
    const updated = [...certificationList];
    updated[index][name as keyof Certification] = value;
    setCertificationList(updated);
    setResumeInfo((prev) =>
      prev ? { ...prev, certifications: updated } : prev
    );
  };

  const addCertification = () => {
    setCertificationList([
      ...certificationList,
      { name: "", description: "", technologies: "", date: "" },
    ]);
  };

  const removeCertification = (index: number) => {
    const updated = certificationList.filter((_, i) => i !== index);
    setCertificationList(updated);
    setResumeInfo((prev) =>
      prev ? { ...prev, certifications: updated } : prev
    );
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!resumeid) return alert("Missing resume ID");
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast("User is not authenticated.");
        setLoading(false);
        return;
      }

      await GlobalApi.UpdateResumeDetails(
        resumeid,
        { data: { certifications: certificationList } },
        token
      );

      setResumeInfo((prev) =>
        prev ? { ...prev, certifications: certificationList } : prev
      );

      enableNext(true);
      toast("Certification details saved successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Error saving certifications:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white p-5 shadow-lg rounded-lg mt-10">
        <h2 className="font-bold text-lg">Certification Details</h2>

        <form onSubmit={onSave}>
          {certificationList.map((cert, idx) => (
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
                  onClick={() => removeCertification(idx)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              <InputField
                name="name"
                value={cert.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(idx, e)
                }
                label="Name"
                required
              />
              <InputField
                name="description"
                value={cert.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(idx, e)
                }
                label="Description"
                required
              />
              <InputField
                name="technologies"
                value={cert.technologies}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(idx, e)
                }
                label="Technologies"
                required
              />
              <InputField
                name="link"
                placeholder="Link (optional)"
                value={cert.link || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(idx, e)
                }
                label="Link"
              />
              <InputField
                name="date"
                value={cert.date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(idx, e)
                }
                label="Date"
                required
              />
            </div>
          ))}

          <div className="flex justify-between mt-4">
            <Button type="button" onClick={addCertification} variant="outline">
              <Plus className="h-4 w-4 mr-2" /> Add Certification
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InputField = ({ name, value, onChange, label, required }: any) => (
  <div>
    <label className="text-sm">{label}</label>
    <Input name={name} value={value} onChange={onChange} required={required} />
  </div>
);

export default Certifications;
