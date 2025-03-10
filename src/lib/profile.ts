import { supabase } from './supabase';

export interface ProfileSettings {
  notifications: {
    push: boolean;
    email: boolean;
    marketing: boolean;
  };
  appearance: {
    darkMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  language: string;
  currency: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  languages?: string[];
  interests?: string[];
  occupation?: string;
  settings: ProfileSettings;
  created_at: string;
  updated_at: string;
}

export const profileApi = {
  // Get user profile
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as Profile;
  },

  // Update profile
  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  // Update settings
  updateSettings: async (userId: string, settings: ProfileSettings) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ settings })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  // Upload avatar
  uploadAvatar: async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) throw updateError;
    return data as Profile;
  },

  // Get payment methods
  getPaymentMethods: async (userId: string) => {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Add payment method
  addPaymentMethod: async (userId: string, paymentMethod: any) => {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        ...paymentMethod
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Set default payment method
  setDefaultPaymentMethod: async (userId: string, paymentMethodId: string) => {
    // First, remove default from all user's payment methods
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);

    // Then set the new default
    const { data, error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', paymentMethodId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove payment method
  removePaymentMethod: async (userId: string, paymentMethodId: string) => {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', paymentMethodId)
      .eq('user_id', userId);

    if (error) throw error;
  }
};