"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Input from "@/UI/Input";
import { useRouter, usePathname } from "next/navigation";

function Form({ signUpUser, loginUser, loading }) {
    const router = useRouter();
    const pathname = usePathname();
    const isSignUp = pathname === "/signup";

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        ...(isSignUp && { name: "", confirmPassword: "" }),
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignUp) {
            if (!formData.email.trim() || !formData.password.trim() || !formData.name.trim() || !formData.confirmPassword.trim()) {
                alert('Input all fields');
                return;
            }

            if (formData.password !== formData.confirmPassword) alert('Passwords doesnt match')

            signUpUser(formData);
        } else {
            if (!formData.email.trim() || !formData.password.trim()) {
                alert('Input all fields');
                return;
            }

            loginUser(formData);
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen">
            <motion.form
                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                onSubmit={handleSubmit}
                className={`bg-white/10 backdrop-blur-3xl border border-white/20 p-10 rounded-3xl shadow-2xl ${isSignUp ? "h-[570px] overflow-auto" : ""
                    } w-[420px] space-y-6`}
            >
                <h2 className="text-white text-3xl font-bold text-center">
                    {isSignUp ? "Welcome (Sign Up)" : "Welcome Back (Login)"}
                </h2>

                {isSignUp && (
                    <div className="space-y-2">
                        <label className="text-white text-sm block">Name</label>
                        <Input
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}

                        />
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-white text-sm block">Email</label>
                    <Input
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}

                    />
                </div>

                <div className="space-y-2">
                    <label className="text-white text-sm block">Password</label>
                    <Input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}

                    />
                </div>

                {isSignUp && (
                    <div className="space-y-2">
                        <label className="text-white text-sm block">Confirm Password</label>
                        <Input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}

                        />
                    </div>
                )}

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-500 hover:bg-teal-600 transition-all text-white font-semibold py-4 rounded-xl cursor-pointer"
                >
                    {loading ? 'Loading.......' : isSignUp ? "Sign up" : "Login"}
                </motion.button>

                <p className="text-gray-300 text-sm text-center">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <span
                        className="text-teal-400 hover:underline cursor-pointer"
                        onClick={() => router.push(isSignUp ? "/login" : "/signup", { scroll: false })}
                    >
                        {loading ? 'Loading' : isSignUp ? "Login" : "Sign up"}
                    </span>
                </p>
            </motion.form>
        </div>
    );
}

export default Form;
