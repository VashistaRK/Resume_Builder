import { useContext } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";

const PreviewSection = () => {
  const { resumeInfo } = useContext(ResumeInfoContext);

  if (!resumeInfo) return <p>Loading...</p>;

  const {
    name,
    phone,
    email,
    linkedin,
    github,
    summary,
    education: educationList = [],
    skills,
    certifications = [],
    projects = [],
    experience = [],
  } = resumeInfo;

  return (
    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 py-6 text-xs sm:text-sm md:text-base font-sans break-words">
      <div className="text-center mb-6">
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold">{name}</h1>
        <p className="mt-1">
          {phone} |{" "}
          <a href={`mailto:${email}`} className="text-blue-600 break-all">
            {email}
          </a>
        </p>
        <p className="mt-1 flex justify-center gap-4 flex-wrap">
          {linkedin && (
            <a
              href={linkedin}
              className="text-blue-600"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          )}
          {github && (
            <a
              href={github}
              className="text-blue-600"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}
        </p>
      </div>

      {summary && (
        <section className="mt-6">
          <h2 className="font-semibold text-base sm:text-lg md:text-xl border-b mb-2">
            Summary
          </h2>
          <p>{summary}</p>
        </section>
      )}

      {educationList.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold text-base sm:text-lg md:text-xl border-b mb-2">
            Education
          </h2>
          {educationList.map((edu, i) => (
            <div key={i} className="mb-4">
              <p className="font-semibold">{edu.college}</p>
              <p>{edu.degree}</p>
              <p>
                {edu.year} | Major: {edu.major}
              </p>
              <p>{edu.description}</p>
            </div>
          ))}
        </section>
      )}

      {skills && (
        <section className="mt-6">
          <h2 className="font-semibold text-base sm:text-lg md:text-xl border-b mb-2">
            Technical Skills
          </h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <b>Languages:</b> {skills.languages}
            </li>
            <li>
              <b>Tools:</b> {skills.tools}
            </li>
            <li>
              <b>Coursework:</b> {skills.coursework}
            </li>
            {skills.other?.map((item, i) => (
              <li key={i}>{item.name}</li>
            ))}
          </ul>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold text-base sm:text-lg md:text-xl border-b mb-2">
            Experience
          </h2>
          {experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <p className="font-semibold">
                {exp.position} - {exp.company}
              </p>
              <p className="text-gray-600">
                {exp.location} | {exp.duration}
              </p>
              {exp.responsibilities && (
                <div
                  className="mt-1"
                  dangerouslySetInnerHTML={{ __html: exp.responsibilities }}
                />
              )}
            </div>
          ))}
        </section>
      )}

      {certifications.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold text-base sm:text-lg md:text-xl border-b mb-2">
            Certifications / Achievements
          </h2>
          <ul className="list-disc ml-5 space-y-1">
            {certifications.map((cert, i) => (
              <li key={i}>
                {cert.name}
                {cert.link && (
                  <a
                    href={cert.link}
                    className="text-blue-600 ml-2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    (Certificate)
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold text-base sm:text-lg md:text-xl border-b mb-2">
            Projects
          </h2>
          {projects.map((project, i) => (
            <div key={i} className="mb-4">
              <p className="font-semibold">
                {project.name} | <i>{project.technologies}</i>
              </p>
              <p>{project.description}</p>
              {project.link && (
                <a
                  href={project.link}
                  className="text-blue-600"
                  target="_blank"
                  rel="noreferrer"
                >
                  (View Project)
                </a>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default PreviewSection;
