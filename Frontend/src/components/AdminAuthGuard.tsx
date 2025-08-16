import type { ReactNode } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const allowedAdmins: string[] = ["shoterking1357@gmail.com"]; // replace with your admin email

interface Props {
  children: ReactNode;
}

const AdminAuthGuard = ({ children }: Props) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  if (!allowedAdmins.includes(email)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
