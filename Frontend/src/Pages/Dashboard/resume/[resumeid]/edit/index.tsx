import React, { useEffect, useState, Suspense } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import type { ResumeInfo } from "@/types/types";
import { useParams, Link } from "react-router-dom";
import GlobalApi from "../../../../../../service/GlobalApi";
import { LayoutGrid, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

const FormSection1 = React.lazy(() => import("../../REcomponents/FormSection"));
const PreviewSection1 = React.lazy(
  () => import("../../REcomponents/PreviewSection")
);
const FormSection2 = React.lazy(() => import("../../Templete2/FormSection"));
const PreviewSection2 = React.lazy(
  () => import("../../Templete2/ResumeTemplete")
);

const templates: Record<
  1 | 2,
  {
    form: React.LazyExoticComponent<React.FC>;
    preview: React.LazyExoticComponent<React.FC>;
  }
> = {
  1: { form: FormSection1, preview: PreviewSection1 },
  2: { form: FormSection2, preview: PreviewSection2 },
};

const EditResume: React.FC = () => {
  const { resumeid } = useParams<{ resumeid: string }>();
  const { getToken } = useAuth();

  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);

  useEffect(() => {
  const fetchResume = async () => {
    if (!resumeid) return setError("No resume ID found.");
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        setError("User not authenticated.");
        return;
      }
      const resumeData = await GlobalApi.GetResumeById(resumeid, token);
      setResumeInfo(resumeData);
      setSelectedTemplate(resumeData?.template || 1);
    } catch (err) {
      console.error("Failed to fetch resume:", err);
      setError("Failed to load resume.");
    } finally {
      setLoading(false);
    }
  };
  fetchResume();
}, [resumeid, getToken]); // ✅ removed showTemplates


  const updateTemplate = async (templateNumber: number) => {
    if (!resumeid) return;
    try {
      const token = await getToken();
      if (!token) return toast("Not authorized");
      await GlobalApi.UpdateResumeDetails(
        resumeid,
        { data: { template: templateNumber } },
        token
      );
      setSelectedTemplate(templateNumber);
      setShowTemplates(false);
    } catch (err) {
      console.error("Failed to update template:", err);
    }
  };

  const SelectedForm = templates[selectedTemplate as 1 | 2].form;
  const SelectedPreview = templates[selectedTemplate as 1 | 2].preview;

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div
        className={`w-auto bg-gradient-to-br from-[#f8f4f0] via-[#ddd0c8] to-[#b0a89f] text-stone-800 font-Quick min-h-screen p-10 relative`}
      >
        <div className="flex justify-between mb-5">
          <Link to="/dashboard">
            <Button className="border-b-2 border-stone-600">
              <Home /> Home
            </Button>
          </Link>
          <Button
            className="border-b-2 border-stone-600"
            onClick={() => setShowTemplates(true)}
          >
            <LayoutGrid /> Templates
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-white">Loading resume...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-stone-300 bg-opacity-90 rounded-lg p-6 shadow-lg border border-gray-700">
              <Suspense fallback={<p>Loading Form...</p>}>
                <SelectedForm />
              </Suspense>
            </div>
            <nav className="bg-white rounded-lg p-12 border border-gray-700">
              <Suspense fallback={<p>Loading Preview...</p>}>
                <SelectedPreview />
              </Suspense>
            </nav>
          </div>
        )}

        {showTemplates && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-stone-400 rounded-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto w-full max-w-3xl mx-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center">
                Choose a Template
              </h2>

              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                {[1, 2].map((num) => (
                  <nav
                    key={num}
                    className="flex flex-col items-center w-full md:w-auto"
                    onClick={() => updateTemplate(num)}
                  >
                    <img
                      src={`/Template${num}.jpg`}
                      alt={`Template ${num}`}
                      className="h-80 sm:h-110 object-contain rounded border"
                    />
                    <Button
                      variant={selectedTemplate === num ? "outline" : "default"}
                      className={`mt-2 w-40 ${
                        selectedTemplate === num
                          ? "bg-transparent border-blue-600 text-blue-600"
                          : "bg-gray-600 text-white"
                      }`}
                    >
                      Template {num}
                    </Button>
                  </nav>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowTemplates(false)}
                  className="w-full md:w-auto"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default EditResume;
