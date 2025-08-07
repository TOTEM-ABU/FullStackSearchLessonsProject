import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Centers from "./pages/Centers";
import Subjects from "./pages/Subjects";
import Resources from "./pages/Resources";

// Component to handle redirection based on auth status
const AuthRedirect = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/centers" replace /> : <Navigate to="/login" replace />;
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/centers" element={<Centers />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/resources" element={<Resources />} />
                
                {/* Add more protected routes here */}
                {/* Example of role-based route:
                <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
                */}
              </Route>
              
              {/* Fallback route */}
              <Route path="*" element={<AuthRedirect />} />
            </Routes>
          </main>
          
          {/* Footer can be added here */}
          <footer className="bg-white py-6 mt-12 border-t">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>© {new Date().getFullYear()} SearchLessons. Barcha huquqlar himoyalangan.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
