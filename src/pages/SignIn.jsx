import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");

  const SignIn = "http://127.0.0.1:8000/quizapp/api/token/"; // your backend JWT endpoint

  async function handleSignIn(e) {
    e.preventDefault();
    setError("");
    console.log("Sign in clicked");

    if (!email || !password) {
      console.log("Missing credentials");
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    console.log("Sending request to:", SignIn);

    try {
      const response = await fetch(SignIn, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ 
            email: email,
            password: password,
            role: role,
             }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.detail || data.non_field_errors?.[0] || "Failed to sign in");
      }

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("role_id", data.user.role_id);

      console.log("Login successful. Tokens saved.");

      switch (data.user.role_id) {
    case 1:
      navigate("/admin/dashboard");
      break;
    case 2:
      navigate("/teacher/dashboard");
      break;
    case 3:
      navigate("/student/dashboard");
      break;
    default:
      navigate("/");
      }
      
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    // Optional: call same endpoint with admin credentials
    alert(`Admin login for: ${adminUser}`);
  }

  //RETURN IS NOW INSIDE THE COMPONENT
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white to-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8"
      >
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">QuizApp</h1>
            <p className="text-sm text-gray-500">Sign in to continue</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAdminModal(true)}
              title="Admin login"
              className="text-xs px-3 py-1 border rounded-full hover:bg-gray-50"
            >
              Admin
            </button>
            <a
              href="/register"
              className="text-xs px-3 py-1 border rounded-full hover:bg-gray-50"
            >
              Register
            </a>
          </div>
        </header>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email ID</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border rounded-lg px-3 py-2"
              placeholder="Username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border rounded-lg px-3 py-2"
              placeholder="Password"
            />
          </div>

          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center">
              <input
                id="role_student"
                type="radio"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={() => setRole("student")}
                className="mr-3"
              />
              <label htmlFor="role_student" className="text-sm">
                Student
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="role_teacher"
                type="radio"
                name="role"
                value="teacher"
                checked={role === "teacher"}
                onChange={() => setRole("teacher")}
                className="mr-3"
              />
              <label htmlFor="role_teacher" className="text-sm">
                Teacher
              </label>
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <a href="/forgot-password" className="text-sm text-gray-500 hover:underline">
              Forgot?
            </a>
          </div>
        </form>

        <footer className="mt-6 text-xs text-gray-400">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="underline">
              Register
            </a>
          </p>
        </footer>

        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black opacity-30"
              onClick={() => setShowAdminModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-10 bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm"
            >
              <h3 className="text-lg font-semibold mb-2">Admin quick-login</h3>
              <p className="text-xs text-gray-500 mb-4">
                A Django superuser should already exist. Enter admin credentials to continue.
              </p>
              <form onSubmit={handleAdminLogin} className="space-y-3">
                <div>
                  <label className="block text-sm">Admin username</label>
                  <input
                    type="text"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    className="mt-1 block w-full border rounded-lg px-3 py-2"
                    placeholder="admin"
                  />
                </div>
                <div>
                  <label className="block text-sm">Admin password</label>
                  <input
                    type="password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="mt-1 block w-full border rounded-lg px-3 py-2"
                    placeholder="password"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(false)}
                    className="px-3 py-1 rounded-lg border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 rounded-lg bg-indigo-600 text-white"
                  >
                    Login
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}