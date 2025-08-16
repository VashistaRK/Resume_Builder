import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
// import { Button } from "./components/ui/button";
import { ResumeInfoProvider } from "@/context/ResumeInfoContext";
import { useEffect, useState } from "react";
import Header from "./components/layouts/Header";
import Loading from "./components/layouts/Loading";
import Footer from "./components/layouts/Footer";

function App() {
  const { isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isSignedIn && isLoaded) {
    return <Navigate to={"auth/sign-in"} />;
  }
  if (loading) return <Loading />;
  return (
    <div className="bg-[#0e0e0e]">
    <ResumeInfoProvider>
      <Header />
      <nav className="min-h-screen">
        <Outlet />
      </nav>
      <Toaster />
      <Footer />
    </ResumeInfoProvider>
    </div>
  );
}

export default App;
