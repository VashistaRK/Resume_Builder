import { useState, useEffect } from "react";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";
/*eslint-disable*/

interface CoverLetterItem {
  _id: string;
  name: string;
  purpose: string;
  imageUrl: string;
  downloadUrl: string;
}

const CoverLetters = () => {
  const [coverLetters, setCoverLetters] = useState<CoverLetterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const points = [
    "Makes you understand the expectations",
    "Highlights relevant strengths for that specific purpose",
    "Increases your chances of standing out among applicants",
  ];

  useEffect(() => {
    const fetchCoverLetters = async () => {
      try {
        // ✅ Fetch metadata
        const metaRes = await axios.get(
          "http://localhost:5000/api/coverletters"
        );
        const metadata = metaRes.data;

        // ✅ Fetch images and downloads
        const itemsWithFiles: CoverLetterItem[] = await Promise.all(
          metadata.map(async (item: any) => {
            const imageRes = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/api/coverletters/${
                item._id
              }/image`,
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

        setCoverLetters(itemsWithFiles);
      } catch (error) {
        console.error("Error fetching cover letters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoverLetters();
  }, []);

  return (
    <div className="min-h-screen font-Rammetto bg-[#0e0e0e] text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Cover Letters</h1>
        <p className="mb-6 text-center">
          A well-crafted cover letter can make all the difference in your
          application. Each type of cover letter is designed to match the tone,
          purpose, and requirements of different opportunities
        </p>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : coverLetters.length === 0 ? (
          <p className="text-center text-gray-400">No cover letters found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {coverLetters.map((letter) => (
              <div
                key={letter._id}
                className="bg-[#1a1a1a] rounded-lg p-4 flex flex-col items-center border border-gray-800 hover:shadow-lg transition"
              >
                <img
                  src={letter.imageUrl}
                  alt={letter.name}
                  className="rounded w-full mb-4 object-cover"
                />
                <h2 className="text-lg font-semibold mb-2">{letter.name}</h2>
                <p className="text-gray-400 text-sm mb-4 text-center">
                  {letter.purpose}
                </p>

                <a
                  href={letter.downloadUrl}
                  download={`${letter.name}.docx`}
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded text-white transition"
                >
                  <FaDownload /> Download
                </a>
              </div>
            ))}
          </div>
        )}

        <section className="w-full px-4 py-10 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-300 to-stone-800 bg-clip-text text-transparent"
            >
              🌟 Why Use Different Cover Letters?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-xl mb-8"
            >
              Each application is unique. Using the right type of cover letter:
            </motion.p>

            <div className="flex flex-col gap-4 items-center">
              {points.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-lg px-4 py-3 w-full md:w-2/3 hover:bg-purple-200 hover:text-stone-800 transition-colors duration-200"
                >
                  <span className="text-xl">✔️</span>
                  <p className="text-left">{point}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-10 text-stone-400 font-bold rounded-full px-6 py-4 shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer inline-block"
            >
              With ResumeForge Cover Letter Builder, you can quickly generate
              tailored cover letters for every stage of your career journey –
              from internships to executive roles.
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CoverLetters;
