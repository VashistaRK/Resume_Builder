import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { fetchCoverLetters } from "@/stores/adminSlice";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
/*eslint-disable*/
const API = import.meta.env.VITE_BASE_URL + "/api";

const CoverLetterManager = () => {
  const dispatch = useAppDispatch();
  const { coverLetters, loading } = useAppSelector((state) => state.admin);

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null as string | null);
  const [formData, setFormData] = useState({
    name: "",
    purpose: "",
    image: null as File | null,
    document: null as File | null,
  });

  useEffect(() => {
    dispatch(fetchCoverLetters());
  }, [dispatch]);

  // ✅ Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure to delete this cover letter?")) return;
    try {
      await axios.delete(`${API}/coverletters/${id}`);
      dispatch(fetchCoverLetters());
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // ✅ Handle Edit pre-fill
  const handleEdit = (item: any) => {
    setEditing(item._id);
    setFormData({
      name: item.name,
      purpose: item.purpose,
      image: null,
      document: null,
    });
    setAdding(true);
  };

  // ✅ Handle Form Submit (Add or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("purpose", formData.purpose);
    if (formData.image) data.append("image", formData.image);
    if (formData.document) data.append("document", formData.document);

    try {
      if (editing) {
        await axios.put(`${API}/coverletters/${editing}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${API}/coverletters`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setFormData({ name: "", purpose: "", image: null, document: null });
      setAdding(false);
      setEditing(null);
      dispatch(fetchCoverLetters());
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <h1 className="text-2xl font-bold mb-6">Cover Letters</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Purpose</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coverLetters.map((item) => (
              <tr key={item._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.purpose}</td>
                <td className="p-3 space-x-2 flex">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex items-center bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm space-x-1 transition"
                  >
                    <FaEdit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm space-x-1 transition"
                  >
                    <FaTrash size={14} />
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Add/Edit Form */}
      {adding ? (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 bg-white p-4 rounded shadow"
        >
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Purpose"
            value={formData.purpose}
            onChange={(e) =>
              setFormData({ ...formData, purpose: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({
                ...formData,
                image: e.target.files ? e.target.files[0] : null,
              })
            }
            className="w-full"
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              setFormData({
                ...formData,
                document: e.target.files ? e.target.files[0] : null,
              })
            }
            className="w-full"
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 text-sm"
            >
              {editing ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setEditing(null);
                setFormData({ name: "", purpose: "", image: null, document: null });
              }}
              className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-6 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Add New Cover Letter
        </button>
      )}
    </div>
  );
};

export default CoverLetterManager;
