import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, PlusSquare } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import GlobalApi from "../../../service/GlobalApi";
import { useUser } from "@clerk/clerk-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";

type AddResumeProps = {
  refreshData: () => void;
};

const AddResume = ({refreshData}:AddResumeProps) => {
  const { getToken } = useAuth();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [resumeTitle, setResumeTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && resumeTitle && !loading) {
      onCreate();
    }
  };

  const onCreate = async () => {
  const token = await getToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }
  if (!user) return;

  setLoading(true);

  const resumeId = uuidv4();
  const resumeData = {
    title: resumeTitle,
    resumeid: resumeId,
    userEmail: user?.primaryEmailAddress?.emailAddress,
    userName: user?.fullName ?? undefined,
  };

  try {
    const response = await GlobalApi.CreateNewResume(resumeData, token);
    console.log("Resume created:", response.data);
    setResumeTitle("");
    setOpenDialog(false);
    
    // ✅ Call refresh here after creation
    refreshData();

  } catch (error) {
    console.error("Failed to create resume:", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="text-white">
      <div
        className="p-14 py-24 border flex items-center justify-center bg-stone-400 rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md hover:cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        <PlusSquare />
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Add a title for your new resume.
              <Input
                className="my-3 text-black bg-stone-200"
                placeholder="Ex: Full Stack Resume"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </DialogDescription>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!resumeTitle || loading}
                onClick={onCreate}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Create"}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddResume;
