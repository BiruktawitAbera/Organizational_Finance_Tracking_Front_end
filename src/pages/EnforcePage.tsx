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

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("New Password and Confirm New Password must match.");
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("auth_token")?.replace(/['"]+/g, ""); // ✅ Ensure correct key

    if (!token) {
      setErrorMessage("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(
        "/change-password/",
        {
          old_password: oldPassword,  // ✅ Include old password
          new_password: newPassword,
          confirm_password: confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Ensure correct token format
          },
        }
      );

      if (response.status === 200) {
        // ✅ Store the new tokens after password change
        localStorage.setItem("auth_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        alert(response.data.message || "Password changed successfully!");

        // ✅ Redirect user after password update
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      console.error("API Error:", error.response?.data); // Log error response
      setErrorMessage(
        error.response?.data?.detail || "An error occurred. Please try again."
      );
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

          {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">
                Old Password
              </label>
              <input
                type="password"
                placeholder="********"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                minLength={6}
                required
              />
            </div>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">
                New Password
              </label>
              <input
                type="password"
                placeholder="********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                minLength={6}
                required
              />
            </div>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="********"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                minLength={6}
                required
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
