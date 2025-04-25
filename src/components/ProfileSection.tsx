import React, { useState, useEffect } from 'react';
import { CreditCard, ChevronRight, Settings, Bell, Shield, HelpCircle, MapPin, Calendar, Star, Edit, Plus, Mail, Phone, Globe, X, ArrowLeft, Smartphone, Laptop, Tablet, Lock, KeyRound, QrCode, User, AtSign, Languages, HelpCircleIcon, MessageCircle, Book, FileQuestion, Compass } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { profileApi, type Profile, type ProfileSettings } from '../lib/profile';
import TravelPersonaQuiz from './profile/TravelPersonaQuiz';
import TravelPersonaResults from './profile/TravelPersonaResults';
import { supabase } from '../lib/supabase';

interface CreditCardType {
  id: string;
  last4: string;
  expiry: string;
  type: 'visa' | 'mastercard';
  isDefault: boolean;
}

interface CardFormData {
  number: string;
  expiry: string;
  cvc: string;
}

const ProfileSection: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<CreditCardType[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardFormData, setCardFormData] = useState<CardFormData>({
    number: '',
    expiry: '',
    cvc: ''
  });
  const [cardError, setCardError] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showPersonaQuiz, setShowPersonaQuiz] = useState(false);
  const [personaAnswers, setPersonaAnswers] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    if (user) {
      loadProfile();
      loadPaymentMethods();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      if (!user) return;
      
      // First try to get existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // If no profile exists, create one with default values
      if (fetchError && fetchError.message.includes('no rows')) {
        const defaultProfile = {
          id: user.id,
          username: null,
          full_name: 'New User',
          settings: {
            notifications: {
              push: true,
              email: true,
              marketing: false
            },
            appearance: {
              darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
              fontSize: 'medium'
            },
            language: 'en',
            currency: 'EUR'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert(defaultProfile)
          .select()
          .single();

        if (createError) throw createError;
        setProfile(newProfile);
      } else if (existingProfile) {
        setProfile(existingProfile);
        if (existingProfile.preferences?.travelPersona) {
          setPersonaAnswers(existingProfile.preferences.travelPersona);
        }
      }

      setError(null);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      if (!user) return;
      const data = await profileApi.getPaymentMethods(user.id);
      setCards(data);
    } catch (err) {
      console.error('Error loading payment methods:', err);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await profileApi.addPaymentMethod(user.id, {
        last4: cardFormData.number.slice(-4),
        expiry: cardFormData.expiry,
        type: cardFormData.number.startsWith('4') ? 'visa' : 'mastercard',
        is_default: cards.length === 0
      });

      await loadPaymentMethods();
      setShowAddCard(false);
      setCardFormData({ number: '', expiry: '', cvc: '' });
    } catch (err) {
      console.error('Error adding card:', err);
      setCardError('Failed to add card');
    }
  };

  const setDefaultCard = async (cardId: string) => {
    if (!user) return;

    try {
      await profileApi.setDefaultPaymentMethod(user.id, cardId);
      await loadPaymentMethods();
    } catch (err) {
      console.error('Error setting default card:', err);
    }
  };

  const removeCard = async (cardId: string) => {
    if (!user) return;

    try {
      await profileApi.removePaymentMethod(user.id, cardId);
      await loadPaymentMethods();
    } catch (err) {
      console.error('Error removing card:', err);
    }
  };

  const handlePersonaComplete = async (answers: Record<string, string | string[]>) => {
    if (!user || !profile) return;

    try {
      const updatedProfile = {
        ...profile,
        preferences: {
          ...profile.preferences,
          travelPersona: answers
        }
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      setPersonaAnswers(answers);
      setShowPersonaQuiz(false);
    } catch (err) {
      console.error('Error saving travel persona:', err);
      setError('Failed to save travel persona');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name} 
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl text-purple-600">
                {profile.full_name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile.full_name}</h2>
            <p className="text-gray-600">{user.email}</p>
            {profile.location && (
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Travel Persona Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold">Travel Persona</h3>
          </div>
          <button
            onClick={() => setShowPersonaQuiz(true)}
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            {Object.keys(personaAnswers).length > 0 ? 'Update' : 'Take Quiz'}
          </button>
        </div>

        {showPersonaQuiz ? (
          <TravelPersonaQuiz
            onComplete={handlePersonaComplete}
            initialAnswers={personaAnswers}
          />
        ) : Object.keys(personaAnswers).length > 0 ? (
          <TravelPersonaResults answers={personaAnswers} />
        ) : (
          <div className="text-center py-8">
            <Compass className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Discover your travel persona and get personalized recommendations
            </p>
            <button
              onClick={() => setShowPersonaQuiz(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Take the Quiz
            </button>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Payment Methods</h3>
          <button
            onClick={() => setShowAddCard(true)}
            className="flex items-center text-purple-600 hover:text-purple-700"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add New Card
          </button>
        </div>
        
        <div className="space-y-4">
          {cards.map(card => (
            <div key={card.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <CreditCard className={`h-6 w-6 ${card.type === 'visa' ? 'text-blue-600' : 'text-red-600'}`} />
                <div>
                  <p className="font-medium">•••• {card.last4}</p>
                  <p className="text-sm text-gray-500">Expires {card.expiry}</p>
                </div>
                {card.isDefault && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {!card.isDefault && (
                  <button
                    onClick={() => setDefaultCard(card.id)}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => removeCard(card.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          {cards.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No payment methods added yet
            </div>
          )}
        </div>
      </div>

      {/* Settings Cards */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <div 
            className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-4 rounded-lg"
            onClick={() => setActiveSection('account')}
          >
            <div className="flex items-center space-x-3">
              <Settings className="text-gray-600" />
              <span>Account Settings</span>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
          <div 
            className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-4 rounded-lg"
            onClick={() => setActiveSection('notifications')}
          >
            <div className="flex items-center space-x-3">
              <Bell className="text-gray-600" />
              <span>Notifications</span>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
          <div 
            className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-4 rounded-lg"
            onClick={() => setActiveSection('privacy')}
          >
            <div className="flex items-center space-x-3">
              <Shield className="text-gray-600" />
              <span>Privacy & Security</span>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
          <div 
            className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-4 rounded-lg"
            onClick={() => setActiveSection('help')}
          >
            <div className="flex items-center space-x-3">
              <HelpCircle className="text-gray-600" />
              <span>Help & Support</span>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Card</h3>
              <button 
                onClick={() => {
                  setShowAddCard(false);
                  setCardError('');
                  setCardFormData({ number: '', expiry: '', cvc: '' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {cardError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {cardError}
              </div>
            )}
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardFormData.number}
                  onChange={(e) => setCardFormData({
                    ...cardFormData,
                    number: e.target.value.replace(/\D/g, '').slice(0, 16)
                  })}
                  maxLength={16}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardFormData.expiry}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        const month = value.slice(0, 2);
                        const year = value.slice(2);
                        setCardFormData({
                          ...cardFormData,
                          expiry: value.length > 2 ? `${month}/${year}` : month
                        });
                      }
                    }}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cardFormData.cvc}
                    onChange={(e) => setCardFormData({
                      ...cardFormData,
                      cvc: e.target.value.replace(/\D/g, '').slice(0, 4)
                    })}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
              >
                Add Card
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;