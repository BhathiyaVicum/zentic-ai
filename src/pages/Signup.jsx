import { FaGoogle, FaEyeSlash, FaEye, FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gradient-to-b from-brand-muted/30 to-brand-dark/20 border border-brand-light/10 rounded-2xl p-8 md:p-10">

        <div className="text-center mb-8 relative ">

          <Link to="/">
            <button
              className="absolute top-2 left-2 text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-lg"
              aria-label="Go back"
            >
              <FaArrowLeft size={18} />
            </button>
          </Link>

          <h1 className="text-3xl font-semibold text-primary-text mb-1">
            Create Account
          </h1>
          <p className="text-gray-400">
            Join ZenticAI today
          </p>
        </div>

        <form className="space-y-6">

          <div>
            <label className="block text-secondary-text mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-brand-dark/50 border border-brand-light/20 rounded-xl text-primary-text placeholder-gray-500 focus:outline-none focus:border-secondary-text transition"
            />
          </div>

          <div>
            <label className="block text-secondary-text mb-2 font-medium">
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-brand-dark/50 border border-brand-light/20 rounded-xl text-primary-text placeholder-gray-500 focus:outline-none focus:border-secondary-text transition"
            />
          </div>

          <div>
            <label className="block text-secondary-text mb-2 font-medium">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 bg-brand-dark/50 border border-brand-light/20 rounded-xl text-primary-text placeholder-gray-500 focus:outline-none focus:border-secondary-text transition"
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>

            </div>
          </div>

          {/* Sign Up Button */}
          <button className="w-full bg-btn-primary py-3 rounded-xl text-primary-text font-semibold hover:opacity-80 transition">
            Sign Up
          </button>

          <p className="text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/signin">
              <span className="text-secondary-text hover:underline cursor-pointer">
                Sign in
              </span>
            </Link>
          </p>

        </form>

        <div className="flex items-center gap-4 mt-6 my-8">
          <div className="flex-1 border-t border-brand-light/20"></div>
          <span className="text-gray-500 text-sm">Or continue with</span>
          <div className="flex-1 border-t border-brand-light/20"></div>
        </div>

        <div className="grid grid-cols-1">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-brand-light/20 rounded-xl text-primary-text hover:bg-brand-muted/30 transition">
            <FaGoogle />
            Google
          </button>
        </div>

      </div>
    </div>
  );
};

export default Signup;