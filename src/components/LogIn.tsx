import React, { useState } from "react";

import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { useRouter } from "@tanstack/react-router";

const LogIn = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    setError("");

    try {
      // Validate inputs first
      if (!email || !password) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      // Import Supabase dynamically on the client side
      const { supabase } = await import("../lib/supabase");

      // Call Supabase directly to authenticate
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Login failed');
      }

      console.log("Login successful:", authData.user.email);

      // Redirect to home page after successful login
      await router.navigate({ to: "/" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      console.error('Login error:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (_credentialResponse: any) => {
    try {
      setIsLoading(true);
      setError("");

      // Google OAuth is handled by Supabase's GoogleLogin component
      // Just redirect after successful auth
      console.log("Google Sign-In successful");

      // Redirect to home page after successful login
      await router.navigate({ to: "/" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google Sign-In failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In failed. Please try again.");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans text-slate-900">
      {/* Navigation */}

      <Navigation tab="Log In" />

      {/* Main Content */}

      <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Decorative Background Elements */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        {/* Login Card */}

        <div className="relative w-full max-w-md">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

          <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-8">
            {/* Header */}

            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>

              <p className="text-slate-600">Sign in to your Build My Cakes account</p>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Email Field */}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-800">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-800">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                    disabled={isLoading}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}

              <div className="flex justify-end">
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:translate-y-[-2px] shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Google Sign-In Button */}

              <div className="w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  width="100%"
                />
              </div>
            </form>

            {/* Divider */}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>

              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Don't have an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}

            <button
              onClick={() => router.navigate({ to: "/sign-up" })}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all hover:bg-slate-50"
            >
              Sign Up
              <ArrowRight size={18} />
            </button>

            {/* Footer */}

            <p className="text-center text-xs text-slate-500">
              By signing in, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>


      </div>
        {/* Footer Component */}
        <Footer />
    </div>
  );
};

export default LogIn;
