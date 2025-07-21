import React, { useState, useEffect } from 'react';
import { CreditCard, ChevronRight, Settings, Bell, Shield, HelpCircle, MapPin, Edit, Plus, X, Compass, Check, Users, Activity, DollarSign, Calendar } from 'lucide-react';

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

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  location?: string;
  preferences?: {
    travelPersona?: Record<string, string | string[] | number>;
  };
}

interface Question {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
    icon?: React.ElementType;
    description?: string;
    emoji?: string;
  }[];
  multiple?: boolean;
  hasBudgetSlider?: boolean;
}

const questions: Question[] = [
  {
    id: 'travelReason',
    text: 'Why do you travel?',
    options: [
      { value: 'peace', label: 'Peace', description: 'I want to disconnect and recharge', emoji: '🧘‍♀️' },
      { value: 'exploration', label: 'Exploration', description: 'I\'m curious and want to see new things', emoji: '🔍' },
      { value: 'connection', label: 'Connection', description: 'I want to meet people and bond', emoji: '🧑‍🤝‍🧑', icon: Users },
      { value: 'escape', label: 'Escape', description: 'I need a break from my routine', emoji: '✈️', icon: Compass },
      { value: 'adventure', label: 'Adventure', description: 'I live for thrills and challenges', emoji: '🗺️', icon: Activity }
    ]
  },
  {
    id: 'environment',
    text: 'What kind of environment do you vibe with?',
    options: [
      { value: 'quiet', label: 'Quiet & Secluded', description: 'Far from the crowds', emoji: '🌿' },
      { value: 'mixed', label: 'Half & Half', description: 'I like peaceful moments and energy', emoji: '🏙️' },
      { value: 'bustling', label: 'Bustling & Lively', description: 'I love busy streets and action', emoji: '🎡' }
    ]
  },
  {
    id: 'budgetPreference',
    text: 'Do you want us to filter trips by your budget?',
    hasBudgetSlider: true,
    options: [
      { value: 'yes', label: 'Yes, show me trips within my budget', emoji: '✅', icon: Check },
      { value: 'no', label: 'No, show me everything', emoji: '⛔', icon: DollarSign }
    ]
  },
  {
    id: 'planningStyle',
    text: 'How do you like to plan your trips?',
    options: [
      { value: 'planned', label: 'Fully Planned', description: 'Detailed itineraries', emoji: '📋', icon: Calendar },
      { value: 'flexible', label: 'Flexible', description: 'Rough plan with room for changes', emoji: '🧭', icon: Compass },
      { value: 'spontaneous', label: 'Spontaneous', description: 'Go with the flow', emoji: '🌊', icon: Activity }
    ]
  }
];

const TravelPersonaQuiz: React.FC<{
  onComplete: (results: Record<string, string | string[] | number>) => void;
  initialAnswers?: Record<string, string | string[] | number>;
}> = ({ onComplete, initialAnswers = {} }) => {
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>(initialAnswers);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [budgetValue, setBudgetValue] = useState(500);

  const handleAnswer = (questionId: string, value: string) => {
    const question = questions[currentQuestion];
    let newAnswers;

    if (question.multiple) {
      const currentAnswers = (answers[questionId] as string[]) || [];
      if (currentAnswers.includes(value)) {
        newAnswers = {
          ...answers,
          [questionId]: currentAnswers.filter(v => v !== value)
        };
      } else {
        newAnswers = {
          ...answers,
          [questionId]: [...currentAnswers, value]
        };
      }
    } else {
      newAnswers = {
        ...answers,
        [questionId]: value
      };

      if (questionId === 'budgetPreference' && value === 'yes') {
        newAnswers.budgetAmount = budgetValue;
      }

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }

    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1 || 
       (question.multiple && Object.keys(newAnswers).length === questions.length)) {
      onComplete(newAnswers);
    }
  };

  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBudgetValue(parseInt(event.target.value));
  };

  const question = questions[currentQuestion];
  const isAnswered = answers[question.id];
  const isMultiple = question.multiple;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">{question.text}</h3>
        <div className="grid grid-cols-1 gap-4">
          {question.options.map((option) => {
            const isSelected = isMultiple 
              ? (answers[question.id] as string[] || []).includes(option.value)
              : answers[question.id] === option.value;

            return (
              <button
                key={option.value}
                onClick={() => handleAnswer(question.id, option.value)}
                className={`flex items-center p-4 rounded-lg border-2 transition-colors ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <div className="flex-1 flex items-center gap-3">
                  {option.icon && (
                    <option.icon className={`h-5 w-5 ${
                      isSelected ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                  )}
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{option.emoji}</span>
                      <p className={`font-medium ${
                        isSelected ? 'text-purple-600' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </p>
                    </div>
                    {option.description && (
                      <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <Check className="h-5 w-5 text-purple-600 ml-2" />
                )}
              </button>
            );
          })}

          {question.hasBudgetSlider && answers[question.id] === 'yes' && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select your budget range (€{budgetValue})
              </label>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={budgetValue}
                onChange={handleBudgetChange}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>€100</span>
                <span>€1000</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          className={`text-sm text-purple-600 ${
            currentQuestion === 0 ? 'invisible' : ''
          }`}
        >
          Previous
        </button>
        <div className="flex gap-1">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-8 rounded-full ${
                index === currentQuestion
                  ? 'bg-purple-600'
                  : index < currentQuestion
                  ? 'bg-purple-200'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        {isMultiple && (
          <button
            onClick={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
              } else {
                onComplete(answers);
              }
            }}
            className="text-sm text-purple-600"
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        )}
      </div>
    </div>
  );
};

const ProfileSection: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    id: '',
    full_name: '',
    email: '',
    avatar_url: '',
    location: '',
    preferences: {}
  });

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
  const [isLoading, setIsLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get user info
        const userRes = await fetch('http://127.0.0.1:8000/api/auth/user', {
          headers: getAuthHeaders(),
        });
        const userData = await userRes.json();
        setProfile({
          id: userData.id,
          full_name: `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
          avatar_url: userData.avatar_url || '',
          location: userData.location || '',
          preferences: {},
        });

        // Get credit cards
        const cardsRes = await fetch('http://127.0.0.1:8000/api/credit-cards', {
          headers: getAuthHeaders(),
        });
        const cardsData = await cardsRes.json();
        setCards(cardsData);

        // Get user preferences
        const prefRes = await fetch('http://127.0.0.1:8000/api/user-preferences', {
          headers: getAuthHeaders(),
        });
        const prefData = await prefRes.json();
        setProfile(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            travelPersona: prefData.travel_persona || {},
          },
        }));
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddCard = async (e: React.FormEvent) => {
  e.preventDefault();

  const { number, expiry, cvc } = cardFormData;

  if (number.length !== 16) {
    setCardError('Card number must be 16 digits');
    return;
  }

  if (expiry.length !== 5) {
    setCardError('Please enter a valid expiry date (MM/YY)');
    return;
  }

  if (cvc.length < 3) {
    setCardError('CVC must be at least 3 digits');
    return;
  }

  const last4 = number.slice(-4);
  const type = number.startsWith('4') ? 'visa' : 'mastercard'; // Very simple check

  try {
    const response = await fetch('http://127.0.0.1:8000/api/auth/credit-cards', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        last4,
        expiry,
        type
      }),
    });

    if (response.ok) {
      const updatedCards = await fetch('http://127.0.0.1:8000/api/auth/credit-cards', {
        headers: getAuthHeaders(),
      }).then(res => res.json());
      setCards(updatedCards);
      setShowAddCard(false);
      setCardFormData({ number: '', expiry: '', cvc: '' });
      setCardError('');
    } else {
      setCardError('Failed to add card');
    }
  } catch (err) {
    setCardError('Error adding card. Please try again.');
    console.error('Error adding card:', err);
  }
};
  const setDefaultCard = async (cardId: string) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/credit-cards/${cardId}/default`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      const updated = await fetch('http://127.0.0.1:8000/api/credit-cards', {
        headers: getAuthHeaders(),
      }).then(res => res.json());
      setCards(updated);
    } catch (err) {
      console.error('Error setting default card:', err);
    }
  };

  const removeCard = async (cardId: string) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/credit-cards/${cardId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      setCards(prev => prev.filter(c => c.id !== cardId));
    } catch (err) {
      console.error('Error removing card:', err);
    }
  };

  const handlePersonaComplete = async (answers: Record<string, string | string[] | number>) => {
    try {
      // Update local state first for better UX
      setProfile(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          travelPersona: answers
        }
      }));
      
      // Save to backend
      await fetch('http://127.0.0.1:8000/api/user-preferences', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ travel_persona: answers }),
      });
      
      setShowPersonaQuiz(false);
    } catch (err) {
      console.error('Error saving travel persona:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md sm:max-w-3xl mx-auto px-2 sm:px-6 py-4">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 w-full">
        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
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
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-bold">{profile.full_name}</h2>
            <p className="text-gray-600 text-sm sm:text-base">{profile.email}</p>
            {profile.location && (
              <div className="flex items-center mt-2 text-xs sm:text-sm text-gray-500 justify-center sm:justify-start">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Travel Persona Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-2">
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-purple-600" />
            <h3 className="text-base sm:text-lg font-semibold">Travel Persona</h3>
          </div>
          <button
            onClick={() => setShowPersonaQuiz(true)}
            className="text-xs sm:text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            {profile.preferences?.travelPersona ? 'Update' : 'Take Quiz'}
          </button>
        </div>

        {showPersonaQuiz ? (
          <TravelPersonaQuiz
            onComplete={handlePersonaComplete}
            initialAnswers={profile.preferences?.travelPersona || {}}
          />
        ) : profile.preferences?.travelPersona && Object.keys(profile.preferences.travelPersona).length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-medium">Your Travel Style:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
              {Object.entries(profile.preferences.travelPersona).map(([key, value]) => {
                if (key === 'budgetAmount') return null;
                const question = questions.find(q => q.id === key);
                if (!question) return null;
                const selectedOption = question.options.find(opt => 
                  Array.isArray(value) 
                    ? value.includes(opt.value) 
                    : opt.value === value
                );
                return (
                  <div key={key} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-500">{question.text}</p>
                    <p className="font-medium mt-1">
                      {selectedOption?.emoji} {selectedOption?.label}
                    </p>
                    {key === 'budgetPreference' && profile.preferences?.travelPersona?.budgetAmount && (
                      <p className="text-xs sm:text-sm mt-1">
                        Budget: €{profile.preferences.travelPersona.budgetAmount}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <Compass className="h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Discover your travel persona and get personalized recommendations
            </p>
            <button
              onClick={() => setShowPersonaQuiz(true)}
              className="bg-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-purple-700 text-xs sm:text-base"
            >
              Take the Quiz
            </button>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-4 sm:mb-6 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-2">
          <h3 className="text-base sm:text-lg font-semibold">Payment Methods</h3>
          <button
            onClick={() => setShowAddCard(true)}
            className="flex items-center text-purple-600 hover:text-purple-700 text-xs sm:text-sm"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add New Card
          </button>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {cards.map(card => (
            <div key={card.id} className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-0">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <CreditCard className={`h-6 w-6 ${card.type === 'visa' ? 'text-blue-600' : 'text-red-600'}`} />
                <div>
                  <p className="font-medium text-xs sm:text-base">•••• {card.last4}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Expires {card.expiry}</p>
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
                    className="text-xs sm:text-sm text-purple-600 hover:text-purple-700"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => removeCard(card.id)}
                  className="text-xs sm:text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {cards.length === 0 && (
            <div className="text-center py-4 sm:py-6 text-gray-500 text-xs sm:text-base">
              No payment methods added yet
            </div>
          )}
        </div>
      </div>

      {/* Settings Cards */}
      <div className="space-y-3 sm:space-y-4 w-full">
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm space-y-2 sm:space-y-4">
          {['account', 'notifications', 'privacy', 'help', 'logout'].map((section, idx) => (
            <div 
              key={section}
              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 sm:px-4 rounded-lg"
              onClick={() => section === 'logout' ? handleLogout() : setActiveSection(section)}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                {section === 'account' && <Settings className="text-gray-600" />}
                {section === 'notifications' && <Bell className="text-gray-600" />}
                {section === 'privacy' && <Shield className="text-gray-600" />}
                {section === 'help' && <HelpCircle className="text-gray-600" />}
                {section === 'logout' && <X className="text-gray-600" />}
                <span className="text-xs sm:text-base capitalize">{section === 'logout' ? 'Logout' : section.replace(/([A-Z])/g, ' $1')}</span>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-xl font-bold">Add New Card</h3>
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
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs sm:text-sm">
                {cardError}
              </div>
            )}
            <form onSubmit={handleAddCard} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-base"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-base"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-xs sm:text-base"
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