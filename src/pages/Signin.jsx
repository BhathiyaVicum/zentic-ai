import { FaGoogle, FaGithub, FaEyeSlash, FaEye, FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const Signin = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      console.log("Signed in:", data);
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
    
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gradient-to-b from-brand-muted/30 to-brand-dark/20 border border-brand-light/10 rounded-2xl p-8 md:p-10">

        <div className="text-center mb-8 relative">
          <Link to="/">
            <button
              className="absolute top-2 left-2 text-gray-400 hover:text-white transition md:p-2 hover:bg-white/10 rounded-lg"
              aria-label="Go back"
            >
              <FaArrowLeft size={18} />
            </button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-semibold text-primary-text mb-0">
            Welcome Back!
          </h1>
          <p className="text-gray-400">
            Sign in to continue
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-secondary-text mb-2 font-medium">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-btn-primary py-3 rounded-xl text-primary-text font-semibold hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-secondary-text hover:underline">
              Create account
            </Link>
          </p>
        </form>

        <div className="flex items-center gap-4 my-7">
          <div className="flex-1 border-t border-brand-light/20"></div>
          <span className="text-gray-500 text-sm">Or continue with</span>
          <div className="flex-1 border-t border-brand-light/20"></div>
        </div>

        <div className="grid grid-cols-1">
          <button 
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-brand-light/20 rounded-xl text-primary-text hover:bg-brand-muted/30 transition"
          >
            <FaGoogle />
            Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;