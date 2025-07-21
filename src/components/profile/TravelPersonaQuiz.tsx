import React, { useState, useRef, useEffect } from 'react';
import { Compass, Heart, Clock, Sun, Moon, Users, Wallet, Activity, Globe, Check, User, Home, Star, Calendar, Camera, Trees as Tree, Utensils, Bed, Space as Peace, Search, MapPin, DollarSign } from 'lucide-react';

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

interface TravelPersonaQuizProps {
  onComplete: (results: any) => void;
  initialAnswers?: any;
}

const questions: Question[] = [
  {
    id: 'travelReason',
    text: 'Why do you travel?',
    options: [
      { value: 'peace', label: 'Peace', description: 'I want to disconnect and recharge', emoji: '🧘‍♀️', icon: Peace },
      { value: 'exploration', label: 'Exploration', description: 'I\'m curious and want to see new things', emoji: '🔍', icon: Search },
      { value: 'connection', label: 'Connection', description: 'I want to meet people and bond', emoji: '🧑‍🤝‍🧑', icon: Users },
      { value: 'escape', label: 'Escape', description: 'I need a break from my routine', emoji: '✈️', icon: Compass },
      { value: 'adventure', label: 'Adventure', description: 'I live for thrills and challenges', emoji: '🗺️', icon: Activity }
    ]
  },
  {
    id: 'environment',
    text: 'What kind of environment do you vibe with?',
    options: [
      { value: 'quiet', label: 'Quiet & Secluded', description: 'Far from the crowds', emoji: '🌿', icon: Tree },
      { value: 'mixed', label: 'Half & Half', description: 'I like peaceful moments and energy', emoji: '🏙️', icon: MapPin },
      { value: 'bustling', label: 'Bustling & Lively', description: 'I love busy streets and action', emoji: '🎡', icon: Users }
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

const TravelPersonaQuiz: React.FC<TravelPersonaQuizProps> = ({ onComplete, initialAnswers = {} }) => {
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>(initialAnswers);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [budgetValue, setBudgetValue] = useState(500); // Default budget value

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

      // If this is the budget question and the answer is "yes", include the budget value
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
    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="space-y-2 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{question.text}</h3>
        <div className="grid grid-cols-1 gap-2 sm:gap-4">
          {question.options.map((option) => {
            const isSelected = isMultiple 
              ? (answers[question.id] as string[] || []).includes(option.value)
              : answers[question.id] === option.value;

            return (
              <button
                key={option.value}
                onClick={() => handleAnswer(question.id, option.value)}
                className={`flex items-center p-3 sm:p-4 rounded-lg border-2 transition-colors text-xs sm:text-base ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <div className="flex-1 flex items-center gap-2 sm:gap-3">
                  {option.icon && (
                    <option.icon className={`h-5 w-5 ${
                      isSelected ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                  )}
                  <div className="text-left">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-lg sm:text-xl">{option.emoji}</span>
                      <p className={`font-medium ${
                        isSelected ? 'text-purple-600' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </p>
                    </div>
                    {option.description && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">{option.description}</p>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <Check className="h-5 w-5 text-purple-600 ml-2" />
                )}
              </button>
            );
          })}

          {/* Budget Slider */}
          {question.hasBudgetSlider && answers[question.id] === 'yes' && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-purple-50 rounded-lg">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
              <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                <span>€100</span>
                <span>€1000</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 sm:pt-4">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          className={`text-xs sm:text-sm text-purple-600 ${
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