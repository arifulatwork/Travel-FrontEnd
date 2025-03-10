import { supabase } from './supabase';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp: number;
  sub: string;
  email: string;
  role: string;
}

export const auth = {
  // Get current session token
  getToken: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  },

  // Verify token is valid
  verifyToken: async (token: string) => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      
      return {
        valid: decoded.exp > currentTime,
        expired: decoded.exp <= currentTime,
        payload: decoded
      };
    } catch (err) {
      return { valid: false, expired: true, payload: null };
    }
  },

  // Refresh session if token is expired
  refreshSession: async () => {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
  },

  // Change password securely
  changePassword: async (currentPassword: string, newPassword: string) => {
    // First verify current password
    const { data: { user }, error: verifyError } = await supabase.auth.signInWithPassword({
      email: user?.email || '',
      password: currentPassword
    });

    if (verifyError) throw new Error('Current password is incorrect');

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) throw updateError;
  },

  // Request password reset
  requestPasswordReset: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  },

  // Complete password reset
  resetPassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  }
};