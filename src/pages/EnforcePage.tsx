import { useState } from "react";
import { Button } from "../components/ui/button.tsx";
import api from "../api"; // Axios instance

function EnforcePage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    // Check if new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("New Password and Confirm New Password must match.");
      return;
    }

    setLoading(true);

    // Retrieve the access token from localStorage
    const token = localStorage.getItem("auth_token");

    // Debug: Log the token
    console.log("Access Token:", token);

    if (!token) {
      setErrorMessage("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      // Send the password change request
      const response = await api.post(
        "/change-password/", // Replace with your actual endpoint
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Debug: Log the API response
      console.log("API Response:", response.data);

      if (response.status === 200) {
        // Update tokens in localStorage
        localStorage.setItem("auth_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        // Show success message
        alert(response.data.message || "Password changed successfully!");

        // Fetch the user's role after password change
        const roleResponse = await api.get("/api/accounts/user-role/", {
          headers: { Authorization: `Bearer ${response.data.access}` },
        });

        // Update user role in localStorage
        const userRole = roleResponse.data.role?.toLowerCase();
        localStorage.setItem("user_role", userRole);

        // Redirect to home page
        window.location.href = "/";
      }
    } catch (error: any) {
      // Debug: Log the error
      console.error("API Error:", error.response?.data);

      // Handle token expiry
      if (error.response?.status === 401 && error.response?.data?.code === "token_not_valid") {
        try {
          // Attempt to refresh the token
          const refreshToken = localStorage.getItem("refresh_token");

          if (refreshToken) {
            const refreshResponse = await api.post("/token/refresh/", {
              refresh: refreshToken,
            });

            // Update the access token
            localStorage.setItem("auth_token", refreshResponse.data.access);

            // Retry the password change request
            const retryResponse = await api.post(
              "/change-password/",
              {
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmNewPassword,
              },
              {
                headers: {
                  Authorization: `Bearer ${refreshResponse.data.access}`,
                },
              }
            );

            // Handle successful retry
            if (retryResponse.status === 200) {
              localStorage.setItem("auth_token", retryResponse.data.access);
              localStorage.setItem("refresh_token", retryResponse.data.refresh);

              alert(retryResponse.data.message || "Password changed successfully!");
              window.location.href = "/";
              return;
            }
          }
        } catch (refreshError: any) {
          console.error("Token Refresh Error:", refreshError.response?.data);
          setErrorMessage("Session expired. Please log in again.");
        }
      } else {
        // Set error message based on API response
        setErrorMessage(
          error.response?.data?.error ||
          error.response?.data?.detail ||
          "An error occurred. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex w-full min-h-screen">
      <section className="relative flex items-center justify-center flex-1 p-2 overflow-hidden bg-white">
        <div className="w-full max-w-md px-6 pt-2 pb-6 mx-auto bg-white rounded-lg shadow-md animate-fadeIn">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full">
              <img src="/logo.png" alt="Logo" width={33} height={33} />
            </div>
            <h1 className="font-serif text-3xl font-bold">BudgetWise</h1>
          </div>
          <h1 className="text-3xl font-semibold py-2.5">Change Password</h1>
          <p className="mb-10 text-sm font-normal text-gray-400">Enter your credentials to update your password.</p>

          {errorMessage && (
            <div className="mb-4 text-red-500">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">
                Old Password
              </label>
              <input
                type="password"
                placeholder="Enter your old password.."
                className="w-full px-3 py-2 border rounded"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter your new password.."
                className="w-full px-3 py-2 border rounded"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Re-enter your new password.."
                className="w-full px-3 py-2 border rounded"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="relative w-full bg-sky-600 hover:bg-sky-700 group"
              disabled={loading}
            >
              {loading ? "Updating..." : "Change Password"}
              <span className="absolute transition-opacity transition-transform duration-300 ease-out transform translate-x-4 opacity-0 right-4 group-hover:translate-x-0 group-hover:opacity-100">
                →
              </span>
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default EnforcePage;