import { Button } from "@/components/ui/button";
import React from "react";
import Image from 'next/image';
import Link from 'next/link';

function SignUpPage() {
  return (
    <main className="flex min-h-screen w-full">
      <section className="flex-1 bg-white flex p-2 items-center justify-center relative overflow-hidden">
        <div className="bg-white rounded-lg w-full max-w-md mx-auto animate-fadeIn shadow-md px-6 pt-2">
          <div className="flex items-center mb-4">
            <div className="rounded-full p-2">
              <Image src="/horizon-logo.png" alt="HorizonLogo" width={33} height={33} />
            </div>
            <h1 className="font-bold text-3xl font-serif">BudgetWise</h1>
          </div>
          <h1 className="text-3xl font-semibold py-2.5">Register</h1>
          <p className="text-sm font-normal text-gray-400 gray-100 mb-10">Welcome! Please Enter these details to register.</p>
          <form>
            <div className="mb-6">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Email</label>
              <input type="email" placeholder="Enter your email address.." className="w-full px-3 py-2 border rounded" required />
            </div>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Password</label>
              <input type="password" placeholder="Password" className="w-full px-3 py-2 border rounded" minLength={6} required/>
            </div>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Departmant</label>
              <select className="w-full px-3 py-2 border rounded" required>
                <option value="dept1">Dept 1</option>
                <option value="dept2">Dept 2</option>
                <option value="dept3">Dept 3</option>
              </select>
            </div>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Role</label>
              <select className="w-full px-3 py-2 border rounded" required>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">salary</label>
              <input type="numbers" className="w-full px-3 py-2 border rounded" placeholder="salary" maxLength={5} required />
            </div>
            <Button className="w-full bg-sky-600 hover:bg-sky-700 relative group">
              Register
              <span className="absolute right-4 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-transform transition-opacity duration-300 ease-out">→</span>
            </Button>
          </form>
          <div className="flex items-center my-7">
            <hr className="flex-grow" />
            <span className="mx-2 text-gray-400">or</span>
            <hr className="flex-grow" />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 my-6">
              Already have an account? <Link href="/sign-in" className="text-sky-600 font-semibold">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignUpPage;
