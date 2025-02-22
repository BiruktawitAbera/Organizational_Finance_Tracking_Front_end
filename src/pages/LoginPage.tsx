import { Button } from "../components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Axios instance

interface SignInPageProps {
  onLogin: (token: string) => void;
}

function SignInPage({ onLogin }: SignInPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const response = await api.post("/api/token/", { email, password });

      if (response.data.force_password_change) {
        navigate("/enforce", { state: { email } }); // Redirect to /enforce page
        return;
      }

      const token = response.data.token;
      localStorage.setItem("authToken", token); // Store token
      onLogin(token); // Update state in parent component
      navigate("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.data?.force_password_change) {
        navigate("/enforce", { state: { email } }); // Redirect to /enforce page
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
          <p className="mb-10 text-sm font-normal text-gray-400 gray-100">Welcome back! Please Enter Your Credentials.</p>
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
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Password</label>
              <input 
                type="password" 
                placeholder="********" 
                className="w-full px-3 py-2 border rounded" 
                minLength={6} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between mb-7">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 text-gray-400 font-base" />
                Remember me
              </label>
              <a href="#" className="text-sm font-normal text-gray-400 underline">Forgot your password?</a>
            </div>
            <Button type="submit" className="relative w-full bg-sky-600 hover:bg-sky-700 group">
              Login
              <span className="absolute transition-opacity transition-transform duration-300 ease-out transform translate-x-4 opacity-0 right-4 group-hover:translate-x-0 group-hover:opacity-100">→</span>
            </Button>
          </form>
          <div className="flex items-center my-7">
            <hr className="flex-grow" />
            <span className="mx-2 text-gray-400">or</span>
            <hr className="flex-grow" />
          </div>
          <div className="text-center">
            <p className="my-6 text-sm text-gray-500">
              Don't have an account? <a href="/register" className="font-semibold text-sky-600">Sign Up</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignInPage;
