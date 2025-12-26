'use server'

import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export async function sendOtp(email: string) {
    if (!email) {
        return { error: 'Email is required' };
    }

    // Send OTP to any user
    const supabase = await createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: true, // Allow creation if whitelisted (Auth users table)
        },
    });

    if (authError) {
        console.error("Auth Error:", authError);
        return { error: 'Failed to send OTP. Please try again.' };
    }

    return { success: true };
}

export async function verifyOtp(email: string, otp: string) {
    if (!email || !otp) {
        return { error: 'Email and OTP are required' };
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
    });

    if (error) {
        return { error: error.message };
    }

    if (data.user) {
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id)
            .single();

        if (!existingProfile) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: data.user.id,
                        college_email: data.user.email,
                        username: data.user.email?.split('@')[0] || 'user',
                        full_name: '',
                        avatar_url: null,
                        total_points: 0,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                ]);

            if (profileError) {
                console.error('Error creating profile:', profileError);
            }
        }
    }

    return { success: true, session: data.session };
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/');
}
