'use client';

import { useState, useEffect } from 'react';
import { Mail, Key, Loader2, ArrowLeft } from 'lucide-react';
import { sendOtp, verifyOtp } from '@/app/actions/user-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserLogin() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    
    // Check for blacklist error in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'blacklisted') {
      setError('Your account has been blocked by administrators. Please contact support for assistance.');
    }
  }, []);

  async function handleSendOtp(e) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const res = await sendOtp(email);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess('OTP sent successfully!');
        setStep(2);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    setError('');

    try {
      const res = await verifyOtp(email, otp);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/practice');
        }, 1000);
      }
    } catch (err) {
      setError('Verification failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20 z-0 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2f8d46]/10 rounded-full blur-[128px] pointer-events-none animate-pulse" />

      <div
        className={`relative z-10 w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <Link href="/" className="absolute top-6 left-6 text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
            {step === 1 ? 'Student Login' : 'Verify Access'}
          </h1>
          <p className="text-white/40 text-sm">
            {step === 1 ? 'Access the challenge portal' : `Enter code sent to ${email}`}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider pl-1">College Email</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@srmist.edu.in"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-white/20 focus:outline-none focus:border-[#2f8d46]/50 focus:bg-[#2f8d46]/5 transition-all"
                  required
                  disabled={loading}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#2f8d46] transition-colors" size={18} />
              </div>
            </div>

            {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#2f8d46] to-[#257238] hover:to-[#2f8d46] text-white font-semibold py-3 rounded-xl shadow-[0_4px_20px_rgba(47,141,70,0.3)] hover:shadow-[0_4px_25px_rgba(47,141,70,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider pl-1">One-Time Password</label>
              <div className="relative group">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-white/20 focus:outline-none focus:border-[#2f8d46]/50 focus:bg-[#2f8d46]/5 transition-all tracking-widest"
                  required
                  disabled={loading}
                />
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#2f8d46] transition-colors" size={18} />
              </div>
            </div>

            {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
            {success && <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">{success}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#2f8d46] to-[#257238] hover:to-[#2f8d46] text-white font-semibold py-3 rounded-xl shadow-[0_4px_20px_rgba(47,141,70,0.3)] hover:shadow-[0_4px_25px_rgba(47,141,70,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Verify & Login'}
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setOtp(''); setError(''); }}
              className="w-full text-sm text-white/40 hover:text-white transition-colors"
            >
              Change Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}