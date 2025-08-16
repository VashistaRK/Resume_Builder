import { Outlet } from "react-router-dom";
import AdminAuthGuard from "@/components/AdminAuthGuard";
import AdminSidebar from "@/components/AdminSidebar";

const AdminDashboard = () => {
  return (
    <AdminAuthGuard>
      <div className="flex">
        <AdminSidebar />
        <div className="mt-12 sm:ml-16 sm:mt-0 flex-1 bg-[#F0E4D3] text-stone-700 p-10 md:p-20 min-h-screen">
          <Outlet />
        </div>
      </div>
    </AdminAuthGuard>
  );
};

export default AdminDashboard;
