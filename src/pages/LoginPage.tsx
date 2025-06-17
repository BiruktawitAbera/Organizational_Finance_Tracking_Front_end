import { Button } from "../components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Eye, EyeOff } from "lucide-react"; // Assuming you're using Lucide icons

interface SignInPageProps {
  onLogin: (role: string) => void;
}

interface UserData {
  id: number;
  email: string;
  is_department_head: boolean;
  department: string;
  is_manager: boolean;
  is_superuser: boolean;
}

function SignInPage({ onLogin }: SignInPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const response = await api.post("/api/token/", { email, password });

      if (response.data.force_password_change) {
        navigate("/enforce", { state: { email } });
        return;
      }

      // Store tokens
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("user_role", response.data.role);

      // Create user object - FIXED DEPARTMENT HANDLING
      const userData: UserData = {
        id: response.data.user_id || 0,
        email: email,
        is_department_head: response.data.role.toLowerCase() === "department_head",
        // Use actual department from backend response
        department: response.data.department || "",
        is_manager: response.data.role.toLowerCase() === "manager",
        is_superuser: response.data.role.toLowerCase() === "admin"
      };
      
      localStorage.setItem("user", JSON.stringify(userData));

      await onLogin(response.data.role.toLowerCase());
      navigate("/");
    } catch (error: any) {
      if (error.response?.data?.force_password_change) {
        navigate("/enforce", { state: { email } });
      } else {
        setErrorMessage(error?.response?.data?.detail || "Invalid credentials");
      }
    }
  };

  return (
    <main className="flex w-full min-h-screen">
      <section className="relative flex items-center justify-center flex-1 p-2 overflow-hidden bg-white">
        <div className="w-full max-w-md px-6 pt-2 mx-auto bg-white rounded-lg shadow-md animate-fadeIn">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full">
              <img src="logo.png" alt="HorizonLogo" width={33} height={33} />
            </div>
            <h1 className="font-serif text-3xl font-bold">BudgetWise</h1>
          </div>
          <h1 className="text-3xl font-semibold py-2.5">Log in</h1>
          <p className="mb-10 text-sm font-normal text-gray-400 gray-100">
            Welcome back! Please Enter Your Credentials.
          </p>
          {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Email</label>
              <input 
                type="email" 
                placeholder="Enter your email.." 
                className="w-full px-3 py-2 border rounded" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-2.5 relative">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="********" 
                className="w-full px-3 py-2 border rounded" 
                minLength={6} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-14 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
                        </div>
            <div className="flex items-center justify-between mb-7">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 text-gray-400 font-base" />
                Remember me
              </label>
              <a href="ForgotPassword" className="text-sm font-normal text-gray-400 underline">Forgot your password?</a>
            </div>
            <Button type="submit" className="relative w-full bg-sky-600 hover:bg-sky-700 group">
              Login
              <span className="absolute transition-opacity transition-transform duration-300 ease-out transform translate-x-4 opacity-0 right-4 group-hover:translate-x-0 group-hover:opacity-100">→</span>
            </Button>
          </form>

        </div>
      </section>
    </main>
  );
}

export default SignInPage;