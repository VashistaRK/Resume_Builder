import { useContext } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";

const ResumeTemplate = () => {
  const { resumeInfo } = useContext(ResumeInfoContext);

  if (!resumeInfo) return <p>Loading...</p>;

  const {
    name,
    email,
    phone,
    github,
    linkedin,
    education = [],
    experience = [],
    projects = [],
    certifications = [],
    technicalSkills = [],
    academicAchievements,
    volunteerExperience,
  } = resumeInfo;

  return (
    <div className="max-w-4xl font-mine mx-auto bg-white">
      {/* Header */}
      <div className="text-start mb-3">
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        <p className="text-[12px]">
          {email} | {phone}
        </p>
        <p className="text-[12px]">
          {github && (
            <a href={github} className="text-blue-600 mr-4" target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {linkedin && (
            <a href={linkedin} className="text-blue-600" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
        </p>
      </div>

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-4 text-[12px]">
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex flex-row justify-between">
                <p className="font-medium text-sm">{edu.college}</p>
                <p>
                  {edu.location}, {edu.year}
                </p>
              </div>
              <p>{edu.degree}</p>
              <p>GPA: {edu.gpa}</p>
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-4 text-[12px]">
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">Experience</h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex flex-row justify-between">
                <p className="font-medium text-sm">
                  {exp.position} - {exp.company}
                </p>
                <p>
                  {exp.location}, {exp.duration}
                </p>
              </div>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {exp.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-4 text-sm">
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">Projects</h2>
          {projects.map((project, idx) => (
            <div key={idx} className="mb-4 text-[12px]">
              <div className="flex flex-row justify-between">
                <p className="font-medium text-sm">{project.name}</p>
                <p>{project.duration}</p>
              </div>
              <ul className="list-disc mt-1 list-inside space-y-1">
                <li>Description: {project.description}</li>
                <li>Role: {project.role}</li>
                <li>Technologies Used: {project.technologies}</li>
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">Certifications</h2>
          {certifications.map((cert, idx) => (
            <div key={idx} className="mb-4 text-[12px]">
              <div className="flex flex-row justify-between">
                <p className="font-medium text-sm">{cert.name}</p>
                <p>Date: {cert.date}</p>
              </div>
              <ul className="list-disc mt-1 list-inside space-y-1">
                <li>Description: {cert.description}</li>
                <li>Technologies Used: {cert.technologies}</li>
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Additional */}
      {(technicalSkills.length > 0 || academicAchievements || volunteerExperience) && (
        <section className="mb-4 text-[12px]">
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">Additional</h2>
          {technicalSkills.length > 0 && (
            <p>
              <span className="font-bold">Technical Skills:</span> {technicalSkills.join(", ")}
            </p>
          )}
          {academicAchievements && (
            <p>
              <span className="font-bold">Academic Achievements:</span> {academicAchievements}
            </p>
          )}
          {volunteerExperience && (
            <p>
              <span className="font-bold">Volunteer Experience:</span> {volunteerExperience}
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default ResumeTemplate;
