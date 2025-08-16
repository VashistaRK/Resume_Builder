export interface Project {
  name: string;
  description: string;
  role: string;
  technologies: string;
  duration: string;
  link?: string;
};

export interface Skills {
  languages: string;
  tools: string;
  coursework: string;
  other: OtherSkills[];
};

export interface OtherSkills {
  name: string;
};

export interface Experience {
  id?: string | undefined;
  position: string;
  company: string;
  responsibilities: string[];
  location: string;
  duration: string;
};

export interface Certification {
  name: string;
  description: string;
  technologies: string;
  date: string;
  link?: string;
};

export interface Education {
  college: string;
  degree: string;
  major: string;
  gpa: string;
  location: string;
  year: string;
  description: string;
};

export interface ResumeInfo {
  name?: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  summary?: string;
  jobTitle?: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  skills: Skills;
  technicalSkills: string[];
  academicAchievements: string;
  volunteerExperience: string;
  template: number;
  [key: string]: unknown;
};