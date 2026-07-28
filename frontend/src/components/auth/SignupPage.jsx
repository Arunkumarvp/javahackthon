import React, { useState } from 'react';
import { UserPlus, User, KeyRound, ArrowRight, Eye, EyeOff, LayoutGrid } from 'lucide-react';

export function SignupPage({ onSignupSuccess, switchToLogin }) {
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
      // Simulate auth call
      await new Promise((resolve) => setTimeout(resolve, 600));
      onSignupSuccess({ username });
    } catch (err) {
      setError('Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wm-background flex items-center justify-center p-4">
      <div className="w-full max-w-md card-panel p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-wm-blue-light text-wm-blue mb-2">
            <LayoutGrid className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-wm-blue font-sans tracking-tight">
            WealthManager
          </h2>
          <p className="text-sm text-wm-textMuted">
            Create your premium account
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-wm-textMain block">Choose Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-wm-textMuted">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a unique username"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-wm-border focus:border-wm-blue rounded-lg text-sm text-wm-textMain placeholder-slate-400 outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-wm-textMain block">Choose Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-wm-textMuted">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-10 py-2.5 bg-white border border-wm-border focus:border-wm-blue rounded-lg text-sm text-wm-textMain placeholder-slate-400 outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-wm-textMuted hover:text-wm-textMain"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-wm-blue hover:bg-wm-blue-hover text-white font-semibold text-sm transition-colors"
          >
            <span>{isLoading ? 'Creating Account...' : 'Register'}</span>
            <UserPlus className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-4 text-sm text-wm-textMuted">
          Already have an account?{' '}
          <button
            onClick={switchToLogin}
            className="text-wm-blue hover:text-wm-blue-hover font-semibold transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
