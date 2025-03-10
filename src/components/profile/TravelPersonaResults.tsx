import React from 'react';
import { Award, Compass, Heart, Clock, Sun, Activity, Users, Globe } from 'lucide-react';

interface TravelPersonaResultsProps {
  answers: Record<string, string | string[]>;
}

const TravelPersonaResults: React.FC<TravelPersonaResultsProps> = ({ answers }) => {
  const determinePersona = (answers: Record<string, string | string[]>) => {
    // Simple persona determination logic
    const pace = answers.pace as string;
    const interests = answers.interests as string[];
    
    if (pace === 'active' && interests?.includes('adventure')) {
      return {
        type: 'Explorer',
        icon: Compass,
        description: 'You\'re an adventurous soul who loves to discover new places and experiences. You prefer active trips packed with diverse activities.',
        recommendations: [
          'Adventure tours and activities',
          'Off-the-beaten-path destinations',
          'Local cultural experiences',
          'Active outdoor pursuits'
        ]
      };
    }
    
    if (interests?.includes('culture') && pace === 'balanced') {
      return {
        type: 'Cultural Enthusiast',
        icon: Globe,
        description: 'You appreciate the rich tapestry of global cultures and love immersing yourself in local traditions and history.',
        recommendations: [
          'Historical tours and museums',
          'Local cooking classes',
          'Cultural festivals',
          'Heritage sites'
        ]
      };
    }
    
    if (pace === 'relaxed' && interests?.includes('relaxation')) {
      return {
        type: 'Leisure Seeker',
        icon: Sun,
        description: 'You value relaxation and comfort, preferring to take your time and fully absorb each experience.',
        recommendations: [
          'Spa and wellness retreats',
          'Scenic locations',
          'Luxury accommodations',
          'Guided tours'
        ]
      };
    }
    
    return {
      type: 'Balanced Traveler',
      icon: Heart,
      description: 'You enjoy a mix of activities and relaxation, appreciating both adventure and comfort.',
      recommendations: [
        'Mixed activity itineraries',
        'Flexible tour options',
        'Comfortable accommodations',
        'Cultural experiences'
      ]
    };
  };

  const persona = determinePersona(answers);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
          <persona.icon className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Your Travel Persona:</h3>
          <p className="text-purple-600 font-semibold">{persona.type}</p>
        </div>
      </div>

      <p className="text-gray-600 mb-6">{persona.description}</p>

      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Recommended for you:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {persona.recommendations.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg"
            >
              <Award className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-purple-700">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelPersonaResults;