import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate, type To } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  const isOnEdit = path.includes("/dashboard/resume/") && path.endsWith("/edit") || path.endsWith("/view");
  const showBuildButton = path === "/" || path === "/Resumes" || path === "/UnderConstruct" || path === "/CoverLetter";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goTo = (route: To) => {
    navigate(route);
    setMenuOpen(false);
  };

  const headerClass = `h-auto z-10 w-full p-4 md:p-6 ${
    isOnEdit ? "bg-[#B0A89F] text-white shadow-xl" : scrolled ? "fixed top-0" : "relative"
  }`;

  const linkStyle = `text-[1.25rem] font-medium font-mine2 cursor-pointer no-underline transition-all duration-200 ease-in-out relative hover:after:content-[''] hover:after:absolute hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:w-3 hover:after:h-[3px] hover:after:rounded-full hover:after:bottom-[-8px] ${
    isOnEdit ? "text-white hover:after:bg-black hover:text-gray-800" : "text-gray-200 hover:text-[#C462FB] hover:after:bg-violet-400"
  }`;

  return (
    <header className={headerClass}>
      <nav className="flex items-center justify-between w-full px-4 sm:px-6 xl:px-28">
        {/* Logo */}
        <div
          className={`flex font-mine text-2xl sm:text-3xl cursor-pointer ${
            isOnEdit ? "hover:text-gray-800" : "text-[#EDD2F3] hover:text-purple-400"
          }`}
          onClick={() => goTo("/")}
        >
          <h1 className="font-medium">Resume</h1>
          <h1 className="font-extrabold">Forge</h1>
        </div>

        {/* Mobile Menu Icon */}
        <button
          aria-label="Toggle Menu"
          className="block text-white md:text-auto lg:hidden text-2xl ml-auto absolute right-10 top-6"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8 ml-auto">
          {["Builders", "Resumes", "Cover Letters", "CVs"].map((item) => (
            <span
              key={item}
              className={linkStyle}
              onClick={() =>goTo(item === "Resumes" ? "/Resumes" : item==="Cover Letters"? "/CoverLetter":"/UnderConstruct")}
            >
              {item}
            </span>
          ))}

          {isSignedIn ? (
            <>
              {showBuildButton && (
                <button
                  className="bg-[#EDD2F3] hover:bg-[#F4BEEE] rounded-xl h-10 px-5 text-black"
                  onClick={() => goTo("/dashboard")}
                >
                  Build My Resume
                </button>
              )}
              <UserButton />
            </>
          ) : (
            <Link to="/auth/sign-in">
              <button className="border border-gray-800 bg-gray-800 rounded-xs h-10 px-3 text-white">
                Login/Signup
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-[70px] right-0 w-full bg-black/60 backdrop-blur-md p-6 shadow-lg z-20 lg:hidden rounded-md">
            <ul className="flex flex-col gap-4">
              {["Builders", "Resumes", "Cover Letters", "CVs"].map((item) => (
                <li
                  key={item}
                  className="py-2 text-lg font-medium cursor-pointer hover:text-violet-400 text-white"
                  onClick={() => goTo(item === "Resumes" ? "/Resumes" : item==="Cover Letters"? "/CoverLetter":"/UnderConstruct")}
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 mt-4">
              {isSignedIn ? (
                <>
                  {showBuildButton && (
                    <button
                      className="bg-violet-700 rounded-xs h-10 px-5 text-white hover:bg-violet-600"
                      onClick={() => goTo("/dashboard")}
                    >
                      Build My Resume
                    </button>
                  )}
                  <UserButton />
                </>
              ) : (
                <Link to="/auth/sign-in">
                  <button
                    className="border border-white/20 bg-white/10 rounded-xs h-10 px-3 text-white hover:bg-white/20"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login/Signup
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
