import { fetchRegistrations } from './actions'
import RegistrationsManager from './RegistrationsManager'

export const dynamic = 'force-dynamic'

export default async function RegistrationsPage() {
    const initialData = await fetchRegistrations()

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20 z-0 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[128px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none animate-pulse" />

            <div className="relative z-10 p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="backdrop-blur-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-full mb-4">
                                    <p className="text-xs font-semibold text-orange-300 uppercase tracking-wider">Event Management</p>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60 mb-2">
                                    Team Registrations
                                </h1>
                                <p className="text-white/50 text-sm md:text-base">View and manage event team submissions</p>
                            </div>
                            <a
                                href="/admin"
                                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 flex items-center gap-2 font-semibold"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Dashboard
                            </a>
                        </div>
                    </div>

                    {/* Registrations Manager */}
                    <RegistrationsManager initialData={initialData} />
                </div>
            </div>
        </div>
    )
}
