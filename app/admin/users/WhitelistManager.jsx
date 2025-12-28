'use client';

import { useState } from 'react';
import { addToWhitelist, removeFromWhitelist } from './actions';
import { Trash2, Plus, UserCheck, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WhitelistManager({ initialData }) {
    const [whitelist, setWhitelist] = useState(initialData || []);
    const [newEmail, setNewEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newEmail) return;

        setIsLoading(true);
        setError('');

        try {
            const res = await addToWhitelist(newEmail);
            if (res.error) {
                setError(res.error);
            } else {
                setNewEmail('');
                // Optimistic update or wait for revalidate
                // Let's just refresh for simplicity or update local state if we trust it
                router.refresh();
                // We'll also update local state to feel instant
                setWhitelist(prev => [{ email: newEmail, created_at: new Date().toISOString() }, ...prev]);
            }
        } catch (err) {
            setError('Failed to add email');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (email) => {
        if (!confirm(`Remove ${email} from whitelist?`)) return;

        try {
            const res = await removeFromWhitelist(email);
            if (res.error) {
                alert(res.error);
            } else {
                setWhitelist(prev => prev.filter(item => item.email !== email));
                router.refresh();
            }
        } catch (err) {
            alert('Failed to remove email');
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <UserCheck className="w-7 h-7 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-white/40 text-sm mb-1">Total Whitelisted Students</p>
                        <p className="text-4xl font-bold text-white">{whitelist.length}</p>
                    </div>
                </div>
            </div>

            {/* Add User Section */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
                        <Plus className="w-5 h-5 text-green-400" />
                    </div>
                    Add Student to Whitelist
                </h2>

                <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="student@srmist.edu.in"
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-green-500/50 transition-all"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Adding...
                            </span>
                        ) : (
                            'Add Student'
                        )}
                    </button>
                </form>
                {error && (
                    <div className="mt-4 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}
            </div>

            {/* Whitelist Table */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                            <UserCheck className="w-5 h-5 text-purple-400" />
                        </div>
                        Whitelisted Students
                    </h2>
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-white/40 text-sm">Total:</span>
                        <span className="text-white font-mono font-bold text-lg">{whitelist.length}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wider border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Student Email</th>
                                <th className="px-6 py-4 font-semibold">Date Added</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {whitelist.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                                <UserCheck className="w-8 h-8 text-white/20" />
                                            </div>
                                            <div>
                                                <p className="text-white/40 text-lg font-semibold">No students whitelisted yet</p>
                                                <p className="text-white/20 text-sm mt-1">Add students using the form above</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                whitelist.map((user) => (
                                    <tr key={user.email} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 text-white font-mono">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                                    <span className="text-blue-400 font-bold text-sm">{user.email.charAt(0).toUpperCase()}</span>
                                                </div>
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-white/60 text-sm">
                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleRemove(user.email)}
                                                className="inline-flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all border border-transparent hover:border-red-400/20"
                                                title="Remove from whitelist"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="text-sm font-medium">Remove</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
