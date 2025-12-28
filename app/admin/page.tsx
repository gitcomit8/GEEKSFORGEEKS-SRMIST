import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import LogoutButton from './LogoutButton'
import RecruitmentToggle from './RecruitmentToggle'
import { contentfulClient } from '@/lib/contentful'

// Disable caching so data is always fresh
export const dynamic = 'force-dynamic'

async function getRecruitmentStatus() {
    try {
        const entries = await contentfulClient.getEntries({
            content_type: 'globalSettings',
            limit: 1
        })

        if (entries.items.length > 0) {
            return (entries.items[0].fields.isRecruitmentOpen as boolean) || false
        }
        return false
    } catch (error) {
        console.error('Error fetching global settings:', error)
        return false
    }
}

export default async function AdminPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const isRecruitmentOpen = await getRecruitmentStatus()

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20 z-0 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-green-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

            <div className="relative z-10 min-h-screen p-4 md:p-8">
                {/* Header Section */}
                <div className="max-w-7xl mx-auto mb-8">
                    <div className="backdrop-blur-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full mb-4">
                                    <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Admin Portal</p>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60 mb-2">
                                    Control Center
                                </h1>
                                <p className="text-white/50 text-sm md:text-base">Manage and monitor your GFG platform</p>
                            </div>
                            
                            <div className="flex flex-col gap-4">
                                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[260px]">
                                    <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">Logged in as</p>
                                    <p className="text-sm font-medium text-white truncate">{user.email}</p>
                                </div>
                                <LogoutButton />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quick Actions Cards */}
                    <a href="/admin/events" className="group backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-3xl shadow-xl p-6 md:p-8 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 flex items-center justify-center group-hover:scale-110 transition-transform border border-purple-500/30">
                                <svg className="w-7 h-7 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Events</h3>
                            <p className="text-white/50 text-sm mb-4">Create, edit and manage club events</p>
                            <div className="flex items-center gap-2 text-xs text-purple-300 font-semibold uppercase tracking-wider">
                                <span>Manage</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </div>
                    </a>

                    <a href="/admin/recruitment" className="group backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-3xl shadow-xl p-6 md:p-8 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/30 to-green-600/30 flex items-center justify-center group-hover:scale-110 transition-transform border border-green-500/30">
                                <svg className="w-7 h-7 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Recruitment</h3>
                            <p className="text-white/50 text-sm mb-4">Review and process applications</p>
                            <div className="flex items-center gap-2 text-xs text-green-300 font-semibold uppercase tracking-wider">
                                <span>View</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </div>
                    </a>

                    <a href="/admin/users" className="group backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-3xl shadow-xl p-6 md:p-8 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-600/30 flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-500/30">
                                <svg className="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">User Management</h3>
                            <p className="text-white/50 text-sm mb-4">View registrations & manage blacklist</p>
                            <div className="flex items-center gap-2 text-xs text-blue-300 font-semibold uppercase tracking-wider">
                                <span>Manage</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </div>
                    </a>

                    <a href="/admin/registrations" className="group backdrop-blur-xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-3xl shadow-xl p-6 md:p-8 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/30 to-orange-600/30 flex items-center justify-center group-hover:scale-110 transition-transform border border-orange-500/30">
                                <svg className="w-7 h-7 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                <svg className="w-4 h-4 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Event Registrations</h3>
                            <p className="text-white/50 text-sm mb-4">View team registrations & submissions</p>
                            <div className="flex items-center gap-2 text-xs text-orange-300 font-semibold uppercase tracking-wider">
                                <span>Review</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </div>
                    </a>
                </div>

                {/* Footer Info */}
                <div className="max-w-7xl mx-auto mt-8">
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                        <p className="text-xs text-white/40">
                            Admin Dashboard · Secure Access Only · {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
