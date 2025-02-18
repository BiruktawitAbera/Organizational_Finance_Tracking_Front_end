import { Button } from "../components/ui/button.tsx";
import { useState } from "react";

function EnforcePage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword === currentPassword) {
      setErrorMessage("New Password must be different from Current Password.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("New Password and Confirm New Password must match.");
      return;
    }    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setErrorMessage('');

    alert("Password changed successfully!");
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
          <p className="mb-10 text-sm font-normal text-gray-400">Welcome back! Please Enter Your Credentials.</p>

          {errorMessage && (
            <div className="mb-4 text-red-500">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Current Password</label>
              <input
                type="password"
                placeholder="********"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                minLength={6}
                required
              />
            </div>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">New Password</label>
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
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Confirm New Password</label>
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
            <Button type="submit" className="relative w-full bg-sky-600 hover:bg-sky-700 group">
              Change Password
              <span className="absolute transition-opacity transition-transform duration-300 ease-out transform translate-x-4 opacity-0 right-4 group-hover:translate-x-0 group-hover:opacity-100">→</span>
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default EnforcePage;
