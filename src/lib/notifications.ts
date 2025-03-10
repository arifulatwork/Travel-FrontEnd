import { supabase } from './supabase';

export interface PurchaseNotification {
  id: string;
  user_id: string;
  booking_id: string;
  title: string;
  content: string;
  type: 'booking_confirmed' | 'booking_reminder' | 'booking_cancelled' | 'payment_successful' | 'payment_failed';
  read: boolean;
  created_at: string;
  metadata: {
    activity_name: string;
    booking_date: string;
    booking_time: string;
    participants: number;
    total_price: number;
  };
}

export interface NotificationPreferences {
  booking_confirmations: boolean;
  booking_reminders: boolean;
  payment_notifications: boolean;
  promotional_emails: boolean;
  reminder_time: string;
}

export const notificationApi = {
  // Get user's notifications
  getNotifications: async (userId: string) => {
    const { data, error } = await supabase
      .from('purchase_notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as PurchaseNotification[];
  },

  // Get unread notifications count
  getUnreadCount: async (userId: string) => {
    const { count, error } = await supabase
      .from('purchase_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string, userId: string) => {
    const { error } = await supabase
      .from('purchase_notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  // Mark all notifications as read
  markAllAsRead: async (userId: string) => {
    const { error } = await supabase
      .from('purchase_notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  },

  // Get notification preferences
  getPreferences: async (userId: string) => {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as NotificationPreferences;
  },

  // Update notification preferences
  updatePreferences: async (userId: string, preferences: Partial<NotificationPreferences>) => {
    const { data, error } = await supabase
      .from('notification_preferences')
      .update(preferences)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as NotificationPreferences;
  },

  // Subscribe to real-time notifications
  subscribeToNotifications: (userId: string, onNotification: (notification: PurchaseNotification) => void) => {
    const channel = supabase
      .channel('purchase_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'purchase_notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          onNotification(payload.new as PurchaseNotification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};