import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { fetchResumes } from "@/stores/adminSlice";
import axios from "axios";
import {FaEdit, FaTrash} from "react-icons/fa";

const API = import.meta.env.VITE_BASE_URL + "/api";

const ResumeManager = () => {
  const dispatch = useAppDispatch();
  const { resumes, loading } = useAppSelector((state) => state.admin);

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image: null as File | null,
    document: null as File | null,
  });

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  // ✅ Delete handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure to delete this resume?")) return;

    try {
      await axios.delete(`${API}/docitems/${id}`);
      dispatch(fetchResumes());
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // ✅ Add / Edit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image || !formData.document) {
      alert("Both image and document are required.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("image", formData.image);
    data.append("document", formData.document);

    try {
      if (editingId) {
        await axios.put(`${API}/docitems/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setEditingId(null);
      } else {
        await axios.post(`${API}/docitems`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setAdding(false);
      }
      setFormData({
        name: "",
        category: "",
        description: "",
        image: null,
        document: null,
      });
      dispatch(fetchResumes());
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  // ✅ Edit handler
  const handleEdit = (item: (typeof resumes)[0]) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      image: null,
      document: null,
    });
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <h1 className="text-2xl font-bold mb-6">Resume Templates</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Description</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((item) => (
              <tr key={item._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3">{item.description}</td>
                <td className="p-3 space-y-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex items-center bg-green-400 text-white px-3 py-1 rounded hover:bg-green-500 hover:cursor-pointer text-sm space-x-2 transition"
                  >
                    <FaEdit size={14} />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center bg-red-400 text-white px-3 py-1 rounded hover:cursor-pointer hover:bg-red-500 text-sm space-x-2 transition"
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

      {/* ✅ Add / Edit Form */}
      {(adding || editingId) && (
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
            placeholder="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border p-2 rounded"
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
            required={!editingId}
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
            required={!editingId}
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 text-sm"
            >
              {editingId ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setEditingId(null);
                setFormData({
                  name: "",
                  category: "",
                  description: "",
                  image: null,
                  document: null,
                });
              }}
              className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!adding && !editingId && (
        <button
          onClick={() => setAdding(true)}
          className="mt-6 bg-stone-500 text-white px-5 py-2 rounded hover:cursor-pointer hover:bg-stone-400 text-sm"
        >
          Add New Resume
        </button>
      )}
    </div>
  );
};

export default ResumeManager;
