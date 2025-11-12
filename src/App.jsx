import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn.jsx' 

function StudentsDashboard() {
  return <h2 className="text-center mt-10 text-2xl font-semibold">Student Dashboard</h2>;
}

function TeachersDashboard() {
  return <h2 className="text-center mt-10 text-2xl font-semibold">Teacher Dashboard</h2>;
}

function AdminDashboard() {
  return <h2 className="text-center mt-10 text-2xl font-semibold">Admin Dashboard</h2>;
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access');
  if(!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}
export default function App() {
  return (
    <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/student/dashboard" element={
          <ProtectedRoute>
            <StudentsDashboard />
          </ProtectedRoute>
        }
        />
        <Route path="/teacher/dashboard" element={
          <ProtectedRoute>
            <TeachersDashboard/>
          </ProtectedRoute>
        }
        />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard/>
          </ProtectedRoute>
        }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes> 
  );
}

