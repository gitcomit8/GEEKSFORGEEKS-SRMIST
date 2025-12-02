'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [view, setView] = useState('sign-in') // 'sign-in' or 'sign-up'
    const router = useRouter()

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (view === 'sign-in') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/admin')
                router.refresh()
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error
                // For sign-up, we might want to automatically sign them in or show a success message
                // Supabase auto-confirms if email confirmation is off, otherwise they need to check email
                // Assuming auto-confirm or just redirecting to admin if successful
                router.push('/admin')
                router.refresh()
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20 z-0 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[128px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md p-8">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            {view === 'sign-in' ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="text-white/40 mt-2 text-sm">
                            {view === 'sign-in'
                                ? 'Enter your credentials to access the admin panel'
                                : 'Sign up to get started'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60 ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-white transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-white transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                view === 'sign-in' ? 'Sign In' : 'Sign Up'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setView(view === 'sign-in' ? 'sign-up' : 'sign-in')}
                            className="text-sm text-white/40 hover:text-white transition-colors"
                        >
                            {view === 'sign-in' ? (
                                <>Don't have an account? <span className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Sign up</span></>
                            ) : (
                                <>Already have an account? <span className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Sign in</span></>
                            )}
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <Link href="/" className="text-xs text-white/20 hover:text-white/60 transition-colors">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
