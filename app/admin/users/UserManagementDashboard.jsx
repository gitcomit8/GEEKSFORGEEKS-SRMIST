'use client'

import { useState } from 'react'
import { addToBlacklist, removeFromBlacklist } from './actions'
import { Shield, ShieldOff, Users, Search, Ban, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function UserManagementDashboard({ initialUsers = [], initialBlacklist = [] }) {
    const [users, setUsers] = useState(initialUsers)
    const [blacklist, setBlacklist] = useState(initialBlacklist)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState('users') // 'users' | 'blacklist'
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const blacklistedEmails = new Set(blacklist.map(b => b.email))

    const handleBlacklist = async (email) => {
        if (!confirm(`Are you sure you want to blacklist ${email}? This will:\n\n- Block them from logging in\n- Remove them from leaderboard\n- Prevent challenge access\n\nThis action can be reversed.`)) return

        setIsLoading(true)
        try {
            const res = await addToBlacklist(email)
            if (res.error) {
                alert(res.error)
            } else {
                setBlacklist(prev => [...prev, { email, blocked_at: new Date().toISOString() }])
                router.refresh()
            }
        } catch (error) {
            alert('Failed to blacklist user')
        } finally {
            setIsLoading(false)
        }
    }

    const handleUnblacklist = async (email) => {
        if (!confirm(`Remove ${email} from blacklist? They will regain full access.`)) return

        setIsLoading(true)
        try {
            const res = await removeFromBlacklist(email)
            if (res.error) {
                alert(res.error)
            } else {
                setBlacklist(prev => prev.filter(item => item.email !== email))
                router.refresh()
            }
        } catch (error) {
            alert('Failed to remove from blacklist')
        } finally {
            setIsLoading(false)
        }
    }

    const filteredUsers = users.filter(user => {
        if (!searchTerm) return true
        const search = searchTerm.toLowerCase()
        return (
            user.email?.toLowerCase().includes(search) ||
            user.full_name?.toLowerCase().includes(search)
        )
    })

    const filteredBlacklist = blacklist.filter(item => {
        if (!searchTerm) return true
        return item.email?.toLowerCase().includes(searchTerm.toLowerCase())
    })

    const stats = {
        totalUsers: users.length,
        activeUsers: users.length - blacklistedEmails.size,
        blacklistedUsers: blacklistedEmails.size
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-white/40 text-sm mb-1">Total Registered</p>
                            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                        </div>
                    </div>
                </div>

                <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-white/40 text-sm mb-1">Active Users</p>
                            <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
                        </div>
                    </div>
                </div>

                <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                            <Ban className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                            <p className="text-white/40 text-sm mb-1">Blacklisted</p>
                            <p className="text-3xl font-bold text-white">{stats.blacklistedUsers}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs and Search */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                                activeTab === 'users'
                                    ? 'bg-blue-500/20 text-blue-300 border-2 border-blue-500/40'
                                    : 'bg-white/5 text-white/60 border-2 border-transparent hover:bg-white/10'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Registered Users
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('blacklist')}
                            className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                                activeTab === 'blacklist'
                                    ? 'bg-red-500/20 text-red-300 border-2 border-red-500/40'
                                    : 'bg-white/5 text-white/60 border-2 border-transparent hover:bg-white/10'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <Ban className="w-4 h-4" />
                                Blacklist ({stats.blacklistedUsers})
                            </span>
                        </button>
                    </div>

                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Users Table */}
                {activeTab === 'users' && (
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr className="text-white/60 text-sm">
                                    <th className="px-6 py-4 font-semibold">User Details</th>
                                    <th className="px-6 py-4 font-semibold">Registration Date</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Users className="w-16 h-16 text-white/20" />
                                                <div>
                                                    <p className="text-white/40 text-lg font-semibold">No users found</p>
                                                    <p className="text-white/20 text-sm mt-1">No registered users match your search</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user, idx) => {
                                        const isBlacklisted = blacklistedEmails.has(user.email)
                                        return (
                                            <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl ${isBlacklisted ? 'bg-red-500/20 border-red-500/30' : 'bg-blue-500/20 border-blue-500/30'} border flex items-center justify-center`}>
                                                            <span className={`font-bold ${isBlacklisted ? 'text-red-400' : 'text-blue-400'}`}>
                                                                {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-semibold">{user.full_name || 'N/A'}</p>
                                                            <p className="text-white/60 text-sm font-mono">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-white/60 text-sm">
                                                    {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    }) : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {isBlacklisted ? (
                                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                                                            <ShieldOff className="w-3 h-3" />
                                                            Blacklisted
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30">
                                                            <Shield className="w-3 h-3" />
                                                            Active
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {!isBlacklisted ? (
                                                        <button
                                                            onClick={() => handleBlacklist(user.email)}
                                                            disabled={isLoading}
                                                            className="inline-flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all border border-transparent hover:border-red-400/20 disabled:opacity-50"
                                                        >
                                                            <Ban className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Blacklist</span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-white/40 text-sm">Blacklisted</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Blacklist Table */}
                {activeTab === 'blacklist' && (
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr className="text-white/60 text-sm">
                                    <th className="px-6 py-4 font-semibold">Email Address</th>
                                    <th className="px-6 py-4 font-semibold">Blacklisted Date</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredBlacklist.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                                </div>
                                                <div>
                                                    <p className="text-white/40 text-lg font-semibold">No blacklisted users</p>
                                                    <p className="text-white/20 text-sm mt-1">All users have active access</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBlacklist.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                                                        <Ban className="w-5 h-5 text-red-400" />
                                                    </div>
                                                    <p className="text-white font-mono">{item.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-white/60 text-sm">
                                                {item.blocked_at ? new Date(item.blocked_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) : new Date(item.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleUnblacklist(item.email)}
                                                    disabled={isLoading}
                                                    className="inline-flex items-center gap-2 px-4 py-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition-all border border-transparent hover:border-green-400/20 disabled:opacity-50"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Remove from Blacklist</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
