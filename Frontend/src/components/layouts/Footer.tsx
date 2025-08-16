const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#474747] to-[#0e0e0e] text-gray-300 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start">
        {/* Left Section - Quote/Description */}
        <div className="md:w-2/3 text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-xl font-semibold text-purple-500">
            "Empowering Careers with AI"
          </h2>
          <p className="text-sm mt-2 text-gray-400">
            Transforming job applications with AI-driven resume generation.
            Simply enter your job details, and let our platform create an
            ATS-friendly resume tailored to your needs.
          </p>
        </div>

        {/* Right Section - Contact & Support */}
        <div className="flex flex-col md:w-1/3 text-center md:text-right">
          <h3 className="text-lg font-medium text-purple-500">Contact Us</h3>
          <p className="text-sm text-gray-400">Zenmatix@outlook.com</p>
          <p className="text-sm text-gray-400">+91 95159 84423</p>
          <p className="text-sm text-gray-400">+91 81066 27080</p>

          <h3 className="text-lg font-medium text-purple-500 mt-4">Support Us</h3>
          <p className="text-sm text-gray-400">
            Your support helps us grow. Share and contribute!
          </p>
        </div>
      </div>
      <div className="mt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Zenmatix. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
