import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaFileAlt, FaEnvelope } from "react-icons/fa";
import { UserButton } from "@clerk/clerk-react";

const AdminSidebar = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine styles based on width
  const isMobile = width < 650;

  const containerClasses = `fixed left-0 top-0 bg-[#DCC5B2] shadow-lg text-stone-700 flex ${
    isMobile ? "h-12 w-full flex-row items-center justify-around p-2" : "h-full w-20 flex-col items-center pt-10 space-y-6"
  }`;

  const iconSize = isMobile ? 20 : 24;

  return (
    <div className={containerClasses}>
      <NavLink to="/admin/resumes" className="hover:text-stone-500">
        <FaFileAlt size={iconSize} />
      </NavLink>
      <NavLink to="/admin/coverletters" className="hover:text-stone-500">
        <FaEnvelope size={iconSize} />
      </NavLink>
      <div className={`${isMobile ? "" : "mt-auto mb-4"} text-gray-400 hover:text-white`}>
        <UserButton />
      </div>
    </div>
  );
};

export default AdminSidebar;
