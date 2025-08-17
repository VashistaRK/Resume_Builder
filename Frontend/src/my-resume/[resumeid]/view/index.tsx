import Header from "@/components/layouts/Header";
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GlobalApi from "../../../../service/GlobalApi";
import type { ResumeInfo } from "@/types/types";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

import PreviewSection from "@/Pages/Dashboard/resume/REcomponents/PreviewSection";
import ResumeTemlete from "@/Pages/Dashboard/resume/Templete2/ResumeTemplete";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null);
  const [template, setTemplate] = useState<string>();
  const { resumeid } = useParams<{ resumeid: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
  if (resumeid) fetchResumeInfo(resumeid);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [resumeid]);

const fetchResumeInfo = async (id: string) => {
  try {
    const token = await getToken();
    if (!token) {
      toast.error("Not authorized");
      return;
    }

    // GlobalApi.GetResumeById already returns the data directly
    const data = await GlobalApi.GetResumeById(id, token);

    if (!data) {
      toast.error("Resume not found.");
      return;
    }

    setTemplate(data.template || 1);
    setResumeInfo(data);
  } catch (error) {
    console.error("Failed to fetch resume info:", error);
    toast.error("Failed to load resume.");
  }
};


  const HandleDownload = () => window.print();

  const renderPreviewSection = () => {
    switch (template) {
      case "2":
        return <ResumeTemlete />;
      case "1":
      default:
        return <PreviewSection />;
    }
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print" className="bg-[#B0A89F] text-black">
        <Header />
        <div className="mx-10 md:mx-20 flex flex-col gap-4 py-10 font-Quick justify-center items-center">
          <h2 className="text-center text-2xl font-medium">
            Congrats! Your Ultimate ATS score Resume is ready!
          </h2>
          <p className="text-center">
            Now you are ready to download your resume and share your unique Identity.
          </p>
          <p className="font-semibold text-red-900 text-center mb-3">
            <span className="text-black font-bold">&#8595; NOTE &#8595;</span><br />
            If your resume exceeds one page while downloading, <br />go to
            <strong> More Settings</strong> &rarr; <strong>Scale</strong> &rarr;{" "}
            <strong>Custom</strong> and  <br /> adjust the scale until everything fits
            on a single page.
          </p>

          <div className="flex justify-center px-44 space-x-10">
            <Button
              onClick={HandleDownload}
              className="max-w-40 bg-neutral-500 hover:bg-stone-500"
            >
              Download
            </Button>
            <Button
              onClick={() => navigate(`/dashboard/resume/${resumeid}/edit`)}
              className="max-w-40 bg-neutral-500 hover:bg-stone-500"
            >
              Edit
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-[#B0A89F] text-black flex justify-center">
        <div className="w-full max-w-4xl p-12 bg-white rounded-2xl">
          <div id="print-area">
            {resumeInfo ? renderPreviewSection() : <p>Loading preview...</p>}
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;
