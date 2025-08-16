import React from "react";
import { lazy } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";
import App from "./App";
import ResumeLandingPage from "./Pages/LandingPage/ResumeLandingPage.tsx";
import Signin from "./Pages/Signin.tsx";
import CoverLetters from "./Pages/CoverLetter.tsx";
import AdminDashboard from "./Pages/admin/AdminDashboard.tsx";
import ResumeManager from "./Pages/admin/ResumeManager.tsx";
import CoverLetterManager from "./Pages/admin/CoverLetterManager.tsx";
import { Provider } from "react-redux";
import store from "@/stores/index.ts";


const Resumes = lazy(() => import("./Pages/Resumes.tsx"));
const Dashboard = React.lazy(() => import("./Pages/Dashboard/Dashboard"));
const EditResume = React.lazy(
  () => import("./Pages/Dashboard/resume/[resumeid]/edit")
);
const ViewResume = React.lazy(() => import("./my-resume/[resumeid]/view"));
const UnderConstruction = React.lazy(() => import("./Pages/UnderCon.tsx"));

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <ResumeLandingPage />,
      },
      {
        path: "/Resumes",
        element: <Resumes />,
      },
      {
        path: "/CoverLetter",
        element: <CoverLetters />,
      },
      {
        path: "/UnderConstruct",
        element: <UnderConstruction />,
      },
      {
        path: "/Dashboard",
        element: <Dashboard />,
      },
      {
        path: "/Dashboard/resume/:resumeid/edit",
        element: <EditResume />,
      },
    ],
  },

  {
    path: "/auth/sign-in",
    element: <Signin />,
  },

  {
    path: "/my-resume/:resumeid/view",
    element: <ViewResume />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
    children:[
      {
      path:"resumes",
      element:<ResumeManager/>
      },
      {
        path:"coverletters",
        element: <CoverLetterManager/>
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <Provider store={store}>
        <RouterProvider router={router} />
        </Provider>
      </ClerkProvider>
  </React.StrictMode>
);
