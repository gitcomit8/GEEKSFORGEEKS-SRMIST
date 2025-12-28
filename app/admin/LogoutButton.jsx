'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-white border border-red-500/30 hover:border-red-500/50 rounded-xl transition-all duration-300 font-semibold hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
        >
            <LogOut size={20} />
            <span>Sign Out</span>
        </button>
    )
}
