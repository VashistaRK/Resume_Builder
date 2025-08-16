import mongoose from "mongoose";

const otherSkillsSchema = new mongoose.Schema({
  name: String,
}, { _id: false });

const skillsSchema = new mongoose.Schema({
  languages: String,
  tools: String,
  coursework: String,
  other: [otherSkillsSchema],
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  role: String,
  technologies: String,
  duration: String,
  link: String,
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  position: String,
  company: String,
  responsibilities: [String],
  location: String,
  duration: String,
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  name: String,
  description: String,
  technologies: String,
  date: String,
  link: String,
}, { _id: false });

const educationSchema = new mongoose.Schema({
  college: String,
  degree: String,
  major: String,
  gpa: String,
  location: String,
  year: String,
  description: String,
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  resumeid: String,
  userEmail: String,
  userName: String,
  name: String,
  phone: String,
  email: String,
  linkedin: String,
  github: String,
  summary: String,
  jobTitle: String,
  education: [educationSchema],
  experience: [experienceSchema],
  projects: [projectSchema],
  certifications: [certificationSchema],
  skills: skillsSchema,
  technicalSkills: [String],
  academicAchievements: String,
  volunteerExperience: String,
  template: String,
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);
