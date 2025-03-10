import React, { useState } from 'react';
import { Compass, Heart, Clock, Sun, Moon, Users, Wallet, Activity, Globe, Check, User, Home, Star, Calendar, Camera, Trees as Tree, Utensils, Bed } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
    icon?: React.ElementType;
    description?: string;
  }[];
  multiple?: boolean;
}

interface TravelPersonaQuizProps {
  onComplete: (results: any) => void;
  initialAnswers?: any;
}

const questions: Question[] = [
  {
    id: 'pace',
    text: 'What\'s your preferred travel pace?',
    options: [
      { value: 'relaxed', label: 'Relaxed & Easy', icon: Sun, description: 'Take it slow, enjoy each moment' },
      { value: 'balanced', label: 'Balanced', icon: Clock, description: 'Mix of activities and downtime' },
      { value: 'active', label: 'Fast & Full', icon: Activity, description: 'Pack in as much as possible' }
    ]
  },
  {
    id: 'companionship',
    text: 'How do you prefer to travel?',
    options: [
      { value: 'solo', label: 'Solo', icon: User, description: 'Independent exploration' },
      { value: 'couple', label: 'With Partner', icon: Heart, description: 'Romantic getaways' },
      { value: 'group', label: 'With Group', icon: Users, description: 'Social adventures' },
      { value: 'family', label: 'With Family', icon: Home, description: 'Family-friendly experiences' }
    ]
  },
  {
    id: 'interests',
    text: 'What interests you most when traveling?',
    multiple: true,
    options: [
      { value: 'culture', label: 'Culture & History', icon: Globe },
      { value: 'food', label: 'Food & Drink', icon: Utensils },
      { value: 'nature', label: 'Nature & Outdoors', icon: Tree },
      { value: 'adventure', label: 'Adventure & Sports', icon: Compass },
      { value: 'relaxation', label: 'Wellness & Relaxation', icon: Heart },
      { value: 'photography', label: 'Photography & Art', icon: Camera }
    ]
  },
  {
    id: 'accommodation',
    text: 'What\'s your preferred accommodation style?',
    options: [
      { value: 'luxury', label: 'Luxury', icon: Star, description: 'High-end hotels and resorts' },
      { value: 'boutique', label: 'Boutique', icon: Home, description: 'Unique, charming properties' },
      { value: 'comfort', label: 'Comfort', icon: Bed, description: 'Mid-range hotels' },
      { value: 'budget', label: 'Budget', icon: Wallet, description: 'Hostels and guesthouses' }
    ]
  },
  {
    id: 'planning',
    text: 'How do you like to plan your trips?',
    options: [
      { value: 'structured', label: 'Fully Planned', icon: Calendar, description: 'Detailed itineraries' },
      { value: 'flexible', label: 'Flexible', icon: Clock, description: 'Rough plan with room for changes' },
      { value: 'spontaneous', label: 'Spontaneous', icon: Compass, description: 'Go with the flow' }
    ]
  }
];

const TravelPersonaQuiz: React.FC<TravelPersonaQuizProps> = ({ onComplete, initialAnswers = {} }) => {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(initialAnswers);
  const [currentQuestion, setCurrentQuestion] = useState(0);

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

  const question = questions[currentQuestion];
  const isAnswered = answers[question.id];
  const isMultiple = question.multiple;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">{question.text}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <p className={`font-medium ${
                      isSelected ? 'text-purple-600' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </p>
                    {option.description && (
                      <p className="text-sm text-gray-500">{option.description}</p>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <Check className="h-5 w-5 text-purple-600 ml-2" />
                )}
              </button>
            );
          })}
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

export default TravelPersonaQuiz;