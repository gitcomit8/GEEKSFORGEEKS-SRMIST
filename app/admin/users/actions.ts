'use server'

import { createAdminClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

// Get all registered users from profiles table
export async function getRegisteredUsers() {
    const supabase = await createAdminClient()

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('full_name, college_email, created_at')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching registered users:', error)
            return []
        }

        // Return data with consistent structure
        return (data || []).map(user => ({
            full_name: user.full_name || 'N/A',
            email: user.college_email || '',
            created_at: user.created_at || new Date().toISOString()
        }))
    } catch (error) {
        console.error('Error in getRegisteredUsers:', error)
        return []
    }
}

// Get blacklisted users
export async function getBlacklist() {
    const supabase = await createAdminClient()

    try {
        const { data, error } = await supabase
            .from('blacklist')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching blacklist:', error)
            return []
        }

        return data || []
    } catch (error) {
        console.error('Error in getBlacklist:', error)
        return []
    }
}

// Add user to blacklist
export async function addToBlacklist(email: string) {
    if (!email) return { error: 'Email is required' }

    const supabase = await createAdminClient()

    try {
        // Check if already blacklisted
        const { data: existing } = await supabase
            .from('blacklist')
            .select('email')
            .eq('email', email)
            .single()

        if (existing) {
            return { error: 'Email already blacklisted' }
        }

        const { error } = await supabase
            .from('blacklist')
            .insert([{ email, blocked_at: new Date().toISOString() }])

        if (error) {
            console.error('Error adding to blacklist:', error)
            return { error: error.message }
        }

        revalidatePath('/admin/users')
        return { success: true }
    } catch (error) {
        console.error('Error in addToBlacklist:', error)
        return { error: 'Failed to add to blacklist' }
    }
}

// Remove user from blacklist
export async function removeFromBlacklist(email: string) {
    const supabase = await createAdminClient()

    try {
        const { error } = await supabase
            .from('blacklist')
            .delete()
            .eq('email', email)

        if (error) {
            console.error('Error removing from blacklist:', error)
            return { error: error.message }
        }

        revalidatePath('/admin/users')
        return { success: true }
    } catch (error) {
        console.error('Error in removeFromBlacklist:', error)
        return { error: 'Failed to remove from blacklist' }
    }
}

// Check if user is blacklisted (to be used in middleware or auth)
export async function isUserBlacklisted(email: string) {
    if (!email) return false
    
    const supabase = await createAdminClient()

    try {
        const { data, error } = await supabase
            .from('blacklist')
            .select('email')
            .eq('email', email)
            .single()

        if (error && error.code !== 'PGRST116') {
            console.error('Error checking blacklist:', error)
            return false
        }

        return !!data
    } catch (error) {
        console.error('Error in isUserBlacklisted:', error)
        return false
    }
}
