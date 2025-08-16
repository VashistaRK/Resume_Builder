import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircleIcon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../service/GlobalApi";
import type { ResumeInfo } from "@/types/types";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";

interface PersonalDetailsProps {
  enableNext: (enabled: boolean) => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ enableNext }) => {
  const { resumeid } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { getToken } = useAuth();

  const [formData, setFormData] = useState<ResumeInfo>(
    resumeInfo || ({} as ResumeInfo)
  );
  const [loading, setLoading] = useState<boolean>(false);

  // 📝 Update formData whenever resumeInfo changes
  useEffect(() => {
    if (resumeInfo) {
      setFormData(resumeInfo);
    }
  }, [resumeInfo]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    enableNext(false);
    const { name, value } = e.target;

    const updatedData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedData);
    setResumeInfo(updatedData); // ✅ update context on each change
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();

    if (!resumeid) {
      toast("Resume ID is missing.");
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        toast("User is not authenticated.");
        return;
      }

      const allowedKeys = [
        "name",
        "phone",
        "email",
        "address",
        "linkedin",
        "github",
      ];

      // ✅ Filter only allowed keys before sending to backend
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).filter(([key]) => allowedKeys.includes(key))
      ) as ResumeInfo;

      // ✅ Pass cleanedFormData directly if backend expects direct keys
      const response = await GlobalApi.UpdateResumeDetails(
        resumeid,
        cleanedFormData,
        token
      );

      console.log("Saved successfully:", response);
      enableNext(true);
      setResumeInfo((prev) => ({
        ...(prev || {}),
        ...cleanedFormData,
      })); // ✅ Update context
      toast("Details saved successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Error saving personal details:",
        error.response?.data || error.message
      );
      toast("Failed to save personal details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Personal Details</h2>
      <p>Get Started</p>

      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="text-sm">Name</label>
            <Input
              name="name"
              value={formData?.name ?? ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <Input
              name="phone"
              value={formData?.phone ?? ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Email</label>
            <Input
              name="email"
              value={formData?.email ?? ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">LinkedIn</label>
            <Input
              name="linkedin"
              value={formData?.linkedin ?? ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">GitHub</label>
            <Input
              name="github"
              value={formData?.github ?? ""}
              onChange={handleInputChange}
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
  );
};

export default PersonalDetails;
