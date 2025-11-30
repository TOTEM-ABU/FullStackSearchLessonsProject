import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import EducationalCenters from "./pages/EducationalCenters";
import CenterDetails from "./pages/CenterDetails";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Dashboard from "./pages/Dashboard";
import MyCourses from "./pages/MyCourses";
import Profile from "./pages/Profile";
import EnhancedProfile from "./pages/EnhancedProfile";
import UserActivities from "./pages/UserActivities";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import EducationalCentersManagement from "./pages/admin/EducationalCentersManagement";
import BranchesManagement from "./pages/admin/BranchesManagement";
import RegionsManagement from "./pages/admin/RegionsManagement";
import FieldsManagement from "./pages/admin/FieldsManagement";
import SubjectsManagement from "./pages/admin/SubjectsManagement";
import ResourcesManagement from "./pages/admin/ResourcesManagement";
import StarsManagement from "./pages/admin/StarsManagement";
import AdvancedSearch from "./pages/admin/AdvancedSearch";

// User Management Components
import UserAnalytics from "./components/admin/UserAnalytics";
import SessionManagement from "./components/user/SessionManagement";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<AuthLayout children={<Outlet />} />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verify-otp" element={<VerifyOtp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          {/* Main Layout Routes */}
          <Route element={<MainLayout />}>
            {/* Public Pages */}
            <Route index element={<Home />} />
            <Route path="centers">
              <Route index element={<EducationalCenters />} />
              <Route path=":id" element={<CenterDetails />} />
            </Route>
            <Route path="courses">
              <Route index element={<Courses />} />
              <Route path=":id" element={<CourseDetails />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute children={<Outlet />} />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="my-courses">
                <Route index element={<MyCourses />} />
                <Route path=":id" element={<MyCourses />} />
              </Route>
              <Route path="profile" element={<Profile />} />
              <Route path="enhanced-profile" element={<EnhancedProfile />} />
              <Route path="sessions" element={<SessionManagement />} />
              <Route path="activities" element={<UserActivities />} />
            </Route>

            {/* 404 - Keep this last */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={<ProtectedRoute children={<AdminLayout />} />}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="user-analytics" element={<UserAnalytics />} />
            <Route
              path="educational-centers"
              element={<EducationalCentersManagement />}
            />
            <Route path="branches" element={<BranchesManagement />} />
            <Route path="regions" element={<RegionsManagement />} />
            <Route path="fields" element={<FieldsManagement />} />
            <Route path="subjects" element={<SubjectsManagement />} />
            <Route path="resources" element={<ResourcesManagement />} />
            <Route path="stars" element={<StarsManagement />} />
            <Route path="search" element={<AdvancedSearch />} />
          </Route>
        </Routes>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
