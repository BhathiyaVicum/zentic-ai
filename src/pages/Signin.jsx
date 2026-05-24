import { FaGoogle, FaGithub, FaEyeSlash, FaEye } from "react-icons/fa";
import { useState } from "react";

const Signin = () => {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gradient-to-b from-brand-muted/30 to-brand-dark/20 border border-brand-light/10 rounded-2xl p-8 md:p-10">

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-3xl font-semibold text-primary-text mb-1">
            Welcome Back!
          </h1>
          <p className="text-gray-400">
            Sign in to continue
          </p>
        </div>

        <form className="space-y-6">

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

          <div className="text-right">
            <a href="#" className="text-sm text-secondary-text hover:underline">
              Forgot password?
            </a>
          </div>

          <button className="w-full bg-btn-primary py-3 rounded-xl text-primary-text font-semibold hover:opacity-80 transition">
            Sign In
          </button>

          <p className="text-center text-gray-400 mt-6">
            Don't have an account?{" "}
            <a href="#" className="text-secondary-text hover:underline">
              Create account
            </a>
          </p>

        </form>

        <div className="relative mt-8 mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-light/20"></div>
          </div>

          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-black text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-brand-light/20 rounded-xl text-primary-text hover:bg-brand-muted/30 transition">
            <FaGoogle />
            Google
          </button>

          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-brand-light/20 rounded-xl text-primary-text hover:bg-brand-muted/30 transition">
            <FaGithub />
            GitHub
          </button>

        </div>

      </div>
    </div>
  );
};

export default Signin;