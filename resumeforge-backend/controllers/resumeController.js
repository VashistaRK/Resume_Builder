import Resume from '../models/resumes.js';
import path from 'path';
import fs from 'fs';
import client from '../services/redisClient.js'; // Redis client


/**
 * ✅ Create a new resume
 */
export const CreateResume = async (req, res) => {
  try {
    const { title, resumeid, userEmail, userName } = req.body;

    if (!title || !resumeid || !userEmail || !userName) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const defaultResume = {
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      email: "johndoe@example.com",
      linkedin: "https://www.linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      summary: "Passionate Full Stack Developer with 3+ years of experience building scalable web applications and working across the full stack to deliver impactful products.",
      jobTitle: "Full Stack Developer",
      education: [
        {
          degree: "Bachelor of Technology in Computer Science",
          institution: "ABC University",
          location: "New York, NY",
          startDate: "Aug 2017",
          endDate: "May 2021",
          grade: "8.5 CGPA"
        }
      ],
      experience: [
        {
          title: "Software Developer",
          company: "Tech Solutions Inc.",
          location: "San Francisco, CA",
          startDate: "Jun 2021",
          endDate: "Present",
          description: [
            "Developed and maintained RESTful APIs using Node.js and Express.",
            "Implemented frontend components with React.js and Redux.",
            "Collaborated with a team of 6 developers using Agile methodologies."
          ]
        },
        {
          title: "Backend Developer Intern",
          company: "InnovateX Labs",
          location: "San Jose, CA",
          startDate: "Jan 2021",
          endDate: "May 2021",
          description: [
            "Created Python scripts to automate data processing tasks.",
            "Built backend endpoints for a chatbot integration using Flask."
          ]
        }
      ],
      projects: [
        {
          name: "E-Commerce Website",
          description: "Developed a fully responsive e-commerce website with user authentication, payment gateway integration, and admin dashboard using MERN stack.",
          technologies: "React, Node.js, Express, MongoDB",
          link: "https://github.com/johndoe/ecommerce-website"
        },
        {
          name: "Personal Portfolio",
          description: "Designed and deployed a personal portfolio website showcasing projects and blogs.",
          technologies: "HTML, CSS, JavaScript",
          link: "https://johndoe.dev"
        }
      ],
      certifications: [
        {
          name: "AWS Certified Solutions Architect – Associate",
          issuer: "Amazon Web Services",
          date: "Jul 2022"
        },
        {
          name: "Full Stack Web Development Certification",
          issuer: "Coursera",
          date: "Mar 2021"
        }
      ],
      skills: {
        languages: "JavaScript, Python, Java",
        tools: "Git, Docker, VS Code, Postman",
        coursework: "Data Structures, Algorithms, Database Management Systems, Operating Systems",
        other: [{ name: "Agile Methodologies" }, { name: "REST APIs" }]
      },
      technicalSkills: [
        "React.js", "Node.js", "Express.js", "MongoDB", "MySQL", "HTML", "CSS", "JavaScript", "Python", "Git", "Docker"
      ],
      academicAchievements: "Secured 1st place in University Coding Hackathon 2020 among 200+ participants.",
      volunteerExperience: "Volunteered as a coding mentor for underprivileged students at CodeForGood Foundation.",
      template: "1"
    };


    const newResume = await Resume.create({
      ...defaultResume,
      userId: req.auth.userId,
      title,
      resumeid,
      userEmail: userEmail || "no-email@example.com",
      userName: userName || "Anonymous",
    });

    console.log(`✅ Resume created for user ${req.auth.userId}: ${title}`);
    await client.del(`resumes:${req.auth.userId}`); // Invalidate cache
    res.status(201).json(newResume);

  } catch (error) {
    console.error("❌ Error creating resume:", error);
    res.status(500).json({ message: "Error creating resume", error: error.message });
  }
};

/**
 * ✅ Get all resumes for the logged-in user
 */
// route: GET /resume?userId=123
export const getUserResumes = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const cacheKey = `resumes:${userId}`;
    const cached = await client.get(cacheKey);
    if (cached) {
      console.log("⚡ Cache hit");
      return res.json(JSON.parse(cached));
    }

    console.log("🔍 Fetching resumes for userId:", userId);

    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });
    await client.set(cacheKey, JSON.stringify(resumes), { EX: 3600 }); // Cache for 1 hour
    res.json(resumes);

  } catch (error) {
    console.error("❌ Error fetching resumes:", error);
    res.status(500).json({ message: "Error getting resumes", error: error.message });
  }
};


/**
 * ✅ Get resume by ID
 */
export const getResumeById = async (req, res) => {
  try {
    const key = `resume:${req.params.id}`;
    const cached = await client.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const resume = await Resume.findOne({ _id: req.params.id, userId: req.auth.userId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    await client.set(key, JSON.stringify(resume), { EX: 3600 });
    res.json(resume);

  } catch (error) {
    console.error("❌ Error fetching resume by ID:", error);
    res.status(500).json({ message: "Failed to get resume", error: error.message });
  }
};

/**
 * ✅ Update resume by ID
 */
export const updateResume = async (req, res) => {
  try {
    const updatedResume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.auth.userId },
      req.body.data ? req.body.data : req.body,
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found or not authorized" });
    }

    console.log(`✅ Resume updated: ${updatedResume.title}`);
    res.json(updatedResume);
    await client.del(`resume:${req.params.id}`);
    await client.del(`resumes:${req.auth.userId}`);

  } catch (error) {
    console.error("❌ Error updating resume:", error);
    res.status(500).json({ message: "Failed to update resume", error: error.message });
  }
};


/**
 * ✅ Delete resume by ID
 */
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.auth.userId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found or not authorized" });
    }

    const uploadsFolder = path.join(process.cwd(), 'uploads');

    // Delete thumbnail if exists
    if (resume.thumbnailLink) {
      const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
      if (fs.existsSync(oldThumbnail)) {
        fs.unlinkSync(oldThumbnail);
        console.log("🗑️ Deleted old thumbnail:", oldThumbnail);
      }
    }

    // Delete profile preview if exists
    if (resume.profileInfo?.profilePreviewUrl) {
      const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
      if (fs.existsSync(oldProfile)) {
        fs.unlinkSync(oldProfile);
        console.log("🗑️ Deleted old profile preview:", oldProfile);
      }
    }

    await Resume.findOneAndDelete({ _id: req.params.id, userId: req.auth.userId });

    console.log(`✅ Resume deleted: ${resume.title}`);
    res.json({ message: "Resume deleted successfully" });
    await client.del(`resume:${req.params.id}`);
    await client.del(`resumes:${req.auth.userId}`);

  } catch (error) {
    console.error("❌ Error deleting resume:", error);
    res.status(500).json({ message: "Failed to delete resume", error: error.message });
  }
};
