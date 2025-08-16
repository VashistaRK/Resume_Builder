import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./index"; // Adjust path if needed
/*eslint-disable*/

const API = import.meta.env.VITE_BASE_URL + "/api";

export interface ResumeItem {
  _id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  documentUrl: string;
}

export interface CoverLetterItem {
  _id: string;
  name: string;
  purpose: string;
  imageUrl: string;
  downloadUrl: string;
}

interface AdminState {
  resumes: ResumeItem[];
  coverLetters: CoverLetterItem[];
  loading: boolean;
}

const initialState: AdminState = {
  resumes: [],
  coverLetters: [],
  loading: false,
};

/**
 * Async Thunks
 */

// ✅ Fetch Resumes with files
export const fetchResumes = createAsyncThunk("admin/fetchResumes", async () => {
  const metadataRes = await axios.get(`${API}/docitems`);
  const metadata = metadataRes.data;

  const itemsWithFiles: ResumeItem[] = await Promise.all(
    metadata.map(async (item: any) => {
      const imageRes = await axios.get(`${API}/docitems/${item._id}/image`, {
        responseType: "arraybuffer",
      });

      const documentRes = await axios.get(
        `${API}/docitems/${item._id}/document`,
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
        _id: item._id,
        name: item.name,
        category: item.category,
        description: item.description,
        imageUrl,
        documentUrl,
      };
    })
  );

  return itemsWithFiles;
});

// ✅ Fetch Cover Letters (unchanged)
export const fetchCoverLetters = createAsyncThunk(
  "admin/fetchCoverLetters",
  async () => {
    const metadataRes = await axios.get(`${API}/coverletters`);
    const metadata = metadataRes.data;

    const itemsWithFiles: CoverLetterItem[] = await Promise.all(
      metadata.map(async (item: any) => {
        const imageRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/coverletters/${item._id}/image`,
          { responseType: "arraybuffer" }
        );

        const downloadRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/coverletters/${
            item._id
          }/document`,
          { responseType: "arraybuffer" }
        );

        const imageBlob = new Blob([imageRes.data], {
          type: imageRes.headers["content-type"],
        });
        const imageUrl = URL.createObjectURL(imageBlob);

        const downloadBlob = new Blob([downloadRes.data], {
          type: downloadRes.headers["content-type"],
        });
        const downloadUrl = URL.createObjectURL(downloadBlob);

        return {
          _id: item._id,
          name: item.name,
          purpose: item.purpose,
          imageUrl,
          downloadUrl,
        };
      })
    );

    return itemsWithFiles;
  }
);
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Resumes
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload;
      })
      .addCase(fetchResumes.rejected, (state) => {
        state.loading = false;
      })

      // Fetch Cover Letters
      .addCase(fetchCoverLetters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCoverLetters.fulfilled, (state, action) => {
        state.loading = false;
        state.coverLetters = action.payload;
      })
      .addCase(fetchCoverLetters.rejected, (state) => {
        state.loading = false;
      });
  },
});

/**
 * Selectors
 */
export const selectResumes = (state: RootState) => state.admin.resumes;
export const selectCoverLetters = (state: RootState) =>
  state.admin.coverLetters;
export const selectLoading = (state: RootState) => state.admin.loading;

/**
 * Export reducer
 */
export default adminSlice.reducer;
