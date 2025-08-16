import axios from "axios";
import type { AxiosInstance } from "axios";
import { getFromCache, setToCache, clearCache } from "./cache";
/**
 * Create a base axios client
 */
const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * API Functions
 */
interface ResumeData {
  [key: string]: unknown;
}
interface TemplateItem {
  _id: string;
  id: number;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  documentUrl: string;
  [key: string]: unknown;
}

// ✅ Create New Resume
export const CreateNewResume = async (data: ResumeData, token: string) => {
  clearCache();
  return axiosClient.post("/resume", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Get All Resumes for the logged-in user
export const GetUserResumes = async (userId: string) => {
  const cacheKey = `userResumes_${userId}`;
  const cached = getFromCache<ResumeData[]>(cacheKey);
  if (cached) return cached;

  const response = await axiosClient.get(`/resume?userId=${userId}`);
  setToCache(cacheKey, response.data);
  return response.data;
  // return axiosClient.get(`/resume?userId=${userId}`);
};

// ✅ Get Resume By ID
export const GetResumeById = async (id: string, token: string) => {
  const cacheKey = `resume_${id}`;
  const cached = getFromCache<ResumeData>(cacheKey);
  if (cached) return cached;
  const response = await axiosClient.get(`/resume/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  setToCache(cacheKey, response.data);
  return response.data;
  // return axiosClient.get(`/resume/${id}`, {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
};

// ✅ Update Resume By ID
export const UpdateResumeDetails = async (
  id: string,
  data: ResumeData,
  token: string
) => {
  return axiosClient.put(`/resume/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Delete Resume By ID
export const DeleteResumeById = async (id: string, token: string) => {
  return axiosClient.delete(`/resume/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const GETResumeTemplates = async () => {
  const cacheKey = "resumeTemplates";
  const cached = getFromCache<TemplateItem[]>(cacheKey);
  if (cached) return cached;
  const metadataRes = await axiosClient.get("/docitems");
  const metadata = metadataRes.data;

  const itemsWithFiles = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata.map(async (item: any) => {
      const imageRes = await axiosClient.get(`/docitems/${item._id}/image`, {
        responseType: "arraybuffer",
      });
      const documentRes = await axiosClient.get(
        `/docitems/${item._id}/document`,
        {
          responseType: "arraybuffer",
        }
      );

      const imageBlob = new Blob([imageRes.data], {
        type: imageRes.headers["content-type"],
      });
      const imageUrl = URL.createObjectURL(imageBlob);

      const documentBlob = new Blob([documentRes.data], {
        type: documentRes.headers["content-type"],
      });
      const documentUrl = URL.createObjectURL(documentBlob);

      return {
        ...item,
        imageUrl,
        documentUrl,
      }as TemplateItem;
    })
  );
  
  setToCache(cacheKey, itemsWithFiles);
  return itemsWithFiles;
  // return itemsWithFiles;
};

export default {
  CreateNewResume,
  GetUserResumes,
  UpdateResumeDetails,
  GetResumeById,
  DeleteResumeById,
  GETResumeTemplates,
};
