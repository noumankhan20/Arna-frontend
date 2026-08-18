"use client";

import { useState, useEffect } from "react";
import { X, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGoogleLoginMutation, useLoginMutation, useSignupMutation } from "@/redux/slices/authApislice";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
export default function LoginModal({ isOpen, onClose, redirectPath = "/profile" }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const [mode, setMode] = useState("login"); // 'login' or 'signup'
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        emailOrPhone: "",
        phoneNo: "",
        password: "",
        email: "", // for signup
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [login] = useLoginMutation();
    const [googleLogin] = useGoogleLoginMutation();
    const [signup] = useSignupMutation();
    const router = useRouter();
    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            if (!window.google) return;

            clearInterval(interval);

            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: async (response) => {
                    try {
                        setLoading(true);
                        await googleLogin({ credential: response.credential }).unwrap();
                        onClose();
                        router.push(redirectPath);
                    } catch (err) {
                        console.error("Google login failed", err);
                    } finally {
                        setLoading(false);
                    }
                },
                ux_mode: "popup",
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isOpen, googleLogin, onClose, redirectPath]);

    const validate = () => {
        const newErrors = {};
        if (mode === "signup") {
            if (!formData.name) newErrors.name = "Name is required";
            if (!formData.email) {
                newErrors.email = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = "Invalid email format";
            }
            if (!formData.phoneNo) {
                newErrors.phoneNo = "Phone number is required";
            } else if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNo)) {
                newErrors.phoneNo = "Invalid phone number";
            }
        } else {
            if (!formData.emailOrPhone) {
                newErrors.emailOrPhone = "Email or Phone is required";
            }
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (mode === "signup" && formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);

            if (mode === "login") {
                await login({
                    email: formData.emailOrPhone,
                    password: formData.password,
                }).unwrap();
            } else {
                await signup({
                    name: formData.name,
                    email: formData.email,
                    phoneNo: formData.phoneNo,
                    password: formData.password,
                }).unwrap();

                // Auto-login after signup or ask to login
                // For better UX, we'll try to login immediately if backend allows or just switch to login
                setMode("login");
                setFormData(prev => ({ ...prev, emailOrPhone: prev.email }));
                setErrors({ success: "Signup successful! Please login with your password." });
                setLoading(false);
                return;
            }

            onClose();
            router.push(redirectPath);
        } catch (err) {
            console.error(`${mode} error:`, err);
            setErrors({
                api: err?.data?.message || `Failed to ${mode}. Please try again.`,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        if (!window.google) {
            alert("Google SDK not loaded");
            return;
        }
        window.google.accounts.id.prompt();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name] || errors.api || errors.success) {
            setErrors((prev) => ({ ...prev, [name]: "", api: "", success: "" }));
        }
    };

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-6 sm:p-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-1">
                                    {mode === "login" ? "Welcome Back" : "Create Account"}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {mode === "login" ? "Log in to your account" : "Join us for a better experience"}
                                </p>
                            </div>

                            {errors.api && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs text-center animate-shake">
                                    {errors.api}
                                </div>
                            )}

                            {errors.success && (
                                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-xs text-center">
                                    {errors.success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {mode === "signup" && (
                                    <>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-700 ml-1">Full Name</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm text-gray-900 ${errors.name ? "border-red-500" : "border-gray-200"}`}
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            {errors.name && <p className="text-[10px] text-red-500 ml-1">{errors.name}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-700 ml-1">Email Address</label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm text-gray-900 ${errors.email ? "border-red-500" : "border-gray-200"}`}
                                                    placeholder="john@example.com"
                                                />
                                                <Mail className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                                            </div>
                                            {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-700 ml-1">Phone Number</label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    name="phoneNo"
                                                    value={formData.phoneNo}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm text-gray-900 ${errors.phoneNo ? "border-red-500" : "border-gray-200"}`}
                                                    placeholder="+91 9876543210"
                                                />
                                            </div>
                                            {errors.phoneNo && <p className="text-[10px] text-red-500 ml-1">{errors.phoneNo}</p>}
                                        </div>
                                    </>
                                )}

                                {mode === "login" && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-700 ml-1">Email or Phone</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="emailOrPhone"
                                                value={formData.emailOrPhone}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm text-gray-900 ${errors.emailOrPhone ? "border-red-500" : "border-gray-200"}`}
                                                placeholder="user@example.com"
                                            />
                                            <Mail className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                                        </div>
                                        {errors.emailOrPhone && <p className="text-[10px] text-red-500 ml-1">{errors.emailOrPhone}</p>}
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-medium text-gray-700">Password</label>
                                        {mode === "login" && (
                                            <Link href="/forgot-password" size="sm" className="text-[10px] font-medium text-emerald-600 hover:underline">
                                                Forgot?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm text-gray-900 ${errors.password ? "border-red-500" : "border-gray-200"}`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-[10px] text-red-500 ml-1">{errors.password}</p>}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-[#1e5e3f] hover:bg-[#164a32] text-white font-medium rounded-xl shadow-lg shadow-[#1e5e3f]/20 flex items-center justify-center gap-2 transition-all mt-2"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {mode === "login" ? "Sign In" : "Sign Up"} <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </motion.button>

                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-100"></div>
                                    </div>
                                    <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                                        <span className="px-2 bg-white text-gray-400 font-medium">Or continue with</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-gray-500 text-sm">
                                    {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                                    <button
                                        onClick={() => setMode(mode === "login" ? "signup" : "login")}
                                        className="font-semibold text-[#1e5e3f] hover:underline"
                                    >
                                        {mode === "login" ? "Create one" : "Login instead"}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
