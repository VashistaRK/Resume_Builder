import type { ReactNode } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const allowedAdmins: string[] = import.meta.env.VITE_ADMIN_EMAILS
  ? import.meta.env.VITE_ADMIN_EMAILS.split(",").map((email: string) =>
      email.trim()
    )
  : [];

const AdminAuthGuard = ({ children }: Props) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  if (!allowedAdmins.includes(email)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
