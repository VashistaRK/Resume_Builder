import { motion } from "framer-motion";
import { useState, useRef } from "react";
// import { Send } from "lucide-react";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

const ContactPage = () => {
  const secRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/contact/send-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (result.success) {
        setResponseMessage("Message sent successfully!");
        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setResponseMessage("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }

    setTimeout(() => setResponseMessage(""), 3000);
  };

  return (
    <section
      ref={secRef}
      className="relative text-white min-h-screen py-16 px-4 w-full overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-300 bg-clip-text font-mine2 text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-white/80 font-mine max-w-2xl mx-auto">
            Have questions about our AI resume builder? We'd love to hear from
            you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="flex justify-center lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/50 transition-all duration-200"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium mb-2"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/50 transition-all duration-200"
                    placeholder="Your company"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/50 transition-all duration-200"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/50 transition-all duration-200"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/50 transition-all duration-200"
                  placeholder="Tell us about your project or ask any questions..."
                />
              </div>

              {isSubmitting ? (
                <motion.button
                  type="button"
                  disabled
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending...
                </motion.button>
              ) : (
                <InteractiveHoverButton
                  type="submit"
                  className="w-full text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Send Message
                </InteractiveHoverButton>
              )}

              {responseMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg text-center font-medium ${
                    responseMessage.includes("successfully")
                      ? "bg-green-600/20 text-gray-400 border border-green-600/30"
                      : "bg-red-600/20 text-red-300 border border-red-600/30"
                  }`}
                >
                  {responseMessage}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
