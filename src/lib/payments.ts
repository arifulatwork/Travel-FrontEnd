import { supabase } from './supabase';

interface PaymentMethod {
  id: string;
  last4: string;
  expiry: string;
  type: 'visa' | 'mastercard';
  is_default: boolean;
}

interface PaymentMethodInput {
  last4: string;
  expiry: string;
  type: 'visa' | 'mastercard';
  is_default?: boolean;
}

// Validation functions
const validateCardNumber = (number: string): boolean => {
  // Luhn algorithm implementation
  const digits = number.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

const validateExpiry = (expiry: string): boolean => {
  const [month, year] = expiry.split('/').map(part => parseInt(part.trim()));
  if (!month || !year) return false;

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  return (
    month >= 1 &&
    month <= 12 &&
    year >= currentYear &&
    (year > currentYear || month >= currentMonth)
  );
};

export const paymentApi = {
  // Get user's payment methods
  getPaymentMethods: async (userId: string): Promise<PaymentMethod[]> => {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Add new payment method
  addPaymentMethod: async (userId: string, input: PaymentMethodInput): Promise<PaymentMethod> => {
    // Validate card number (only validate the last4 since that's all we store)
    if (input.last4.length !== 4 || !/^\d{4}$/.test(input.last4)) {
      throw new Error('Invalid card number');
    }

    // Validate expiry
    if (!validateExpiry(input.expiry)) {
      throw new Error('Invalid expiry date');
    }

    // Validate card type
    if (!['visa', 'mastercard'].includes(input.type)) {
      throw new Error('Invalid card type');
    }

    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        last4: input.last4,
        expiry: input.expiry,
        type: input.type,
        is_default: input.is_default || false
      })
      .select()
      .single();

    if (error) {
      if (error.message.includes('check_rate_limit')) {
        throw new Error('Too many payment method operations. Please try again later.');
      }
      throw error;
    }

    return data;
  },

  // Set default payment method
  setDefaultPaymentMethod: async (userId: string, paymentMethodId: string): Promise<void> => {
    const { error: updateError } = await supabase
      .rpc('set_default_payment_method', {
        p_user_id: userId,
        p_payment_method_id: paymentMethodId
      });

    if (updateError) throw updateError;
  },

  // Remove payment method
  removePaymentMethod: async (userId: string, paymentMethodId: string): Promise<void> => {
    // Check if it's the only payment method
    const { data: methods, error: countError } = await supabase
      .from('payment_methods')
      .select('id', { count: 'exact' })
      .eq('user_id', userId);

    if (countError) throw countError;

    // Don't allow removing the last payment method
    if (methods && methods.length === 1) {
      throw new Error('Cannot remove the last payment method');
    }

    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', paymentMethodId)
      .eq('user_id', userId);

    if (error) throw error;
  }
};