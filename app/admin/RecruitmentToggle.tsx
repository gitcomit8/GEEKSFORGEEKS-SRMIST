'use client'

import { useState, useTransition } from 'react'
import { toggleRecruitmentStatus } from './recruitment/actions'

export default function RecruitmentToggle({ initialStatus }: { initialStatus: boolean }) {
    const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(initialStatus)
    const [isPending, startTransition] = useTransition()

    const handleToggle = async () => {
        const newState = !isRecruitmentOpen
        setIsRecruitmentOpen(newState) // Optimistic update

        startTransition(async () => {
            try {
                await toggleRecruitmentStatus(newState)
            } catch (error) {
                console.error('Failed to toggle status:', error)
                setIsRecruitmentOpen(!newState) // Revert on error
                alert('Failed to update recruitment status')
            }
        })
    }

    return (
        <div className="backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <div className={`w-3 h-3 rounded-full ${isRecruitmentOpen ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]' : 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]'} animate-pulse`} />
                    <p className={`text-2xl font-bold ${isRecruitmentOpen ? 'text-green-400' : 'text-red-400'}`}>
                        {isRecruitmentOpen ? 'OPEN' : 'CLOSED'}
                    </p>
                </div>
                <p className="text-sm text-white/40">
                    {isRecruitmentOpen 
                        ? 'Students can submit applications' 
                        : 'Recruitment applications are disabled'}
                </p>
            </div>
            <button
                onClick={handleToggle}
                disabled={isPending}
                className={`relative inline-flex h-12 w-24 items-center rounded-full transition-all duration-300 ${
                    isRecruitmentOpen 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-[0_0_20px_rgba(34,197,94,0.5)]' 
                        : 'bg-white/10 border border-white/20'
                } ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                title={isRecruitmentOpen ? 'Click to close recruitment' : 'Click to open recruitment'}
            >
                <span
                    className={`inline-block h-9 w-9 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                        isRecruitmentOpen ? 'translate-x-[3.25rem]' : 'translate-x-1.5'
                    }`}
                />
            </button>
        </div>
    )
}
