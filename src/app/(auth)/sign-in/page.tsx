import { Button } from "@/components/ui/button";
import React from "react";
import Image from 'next/image';
import Link from 'next/link';

function SignInPage() {
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
          <h1 className="text-3xl font-semibold py-2.5">Log in</h1>
          <p className="text-sm font-normal text-gray-400 gray-100 mb-10">Welcome back! Please Enter Your Credentials.</p>
          <form action="/enforce" method="POST">
            <div className="mb-6">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Name</label>
              <input type="name" placeholder="Enter your name.." className="w-full px-3 py-2 border rounded" required />
            </div>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Password</label>
              <input type="password" placeholder="********" className="w-full px-3 py-2 border rounded" minLength={6} required />
            </div>
            <div className="flex items-center justify-between mb-7">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 font-base text-gray-400" />
                Remember me
              </label>
              <a href="#" className="text-sm underline text-gray-400 font-normal">Forgot your password?</a>
            </div>
            <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 relative group">
              Login
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
              Don't have an account? <Link href="/sign-up" className="text-sky-600 font-semibold">Sign Up</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignInPage;
