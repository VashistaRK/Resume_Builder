import { Loader2Icon, MoreVertical, Notebook } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import GlobalApi from "./../../../service/GlobalApi";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";

type ResumeItemProps = {
  resume: {
    _id: string;
    title: string;
    themeColor: string;
  };
  refreshData: () => void;
};

function ResumeItem({ resume, refreshData }: ResumeItemProps) {
  const navigation = useNavigate();
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState(resume.title);
  const { getToken } = useAuth();

  const onDelete = async () => {
    setLoading(true);
    const token = await getToken();
    if (!token) {
      toast("User is not authenticated.");
      setLoading(false);
      return;
    }

    GlobalApi.DeleteResumeById(resume._id, token)
      .then(() => {
        toast("Resume Deleted!");
        refreshData();
        setOpenDeleteAlert(false);
      })
      .catch((error) => {
        console.error(error);
        toast("Failed to delete resume.");
      })
      .finally(() => setLoading(false));
  };

  const onRename = async () => {
    if (!newTitle.trim()) {
      toast("Title cannot be empty.");
      return;
    }

    setLoading(true);
    const token = await getToken();
    if (!token) {
      toast("User is not authenticated.");
      setLoading(false);
      return;
    }

    GlobalApi.UpdateResumeDetails(resume._id, { title: newTitle.trim() }, token)
      .then(() => {
        toast("Resume renamed!");
        refreshData();
        setOpenRenameDialog(false);
      })
      .catch((err) => {
        console.error("Rename failed:", err);
        toast("Failed to rename resume.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="rounded-lg shadow-md overflow-hidden">
      <Link to={`/dashboard/resume/${resume._id}/edit`}>
        <div
          className="flex items-center justify-center p-20 bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200"
          style={{ borderTop: `4px solid ${resume.themeColor}` }}
        >
          <Notebook size={40} className="text-stone-700" />
        </div>
      </Link>

      <div className="bg-gray-500 p-3 flex justify-between items-center border-t border-gray-500">
        <h2 className="text-sm font-medium text-white">{resume.title}</h2>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-5 w-5 text-white hover:text-gray-800 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-500 text-gray-800 border border-gray-600 shadow-lg rounded-md">
            <DropdownMenuItem onClick={() => setOpenRenameDialog(true)}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigation(`/dashboard/resume/${resume._id}/edit`)
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigation(`/my-resume/${resume._id}/view`)
              }
            >
              View / Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenDeleteAlert(true)} className="text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteAlert} onOpenChange={setOpenDeleteAlert}>
        <AlertDialogContent className="bg-white text-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete your resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
              {loading ? <Loader2Icon className="animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <AlertDialog open={openRenameDialog} onOpenChange={setOpenRenameDialog}>
        <AlertDialogContent className="bg-white text-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Rename Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new name for your resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mt-3 border border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onRename} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
              {loading ? <Loader2Icon className="animate-spin" /> : "Rename"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ResumeItem;
