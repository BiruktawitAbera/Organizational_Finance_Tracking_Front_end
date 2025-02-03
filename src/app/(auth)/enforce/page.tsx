"use client"
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function Enforce() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); 
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("New Password and Confirm New Password must match.");
      return;
    }

    console.log("old Password:", oldPassword);
    console.log("New Password:", newPassword);
    
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setErrorMessage('');

    // Redirect to the Admin page
    router.push('/Admin');
  };

  return (
    <main className="flex min-h-screen w-full">
      <section className="flex-1 bg-white flex p-2 items-center justify-center relative overflow-hidden">
        <div className="bg-white rounded-lg w-full max-w-md mx-auto animate-fadeIn shadow-md px-6 pt-2 pb-6">
          <div className="flex items-center mb-4">
            <div className="rounded-full p-2">
              <Image src="/horizon-logo.png" alt="HorizonLogo" width={33} height={33} />
            </div>
            <h1 className="font-bold text-3xl font-serif">BudgetWise</h1>
          </div>
          <h1 className="text-3xl font-semibold py-2.5">Change Password</h1>
          <p className="text-sm font-normal text-gray-400 gray-100 mb-10">Welcome back! Please Enter Your Credentials.</p>

          {errorMessage && (
            <div className="mb-4 text-red-500">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Old Password</label>
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
            <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 relative group">
              Change Password
              <span className="absolute right-4 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-transform transition-opacity duration-300 ease-out">→</span>
            </Button>
          </form>

        </div>
      </section>
    </main>
  );
}

export default Enforce;
