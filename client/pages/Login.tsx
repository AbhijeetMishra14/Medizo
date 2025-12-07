import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      setError(err?.message || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------- Google -----------------
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential;
      if (!token) throw new Error("Google token not found.");
      await loginWithGoogle(token);
      navigate('/');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Google login failed.";
      setError(msg);
    }
  };

  const handleGoogleError = () => setError("Google sign-in was unsuccessful.");

  // ----------------- Facebook -----------------
  const handleFacebookResponse = async (response: any) => {
    try {
      const { accessToken, userID } = response;
      if (!accessToken || !userID) throw new Error("Facebook credentials missing.");
      await loginWithFacebook(accessToken, userID);
      navigate('/');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Facebook login failed.";
      setError(msg);
    }
  };

  return (
    <GoogleOAuthProvider clientId="525901919785-pte4phai4fhkteklabqq978q1a32ffr6.apps.googleusercontent.com">
      <div className="container py-12 flex justify-center items-center min-h-[70vh]">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to access your dashboard and manage orders.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg flex items-start">
              <X size={16} className="mt-0.5 mr-2 min-w-[16px]" />
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-primary hover:underline transition">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg bg-primary font-semibold text-primary-foreground text-lg hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center shadow-md shadow-primary/20"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center"><LogIn size={20} className="mr-2" /> Sign In</span>
              )}
            </button>
          </form>

          {/* Social logins */}
          <div className="mt-6">
            <div className="relative flex justify-center text-xs uppercase my-6">
              <span className="bg-white px-2 text-gray-400">Or continue with</span>
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-200 -z-10"></div>
            </div>
            <div className="flex gap-4">
              {/* Google */}
              <div className="flex-1">
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
              </div>
              {/* Facebook */}
              <div className="flex-1">
                <FacebookLogin
                  appId="YOUR_FACEBOOK_APP_ID"
                  callback={handleFacebookResponse}
                  render={(renderProps: any) => (
                    <button
                      onClick={renderProps.onClick}
                      className="w-full h-12 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2 font-medium"
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                        alt="Facebook"
                        className="h-5 w-5"
                      />
                      Facebook
                    </button>
                  )}
                />
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:underline transition">
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
