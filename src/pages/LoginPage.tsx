import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { CompassLogo } from '../components/CompassLogo';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('compassvoyage2024');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#07111E] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B7F500]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <CompassLogo size="lg" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Compass Voyage</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium tracking-wide">
            Compass Logistics International
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D2240] border border-slate-700/80 text-[11px] font-semibold text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B7F500]" /> Secure Enterprise Gateway
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-[#0D2240] border border-slate-800 rounded-2xl p-7 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@compassvoyage.com"
                  required
                  className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#081426] border border-slate-700 focus:border-[#B7F500] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#B7F500] hover:bg-[#a3dc00] text-[#0D2240] font-extrabold text-sm flex items-center justify-center gap-2 transition duration-150 disabled:opacity-50 shadow-lg shadow-[#B7F500]/10 mt-2"
            >
              {loading ? (
                <span>Authenticating with server...</span>
              ) : (
                <>
                  <span>Sign In to Voyage Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Development Demo Credentials Autofill */}
          <div className="mt-6 pt-5 border-t border-slate-800">


            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('admin@compassvoyage.com')}
                className="text-left p-2 rounded-lg bg-[#081426] hover:bg-[#122440] border border-slate-800 hover:border-[#B7F500]/40 text-xs transition group"
              >
                <div className="font-semibold text-white group-hover:text-[#B7F500]">Operations Admin</div>
                <div className="text-[10px] text-slate-400 truncate">admin@compassvoyage.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('jordan@northstarhome.com')}
                className="text-left p-2 rounded-lg bg-[#081426] hover:bg-[#122440] border border-slate-800 hover:border-[#B7F500]/40 text-xs transition group"
              >
                <div className="font-semibold text-white group-hover:text-[#B7F500]">Customer 1 (Jordan)</div>
                <div className="text-[10px] text-slate-400 truncate">jordan@northstarhome.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('tariq@apextechnologies.io')}
                className="text-left p-2 rounded-lg bg-[#081426] hover:bg-[#122440] border border-slate-800 hover:border-[#B7F500]/40 text-xs transition group"
              >
                <div className="font-semibold text-white group-hover:text-[#B7F500]">Customer 2 (Delayed)</div>
                <div className="text-[10px] text-slate-400 truncate">tariq@apextechnologies.io</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('ml.zhou@pacificrimimports.com')}
                className="text-left p-2 rounded-lg bg-[#081426] hover:bg-[#122440] border border-slate-800 hover:border-[#B7F500]/40 text-xs transition group"
              >
                <div className="font-semibold text-white group-hover:text-[#B7F500]">Customer 3 (Arriving)</div>
                <div className="text-[10px] text-slate-400 truncate">ml.zhou@pacificrimimports.com</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 Compass Logistics International. All rights reserved.
        </p>
      </div>
    </div>
  );
};
