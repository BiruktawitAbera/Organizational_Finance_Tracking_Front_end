import { useState } from "react";
import api from "../api"; // Axios instance

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // To track loading state
  const [error, setError] = useState<string | null>(null); // To track error state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error and message before new request
    setError(null);
    setMessage("");
    setIsLoading(true);

    try {
      // Make sure to omit the Authorization header here
      const response = await api.post("/api/accounts/request-password-reset/", { email }, {
        headers: {
          // No Authorization header here, we don't need it for unauthenticated requests
        },
      });
      setMessage(response.data.message);
      setEmail(""); // Clear the email field after successful submission
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.message || "Error sending reset email. Please try again.");
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false); // Reset loading state regardless of success or failure
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {/* Show success message */}
      {message && (
        <p className="mt-4 text-green-600 font-semibold text-center">{message}</p>
      )}

      {/* Show error message */}
      {error && (
        <p className="mt-4 text-red-600 font-semibold text-center">{error}</p>
      )}
    </div>
  );
};

export default ForgotPassword;
