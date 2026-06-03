import { FaGoogle, FaEyeSlash, FaEye, FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

const Signup = () => {

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Check password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Sign out any existing user first to prevent session conflict
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        await supabase.auth.signOut();
      }

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/signin`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Check if user needs email confirmation
      if (data.user?.identities?.length === 0) {
        setError("User already registered. Please sign in instead.");
        setLoading(false);
        return;
      }

      // Create profile in database
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: email,
          full_name: fullName,
        });

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }
      }

      // Success
      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate("/signin");
      }, 10000);

    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    
    // Sign out any existing user first
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      await supabase.auth.signOut();
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-gradient-to-b from-brand-muted/30 to-brand-dark/20 border border-brand-light/10 rounded-2xl p-8 md:p-10 text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-semibold text-primary-text mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-400 mb-6">
            Please check your email to confirm your account.
            <br />
            Redirecting to sign in...
          </p>
          <Link to="/signin">
            <button className="text-secondary-text hover:underline">
              Go to Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gradient-to-b from-brand-muted/30 to-brand-dark/20 border border-brand-light/10 rounded-2xl p-8 md:p-10">

        <div className="text-center mb-8 relative ">

          <Link to="/">
            <button
              className="absolute top-2 left-2 text-gray-400 hover:text-white transition md:p-2 hover:bg-white/10 rounded-lg"
              aria-label="Go back"
            >
              <FaArrowLeft size={18} />
            </button>
          </Link>

          <h1 className="text-2xl md:text-3xl font-semibold text-primary-text mb-0">
            Create Account
          </h1>
          <p className="text-gray-400">
            Join ZenticAI today
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">

          <div>
            <label className="block text-secondary-text mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
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
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-secondary-text mb-2 font-medium">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 bg-brand-dark/50 border border-brand-light/20 rounded-xl text-primary-text placeholder-gray-500 focus:outline-none focus:border-secondary-text transition"
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                onClick={() => setShowConfirmPassword(prev => !prev)}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>

            </div>
          </div>

          {/* Sign Up Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-btn-primary py-3 rounded-xl text-primary-text font-semibold hover:opacity-80 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
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
          <button 
            onClick={handleGoogleSignup} 
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

export default Signup;