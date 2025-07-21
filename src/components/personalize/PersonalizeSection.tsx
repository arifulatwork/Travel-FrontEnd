import React, { useState, useEffect } from 'react';
import { Save, Sun, Cloud, Users, Calendar, MapPin, Activity, DollarSign, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Preferences {
  climate: string[];
  groupSize: 'solo' | 'couple' | 'small' | 'large';
  travelStyle: string[];
  budget: 'budget' | 'moderate' | 'luxury';
  seasonPreference: string[];
  activityLevel: 'relaxed' | 'moderate' | 'active';
  interests: string[];
}

interface PersonalizeSectionProps {
  onPreferencesUpdate: () => void;
}

const PersonalizeSection: React.FC<PersonalizeSectionProps> = ({ onPreferencesUpdate }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Preferences>({
    climate: [],
    groupSize: 'solo',
    travelStyle: [],
    budget: 'moderate',
    seasonPreference: [],
    activityLevel: 'moderate',
    interests: []
  });
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data?.preferences) {
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handlePreferenceChange = async (
    category: keyof Preferences,
    value: string | string[]
  ) => {
    const newPreferences = {
      ...preferences,
      [category]: value
    };
    setPreferences(newPreferences);

    // Auto-save after a brief delay
    try {
      setSaving(true);
      await supabase
        .from('profiles')
        .update({ preferences: newPreferences })
        .eq('id', user?.id);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      onPreferencesUpdate();
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-2 left-2 sm:right-4 sm:left-auto bg-green-500 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out flex items-center gap-2 text-xs sm:text-sm">
          <Check className="h-5 w-5" />
          <span>Preferences saved successfully!</span>
        </div>
      )}

      {/* Climate Preferences */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2 sm:mb-4">
          <Sun className="h-5 w-5 text-purple-600" />
          <h3 className="text-base sm:text-lg font-semibold">Climate Preferences</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {['Tropical', 'Mediterranean', 'Continental', 'Alpine'].map((climate) => (
            <button
              key={climate}
              onClick={() => handlePreferenceChange('climate', 
                preferences.climate.includes(climate)
                  ? preferences.climate.filter(c => c !== climate)
                  : [...preferences.climate, climate]
              )}
              className={`p-2 sm:p-3 rounded-lg border text-xs sm:text-sm ${
                preferences.climate.includes(climate)
                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {climate}
            </button>
          ))}
        </div>
      </div>

      {/* Group Size */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2 sm:mb-4">
          <Users className="h-5 w-5 text-purple-600" />
          <h3 className="text-base sm:text-lg font-semibold">Preferred Group Size</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            { value: 'solo', label: 'Solo' },
            { value: 'couple', label: 'Couple' },
            { value: 'small', label: 'Small Group (3-6)' },
            { value: 'large', label: 'Large Group (7+)' }
          ].map((size) => (
            <button
              key={size.value}
              onClick={() => handlePreferenceChange('groupSize', size.value)}
              className={`p-2 sm:p-3 rounded-lg border text-xs sm:text-sm ${
                preferences.groupSize === size.value
                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Travel Style */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2 sm:mb-4">
          <MapPin className="h-5 w-5 text-purple-600" />
          <h3 className="text-base sm:text-lg font-semibold">Travel Style</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {[
            'Cultural',
            'Adventure',
            'Relaxation',
            'Food & Wine',
            'Historical',
            'Nature'
          ].map((style) => (
            <button
              key={style}
              onClick={() => handlePreferenceChange('travelStyle',
                preferences.travelStyle.includes(style)
                  ? preferences.travelStyle.filter(s => s !== style)
                  : [...preferences.travelStyle, style]
              )}
              className={`p-2 sm:p-3 rounded-lg border text-xs sm:text-sm ${
                preferences.travelStyle.includes(style)
                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2 sm:mb-4">
          <DollarSign className="h-5 w-5 text-purple-600" />
          <h3 className="text-base sm:text-lg font-semibold">Budget Range</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { value: 'budget', label: 'Budget-Friendly' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'luxury', label: 'Luxury' }
          ].map((budget) => (
            <button
              key={budget.value}
              onClick={() => handlePreferenceChange('budget', budget.value)}
              className={`p-2 sm:p-3 rounded-lg border text-xs sm:text-sm ${
                preferences.budget === budget.value
                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {budget.label}
            </button>
          ))}
        </div>
      </div>

      {/* Season Preference */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2 sm:mb-4">
          <Calendar className="h-5 w-5 text-purple-600" />
          <h3 className="text-base sm:text-lg font-semibold">Preferred Seasons</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {['Spring', 'Summer', 'Fall', 'Winter'].map((season) => (
            <button
              key={season}
              onClick={() => handlePreferenceChange('seasonPreference',
                preferences.seasonPreference.includes(season)
                  ? preferences.seasonPreference.filter(s => s !== season)
                  : [...preferences.seasonPreference, season]
              )}
              className={`p-2 sm:p-3 rounded-lg border text-xs sm:text-sm ${
                preferences.seasonPreference.includes(season)
                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {season}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Level */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2 sm:mb-4">
          <Activity className="h-5 w-5 text-purple-600" />
          <h3 className="text-base sm:text-lg font-semibold">Activity Level</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { value: 'relaxed', label: 'Relaxed' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'active', label: 'Active' }
          ].map((level) => (
            <button
              key={level.value}
              onClick={() => handlePreferenceChange('activityLevel', level.value)}
              className={`p-2 sm:p-3 rounded-lg border text-xs sm:text-sm ${
                preferences.activityLevel === level.value
                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalizeSection;