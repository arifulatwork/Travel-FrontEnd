import React, { useState, useEffect } from 'react';
import {
  CreditCard, ChevronRight, Settings, Bell, Shield, HelpCircle, MapPin, Edit, Plus, X,
  Compass, Check, Users, Activity, DollarSign, Calendar, Heart, Tag
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

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
  interests?: string[];
  preferences?: {
    travelPersona?: Record<string, string | string[] | number>;
  };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: 'info' | 'warning' | 'success' | 'error';
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

/** Map backend icon names -> lucide components safely */
const iconMap: Record<string, React.ElementType> = {
  Users,
  Compass,
  Activity,
  Check,
  DollarSign,
  Calendar,
};

const safeIcon = (name?: string): React.ElementType | undefined =>
  name && iconMap[name] ? iconMap[name] : undefined;

/** -------- TravelPersonaQuiz -------- */
const TravelPersonaQuiz: React.FC<{
  questions: Question[];
  onComplete: (results: Record<string, string | string[] | number>) => void;
  initialAnswers?: Record<string, string | string[] | number>;
}> = ({ questions, onComplete, initialAnswers = {} }) => {
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>(initialAnswers);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [budgetValue, setBudgetValue] = useState(
    typeof initialAnswers.budgetAmount === 'number' ? (initialAnswers.budgetAmount as number) : 500
  );

  useEffect(() => {
    const keys = questions.map(q => q.id);
    const answeredCount = keys.filter(k => answers[k] !== undefined).length;
    if (answeredCount > 0 && answeredCount < questions.length) {
      setCurrentQuestion(answeredCount);
    }
  }, [questions]);

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">No questions available right now.</p>
      </div>
    );
  }

  const handleAnswer = (questionId: string, value: string) => {
    const question = questions[currentQuestion];
    let newAnswers: Record<string, any>;

    if (question.multiple) {
      const currentAnswers = (answers[questionId] as string[]) || [];
      if (currentAnswers.includes(value)) {
        newAnswers = { ...answers, [questionId]: currentAnswers.filter(v => v !== value) };
      } else {
        newAnswers = { ...answers, [questionId]: [...currentAnswers, value] };
      }
    } else {
      newAnswers = { ...answers, [questionId]: value };
      if (questionId === 'budgetPreference' && value === 'yes') {
        newAnswers.budgetAmount = budgetValue;
      }
      if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
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
  const isMultiple = !!question.multiple;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">{question.text}</h3>
        <div className="grid grid-cols-1 gap-4">
          {question.options.map((option) => {
            const isSelected = isMultiple
              ? ((answers[question.id] as string[]) || []).includes(option.value)
              : answers[question.id] === option.value;

            const Icon = option.icon;

            return (
              <button
                key={option.value}
                onClick={() => handleAnswer(question.id, option.value)}
                className={`flex items-center p-4 rounded-lg border-2 transition-colors ${
                  isSelected ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <div className="flex-1 flex items-center gap-3">
                  {Icon && <Icon className={`h-5 w-5 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />}
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      {option.emoji && <span className="text-xl">{option.emoji}</span>}
                      <p className={`font-medium ${isSelected ? 'text-purple-600' : 'text-gray-900'}`}>{option.label}</p>
                    </div>
                    {option.description && <p className="text-sm text-gray-500 mt-1">{option.description}</p>}
                  </div>
                </div>
                {isSelected && <Check className="h-5 w-5 text-purple-600 ml-2" />}
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
          className={`text-sm text-purple-600 ${currentQuestion === 0 ? 'invisible' : ''}`}
        >
          Previous
        </button>
        <div className="flex gap-1">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-8 rounded-full ${
                index === currentQuestion ? 'bg-purple-600' : index < currentQuestion ? 'bg-purple-200' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        {isMultiple && (
          <button
            onClick={() => {
              if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
              else onComplete(answers);
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

/** -------- Interests Manager -------- */
const InterestsManager: React.FC<{
  interests: string[];
  options: string[];
  onInterestsChange: (interests: string[]) => void;
}> = ({ interests, options, onInterestsChange }) => {
  const [showAddInterests, setShowAddInterests] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(interests);

  useEffect(() => {
    setSelectedInterests(interests || []);
  }, [interests]);

  const toggleInterest = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(newInterests);
  };

  const saveInterests = () => {
    onInterestsChange(selectedInterests);
    setShowAddInterests(false);
  };

  const removeInterest = (interest: string) => {
    const newInterests = selectedInterests.filter(i => i !== interest);
    setSelectedInterests(newInterests);
    onInterestsChange(newInterests);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">Interests</span>
        </div>
        <button
          onClick={() => setShowAddInterests(true)}
          className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
        >
          <Edit className="h-3 w-3" />
          Edit
        </button>
      </div>

      {selectedInterests.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedInterests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
            >
              <Tag className="h-3 w-3" />
              {interest}
              <button onClick={() => removeInterest(interest)} className="hover:text-purple-900 ml-1">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No interests added yet</p>
      )}

      {showAddInterests && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Select Your Interests</h3>
              <button onClick={() => setShowAddInterests(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-600">Choose interests that match your travel preferences:</p>

              <div className="grid grid-cols-1 gap-2">
                {options.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`flex items-center p-3 rounded-lg border transition-colors ${
                      selectedInterests.includes(interest)
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex-1 text-left">{interest}</div>
                    {selectedInterests.includes(interest) && <Check className="h-4 w-4 text-purple-600" />}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddInterests(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button onClick={saveInterests} className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Save Interests
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/** ------------------- Main Profile Section ------------------- */
const ProfileSection: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    id: '',
    full_name: '',
    email: '',
    avatar_url: '',
    location: '',
    interests: [],
    preferences: {},
  });

  const [cards, setCards] = useState<CreditCardType[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardFormData, setCardFormData] = useState<CardFormData>({ number: '', expiry: '', cvc: '' });
  const [cardError, setCardError] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showPersonaQuiz, setShowPersonaQuiz] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // API-loaded state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [interestOptions, setInterestOptions] = useState<string[]>([]);
  const [loadingPersona, setLoadingPersona] = useState<boolean>(true);
  const [loadingInterests, setLoadingInterests] = useState<boolean>(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  };

  const fetchJSON = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, options);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} ${res.statusText} — ${text}`);
    }
    return res.json();
  };

  /** Notifications */
  const fetchNotifications = async () => {
    try {
      const raw = await fetchJSON(`${API_BASE}/notifications`, { headers: getAuthHeaders() });
      const list: Notification[] = (raw || []).map((n: any) => ({
        id: String(n.id),
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: !!n.is_read,
        createdAt: n.created_at,
      }));
      setNotifications(list);
    } catch (e) {
      console.error('Failed to load notifications:', e);
    }
  };

  // Optional: only works if you added PUT /notifications/{id}/read
  const markNotificationRead = async (id: string) => {
    try {
      await fetchJSON(`${API_BASE}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (e) {
      // If route not implemented yet, at least keep optimistic UI
      console.warn('mark read failed (fallback to optimistic only):', e);
    }
  };

  /** Travel Persona */
  const fetchTravelPersona = async () => {
    setLoadingPersona(true);
    try {
      const data = await fetchJSON(`${API_BASE}/travel-persona/questions`, { headers: getAuthHeaders() });
      const normalized: Question[] = (data || []).map((q: any) => ({
        id: q.key ?? q.id,
        text: q.text,
        multiple: !!q.multiple,
        hasBudgetSlider: !!q.has_budget_slider,
        options: (q.options || []).map((opt: any) => ({
          value: opt.value,
          label: opt.label,
          description: opt.description || undefined,
          emoji: opt.emoji || undefined,
          icon: safeIcon(opt.icon),
        })),
      }));
      setQuestions(normalized);
    } catch (e) {
      console.error('Failed to load travel persona questions:', e);
      setQuestions([]);
    } finally {
      setLoadingPersona(false);
    }
  };

  /** Interests */
  const fetchInterests = async () => {
    setLoadingInterests(true);
    const fallback = [
      'Adventure Travel', 'Beach Holidays', 'Mountain Trekking', 'City Breaks',
      'Cultural Experiences', 'Food & Wine', 'Wildlife Safari', 'Luxury Travel',
      'Budget Travel', 'Solo Travel', 'Family Vacations', 'Romantic Getaways',
      'Historical Sites', 'Art & Museums', 'Music Festivals', 'Wellness Retreats',
      'Shopping', 'Photography', 'Sports Events', 'Road Trips',
    ];
    try {
      const data = await fetchJSON(`${API_BASE}/interests`, { headers: getAuthHeaders() });
      const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : fallback;
      setInterestOptions(list);
    } catch (e) {
      console.warn('Interests API not available. Using fallback list.', e);
      setInterestOptions(fallback);
    } finally {
      setLoadingInterests(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // User
        const userData = await fetchJSON(`${API_BASE}/auth/user`, { headers: getAuthHeaders() });
        setProfile({
          id: userData.id,
          full_name: `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
          avatar_url: userData.avatar_url || '',
          location: userData.location || '',
          interests: userData.interests || [],
          preferences: {},
        });

        // Cards
        const cardsData = await fetchJSON(`${API_BASE}/credit-cards`, { headers: getAuthHeaders() });
        setCards(cardsData);

        // Preferences
        const prefData = await fetchJSON(`${API_BASE}/user-preferences`, { headers: getAuthHeaders() });
        setProfile(prev => ({
          ...prev,
          preferences: { ...prev.preferences, travelPersona: prefData.travel_persona || {} },
        }));

        // Notifications (REAL)
        await fetchNotifications();

      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    fetchTravelPersona();
    fetchInterests();
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
    const type = number.startsWith('4') ? 'visa' : 'mastercard';

    try {
      await fetchJSON(`${API_BASE}/auth/credit-cards`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ last4, expiry, type }),
      });
      const updatedCards = await fetchJSON(`${API_BASE}/credit-cards`, { headers: getAuthHeaders() });
      setCards(updatedCards);
      setShowAddCard(false);
      setCardFormData({ number: '', expiry: '', cvc: '' });
      setCardError('');
    } catch (err) {
      setCardError('Failed to add card');
      console.error('Error adding card:', err);
    }
  };

  const setDefaultCard = async (cardId: string) => {
    try {
      await fetchJSON(`${API_BASE}/credit-cards/${cardId}/default`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      const updated = await fetchJSON(`${API_BASE}/credit-cards`, { headers: getAuthHeaders() });
      setCards(updated);
    } catch (err) {
      console.error('Error setting default card:', err);
    }
  };

  const removeCard = async (cardId: string) => {
    try {
      await fetchJSON(`${API_BASE}/credit-cards/${cardId}`, {
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
      setProfile(prev => ({
        ...prev,
        preferences: { ...prev.preferences, travelPersona: answers },
      }));

      await fetchJSON(`${API_BASE}/user-preferences`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ travel_persona: answers }),
      });

      setShowPersonaQuiz(false);
    } catch (err) {
      console.error('Error saving travel persona:', err);
    }
  };

  const handleInterestsChange = async (interests: string[]) => {
    try {
      setProfile(prev => ({ ...prev, interests }));
      await fetchJSON(`${API_BASE}/user-interests`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ interests }),
      });
    } catch (err) {
      console.error('Error saving interests:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const toggleNotifications = () => {
    if (activeSection === 'notifications') {
      setActiveSection(null);
      setSelectedNotification(null);
    } else {
      setActiveSection('notifications');
      fetchNotifications(); // refresh on open
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      // Optimistic UI
      setNotifications(prev => prev.map(n => (n.id === notification.id ? { ...n, isRead: true } : n)));
      // Sync to backend if route exists
      markNotificationRead(notification.id);
    }
  };

  const closeNotificationDetail = () => setSelectedNotification(null);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
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
              <img src={profile.avatar_url} alt={profile.full_name} className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <span className="text-2xl text-purple-600">{profile.full_name.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{profile.full_name}</h2>
            <p className="text-gray-600">{profile.email}</p>
            {profile.location && (
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{profile.location}</span>
              </div>
            )}

            {/* Interests Section */}
            {!loadingInterests && (
              <InterestsManager
                interests={profile.interests || []}
                options={interestOptions}
                onInterestsChange={handleInterestsChange}
              />
            )}
            {loadingInterests && <p className="text-sm text-gray-500 mt-2">Loading interests…</p>}
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
            {profile.preferences?.travelPersona ? 'Update' : 'Take Quiz'}
          </button>
        </div>

        {showPersonaQuiz ? (
          loadingPersona ? (
            <div className="text-sm text-gray-500">Loading questions…</div>
          ) : (
            <TravelPersonaQuiz
              questions={questions}
              onComplete={handlePersonaComplete}
              initialAnswers={profile.preferences?.travelPersona || {}}
            />
          )
        ) : profile.preferences?.travelPersona && Object.keys(profile.preferences.travelPersona).length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-medium">Your Travel Style:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(profile.preferences.travelPersona).map(([key, value]) => {
                if (key === 'budgetAmount') return null;
                const q = questions.find(qq => qq.id === key);
                if (!q) return null;

                const selectedOption = q.options.find(opt =>
                  Array.isArray(value) ? (value as string[]).includes(opt.value) : opt.value === value
                );

                return (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">{q.text}</p>
                    <p className="font-medium mt-1">
                      {selectedOption?.emoji} {selectedOption?.label}
                    </p>
                    {key === 'budgetPreference' && profile.preferences?.travelPersona?.budgetAmount && (
                      <p className="text-sm mt-1">Budget: €{profile.preferences.travelPersona.budgetAmount as number}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Compass className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Discover your travel persona and get personalized recommendations</p>
            <button onClick={() => setShowPersonaQuiz(true)} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Take the Quiz
            </button>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Payment Methods</h3>
          <button onClick={() => setShowAddCard(true)} className="flex items-center text-purple-600 hover:text-purple-700">
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
                {card.isDefault && <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Default</span>}
              </div>
              <div className="flex items-center space-x-2">
                {!card.isDefault && (
                  <button onClick={() => setDefaultCard(card.id)} className="text-sm text-purple-600 hover:text-purple-700">
                    Set as Default
                  </button>
                )}
                <button onClick={() => removeCard(card.id)} className="text-sm text-red-600 hover:text-red-700">
                  Remove
                </button>
              </div>
            </div>
          ))}

          {cards.length === 0 && <div className="text-center py-6 text-gray-500">No payment methods added yet</div>}
        </div>
      </div>

      {/* Settings Cards */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-4 rounded-lg" onClick={() => setActiveSection('account')}>
            <div className="flex items-center space-x-3">
              <Settings className="text-gray-600" />
              <span>Account Settings</span>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>

          <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-4 rounded-lg" onClick={toggleNotifications}>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bell className="text-gray-600" />
                {notifications.some(n => !n.isRead) && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>}
              </div>
              <span>Notifications</span>
            </div>
            <ChevronRight className={`text-gray-400 transition-transform ${activeSection === 'notifications' ? 'rotate-90' : ''}`} />
          </div>

          {activeSection === 'notifications' && (
            <div className="mt-2 ml-10 bg-gray-50 rounded-lg p-4">
              {selectedNotification ? (
                <NotificationItem notification={selectedNotification} onClose={closeNotificationDetail} />
              ) : (
                <>
                  <h4 className="font-medium mb-3">Your Notifications</h4>
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-sm">No notifications yet</p>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-3 rounded-lg cursor-pointer ${
                            notification.isRead ? 'bg-white' : 'bg-purple-50'
                          } border ${notification.isRead ? 'border-gray-200' : 'border-purple-200'}`}
                        >
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium">{notification.title}</h5>
                            {!notification.isRead && <span className="h-2 w-2 rounded-full bg-purple-600 mt-1.5"></span>}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 truncate">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(notification.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-4 rounded-lg" onClick={() => setActiveSection('privacy')}>
            <div className="flex items-center space-x-3">
              <Shield className="text-gray-600" />
              <span>Privacy & Security</span>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>

          <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-4 rounded-lg" onClick={() => setActiveSection('help')}>
            <div className="flex items-center space-x-3">
              <HelpCircle className="text-gray-600" />
              <span>Help & Support</span>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>

          <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-4 rounded-lg" onClick={handleLogout}>
            <div className="flex items-center space-x-3">
              <X className="text-gray-600" />
              <span>Logout</span>
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
            {cardError && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{cardError}</div>}
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardFormData.number}
                  onChange={(e) =>
                    setCardFormData({
                      ...cardFormData,
                      number: e.target.value.replace(/\D/g, '').slice(0, 16),
                    })
                  }
                  maxLength={16}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
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
                          expiry: value.length > 2 ? `${month}/${year}` : month,
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  <input
                    type="text"
                    value={cardFormData.cvc}
                    onChange={(e) => setCardFormData({ ...cardFormData, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700">
                Add Card
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const NotificationItem: React.FC<{
  notification: Notification;
  onClose: () => void;
}> = ({ notification, onClose }) => {
  const getTypeColor = () => {
    switch (notification.type) {
      case 'info':
        return 'text-blue-600 bg-blue-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={`p-4 rounded-lg mb-4 ${getTypeColor()}`}>
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{notification.title}</h4>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-2 text-sm">{notification.message}</p>
      <p className="mt-2 text-xs opacity-70">{new Date(notification.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default ProfileSection;
