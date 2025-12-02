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
            className="flex items-center gap-2 px-6 py-3 bg-black text-white border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300"
        >
            <LogOut size={20} />
            <span>Sign Out</span>
        </button>
    )
}
