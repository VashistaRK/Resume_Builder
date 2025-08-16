import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import JobDescription, {
  JobAnalysisProvider,
} from "@/forms/JobDescription";
import PersonalDetails from "@/forms/PersonalDetails";
import Skills from "./forms/Skills";
import Experience from "./forms/Experience";
import Education from "./forms/Education";
import Certificates from "./forms/Certificates";
import Projects from "./forms/Projects";

const steps = [
  "Personal",
  "Job Description",
  "Education",
  "Experience",
  "Skills",
  "Certificates",
  "Projects",
];

const FormSection1 = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(true);
  const { resumeid } = useParams();

  return (
    <JobAnalysisProvider>
      {/* Navigation Buttons */}
      <div className="flex gap-2 mb-4 justify-end text-stone-800">
        {activeFormIndex > 1 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveFormIndex(activeFormIndex - 1)}
          >
            <ArrowLeft /> Previous
          </Button>
        )}
        {activeFormIndex < steps.length + 1 && (
          <Button
            disabled={!enableNext}
            className="flex gap-2 border-2"
            size="sm"
            onClick={() => setActiveFormIndex(activeFormIndex + 1)}
          >
            Next <ArrowRight />
          </Button>
        )}
      </div>

      {/* Stepper */}
      <div className="sm:flex flex-col mt-6 hidden">
        <div className="flex items-center justify-between relative">
          {steps.map((label, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center relative"
            >
              {/* Step Circle */}
              <div
                className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center font-medium text-sm z-10 ${
                  index + 1 <= activeFormIndex
                    ? "bg-stone-600 border-stone-600 text-white"
                    : "bg-white border-gray-300 text-gray-500"
                } transition-colors duration-300`}
              >
                {index + 1}
              </div>

              {/* Step Label */}
              <span className="mt-2 text-[10px] md:text-xs text-center text-gray-700">
                {label}
              </span>

              {/* Progress Bar */}
              {index < steps.length - 1 && (
                <div className="absolute top-4 left-3/4 space-x-2 w-[50%] bg-gray-200 z-10">
                  <motion.div
                    className="h-0.5 bg-stone-600"
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        index + 2 <= activeFormIndex
                          ? "100%"
                          : index + 2 === activeFormIndex
                          ? "50%"
                          : "0%",
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="form-stepper text-stone-800">
        {activeFormIndex === 1 && (
          <PersonalDetails enableNext={setEnableNext} />
        )}
        {activeFormIndex === 2 && <JobDescription enableNext={setEnableNext} />}
        {activeFormIndex === 3 && <Education enableNext={setEnableNext} />}
        {activeFormIndex === 4 && <Experience enableNext={setEnableNext} />}
        {activeFormIndex === 5 && <Skills enableNext={setEnableNext} />}
        {activeFormIndex === 6 && <Certificates enableNext={setEnableNext} />}
        {activeFormIndex === 7 && <Projects enableNext={setEnableNext} />}
        {activeFormIndex === 8 && (
          <Navigate to={`/my-resume/${resumeid}/view`} />
        )}
      </div>
    </JobAnalysisProvider>
  );
};

export default FormSection1;
