import {createBrowserRouter} from "react-router-dom"
import App from "../App";
import JobsPage from "../pages/JobsPage";
import HomePage from "../pages/HomePage";
import AdminDashboard from "../pages/AdminDashboard";
import JobDetailsPage from "../pages/jobDetailsPage";
import AddJobPage from "../pages/AddJob";
import ProtectedRoute from "./protectedRoute";
import JobApplicantsPage from "../pages/jobApplicantPage";
import ProfilePage from "../pages/Profile";
import EditJobModal from "../pages/EditJobPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <HomePage />
            },
            {
                path: "/jobs",
                element: <JobsPage />
            },
            {
                path: "/me",
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                )
            },
            {
                path: "/admin",
                element: (
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                )
            },
            {
                path: "/admin/add",
                element: (
                    <ProtectedRoute>
                        <AddJobPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "/jobs/:jobId/applicants",
                element: (
                    <ProtectedRoute>
                        <JobApplicantsPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "/jobs/:id",
                element: <JobDetailsPage />
            },
            {
                path: "/jobs/:id/edit",
                element: (
                    <ProtectedRoute>
                        <EditJobModal />
                    </ProtectedRoute>
                )
            }
        ]
    }
])

export default router;