import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import api from "../api";

function SignUpPage() {
  // State for each field in the form
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // Username entered manually
  const [department, setDepartment] = useState("operation");
  const [role, setRole] = useState("admin");
  const [salary, setSalary] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  // Handle form submission
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post("/api/accounts/register/", {
        username,
        email,
        department,
        role,
        salary,
      });

      // ✅ Store the token immediately after registration
      localStorage.setItem("auth_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      setSuccess("Registration successful! Redirecting...");
      
      // ✅ Redirect user to Enforce Password Change page
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.username?.[0] ||
        err?.response?.data?.detail ||
        "Registration failed. Please try again.";
      setError(errorMsg);
    }
  };
  return (
    <main className="flex w-full min-h-screen">
      <section className="relative flex items-center justify-center flex-1 p-2 overflow-hidden bg-white">
        <div className="w-full max-w-md px-6 pt-2 mx-auto bg-white rounded-lg shadow-md animate-fadeIn">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full">
              <img src="/logo.png" alt="HorizonLogo" width={33} height={33} />
            </div>
            <h1 className="font-serif text-3xl font-bold">BudgetWise</h1>
          </div>

          <h1 className="text-3xl font-semibold py-2.5">Register</h1>
          <p className="mb-4 text-sm font-normal text-gray-400">
            Welcome! Please fill in the details to register.
          </p>

          {success && <p className="mb-4 text-sm font-semibold text-green-600">{success}</p>}
          {error && <p className="mb-4 text-sm font-semibold text-red-600">{error}</p>}

          <form onSubmit={handleRegister}>
            {/* Email Field */}
            <div className="mb-6">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email address.."
                className="w-full px-3 py-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Username Field (Manually entered by user) */}
            <div className="mb-6">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">
                Username
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Let the user enter a username
                placeholder="Enter your username"
                required
              />
            </div>
            {/* Department Field */}
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">
                Department
              </label>
              <select
                className="w-full px-3 py-2 border rounded"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="operation">Operation</option>
                <option value="finance">Finance</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>

            {/* Role Field */}
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">
                Role
              </label>
              <select
                className="w-full px-3 py-2 border rounded"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>

            {/* Salary Field */}
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">
                Salary
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded"
                placeholder="Salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="relative w-full bg-sky-600 hover:bg-sky-700 group">
              Register
              <span className="absolute transition-opacity transition-transform duration-300 ease-out transform translate-x-4 opacity-0 right-4 group-hover:translate-x-0 group-hover:opacity-100">
                →
              </span>
            </Button>
          </form>

          <div className="flex items-center my-7">
            <hr className="flex-grow" />
            <span className="mx-2 text-gray-400">or</span>
            <hr className="flex-grow" />
          </div>

          <div className="text-center">
            <p className="my-6 text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-sky-600">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignUpPage;