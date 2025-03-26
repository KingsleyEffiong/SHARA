"use client";
import React from "react";
import { motion } from "framer-motion";
import Input from "@/UI/Input";
import { useRouter, usePathname } from "next/navigation";

function Form({ type }) {
    const router = useRouter();
    const pathname = usePathname();

    // Determine if the current page is "signup"
    const isSignUp = pathname === "/signup";

    // Toggle between login and signup by changing the route
    const toggleAuthMode = () => {
        const newPath = isSignUp ? "/login" : "/signup";
        router.push(newPath, { scroll: false });
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <motion.form
                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                className={`bg-white/10 backdrop-blur-3xl border border-white/20 p-10 rounded-3xl shadow-2xl ${isSignUp ? 'h-[570px] overflow-auto' : ''} w-[420px] space-y-6`}
            >
                <h2 className="text-white text-3xl font-bold text-center">
                    {isSignUp ? "Welcome (Sign Up)" : "Welcome Back (Login)"}
                </h2>

                {isSignUp && (
                    <div className="space-y-2">
                        <label className="text-white text-sm block">Name</label>
                        <Input name="name" placeholder="Enter your name" />
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-white text-sm block">Email</label>
                    <Input email="email" placeholder="Enter your email" />
                </div>

                <div className="space-y-2">
                    <label className="text-white text-sm block">Password</label>
                    <Input password="password" placeholder="Enter your password" />
                </div>

                {isSignUp && (
                    <div className="space-y-2">
                        <label className="text-white text-sm block">Confirm Password</label>
                        <Input password="confirmPassword" placeholder="Confirm your password" />
                    </div>
                )}

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full bg-teal-500 hover:bg-teal-600 transition-all text-white font-semibold py-4 rounded-xl cursor-pointer"
                >
                    {isSignUp ? "Sign Up" : "Login"}
                </motion.button>

                <p className="text-gray-300 text-sm text-center">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <span
                        className="text-teal-400 hover:underline cursor-pointer"
                        onClick={toggleAuthMode}
                    >
                        {isSignUp ? "Login" : "Sign up"}
                    </span>
                </p>
            </motion.form>
        </div>
    );
}

export default Form;
