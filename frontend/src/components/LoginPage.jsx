/**
 * LoginPage.jsx
 * 
 * Purpose:
 * Renders the secure Login page component for AI Financial Guardian requiring
 * just username and password authentication.
 * 
 * Responsibilities:
 * - Collect username and password input.
 * - Provide credentials validation and submission handling.
 * - Render link/switch trigger to navigate to Sign Up page.
 * 
 * Dependencies:
 * - lucide-react (Shield, Lock, User, KeyRound, ArrowRight, Eye, EyeOff)
 */

import React, { useState } from 'react';
import { Shield, Lock, User, KeyRound, ArrowRight, Eye, EyeOff } from 'lucide-react';

export function LoginPage({ onLoginSuccess, switchToSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Simulate auth call or invocation
      await new Promise((resolve) => setTimeout(resolve, 600));
      onLoginSuccess({ username });
    } catch (err) {
      setError('Invalid credentials. Please check your username and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel glow-border-emerald rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500"></div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-glow mb-1">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 font-sans tracking-tight">
            AI Financial Guardian
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to access your zero-trust financial cockpit
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-glow transition-all active:scale-[0.98]"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link to Sign Up */}
        <div className="text-center border-t border-slate-800 pt-4 text-xs text-slate-400">
          Don't have an account?{' '}
          <button
            onClick={switchToSignup}
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
