import React from 'react';
import { Lightbulb, Camera, Wallet, Globe, Utensils, Map, Shield, Sun, Import as Passport, FileCheck, HeartPulse, Plane, AlertTriangle, Scale, Umbrella } from 'lucide-react';

interface TravelTip {
  category: string;
  icon: React.ElementType;
  tips: string[];
}

interface InsuranceInfo {
  type: string;
  icon: React.ElementType;
  description: string;
  coverage: string[];
}

interface VisaInfo {
  requirement: string;
  icon: React.ElementType;
  description: string;
  documents: string[];
}

const TravelTipsSection = () => {
  const tips: TravelTip[] = [
    {
      category: 'Safety & Security',
      icon: Shield,
      tips: [
        'Keep important documents in a safe place',
        'Make copies of your passport',
        'Stay aware of your surroundings',
        'Use registered taxis or ride-sharing apps',
        'Keep emergency numbers handy'
      ]
    },
    {
      category: 'Money Saving',
      icon: Wallet,
      tips: [
        'Book flights in advance',
        'Use local transportation',
        'Cook some meals yourself',
        'Visit free attractions',
        'Travel during off-peak seasons'
      ]
    },
    {
      category: 'Cultural Awareness',
      icon: Globe,
      tips: [
        'Learn basic local phrases',
        'Research local customs',
        'Dress appropriately',
        'Try local cuisine',
        'Respect religious sites'
      ]
    },
    {
      category: 'Photography',
      icon: Camera,
      tips: [
        'Wake up early for better photos',
        'Ask permission before photographing people',
        'Back up your photos regularly',
        'Learn basic composition rules',
        'Capture local life, not just landmarks'
      ]
    }
  ];

  const insuranceOptions: InsuranceInfo[] = [
    {
      type: 'Medical Insurance',
      icon: HeartPulse,
      description: 'Comprehensive medical coverage for your trip',
      coverage: [
        'Emergency medical expenses',
        'Hospital stays',
        'Medical evacuation',
        'Prescription medications',
        '24/7 medical assistance'
      ]
    },
    {
      type: 'Trip Cancellation',
      icon: AlertTriangle,
      description: 'Protection against unexpected trip changes',
      coverage: [
        'Trip cancellation',
        'Trip interruption',
        'Missed connections',
        'Travel delays',
        'Lost reservations'
      ]
    },
    {
      type: 'Baggage Protection',
      icon: Plane,
      description: 'Coverage for your belongings',
      coverage: [
        'Lost luggage',
        'Delayed baggage',
        'Damaged items',
        'Personal belongings',
        'Travel documents'
      ]
    },
    {
      type: 'Adventure Coverage',
      icon: Umbrella,
      description: 'Extra protection for adventure activities',
      coverage: [
        'Extreme sports',
        'Adventure activities',
        'Equipment coverage',
        'Search and rescue',
        'Activity cancellation'
      ]
    }
  ];

  const visaRequirements: VisaInfo[] = [
    {
      requirement: 'Schengen Visa',
      icon: Passport,
      description: 'Required for most non-EU citizens visiting Europe',
      documents: [
        'Valid passport',
        'Visa application form',
        'Travel insurance proof',
        'Flight itinerary',
        'Hotel reservations',
        'Bank statements'
      ]
    },
    {
      requirement: 'Tourist Visa',
      icon: FileCheck,
      description: 'Standard tourist visa requirements',
      documents: [
        'Passport photos',
        'Proof of accommodation',
        'Return ticket',
        'Financial proof',
        'Travel itinerary'
      ]
    },
    {
      requirement: 'Legal Considerations',
      icon: Scale,
      description: 'Important legal aspects to consider',
      documents: [
        'Visa validity period',
        'Maximum stay duration',
        'Entry requirements',
        'Customs regulations',
        'Border crossing rules'
      ]
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Quick Tips Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-purple-50 p-2 sm:p-4 rounded-lg">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
            <Map className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            <span className="font-medium text-xs sm:text-sm">Download offline maps</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Save maps for offline use before your trip</p>
        </div>
        <div className="bg-purple-50 p-2 sm:p-4 rounded-lg">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            <span className="font-medium text-xs sm:text-sm">Check weather</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Pack according to the forecast</p>
        </div>
        <div className="bg-purple-50 p-2 sm:p-4 rounded-lg">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
            <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            <span className="font-medium text-xs sm:text-sm">Local food guide</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Research local food recommendations</p>
        </div>
        <div className="bg-purple-50 p-2 sm:p-4 rounded-lg">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
            <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            <span className="font-medium text-xs sm:text-sm">Power adapters</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Check local power outlets and bring adapters</p>
        </div>
      </div>

      {/* Insurance Section */}
      <div className="bg-white rounded-xl shadow-sm p-2 sm:p-6">
        <h2 className="text-base sm:text-xl font-bold mb-3 sm:mb-6 flex items-center gap-1 sm:gap-2">
          <Shield className="h-5 w-5 text-purple-600" />
          <span>Travel Insurance Options</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          {insuranceOptions.map((option, idx) => (
            <div key={idx} className="bg-purple-50 p-2 sm:p-4 rounded-lg">
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <option.icon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <span className="font-medium text-xs sm:text-sm">{option.type}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{option.description}</p>
              <ul className="list-disc list-inside text-xs sm:text-sm text-purple-700 space-y-1">
                {option.coverage.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Visa Section */}
      <div className="bg-white rounded-xl shadow-sm p-2 sm:p-6">
        <h2 className="text-base sm:text-xl font-bold mb-3 sm:mb-6 flex items-center gap-1 sm:gap-2">
          <Globe className="h-5 w-5 text-purple-600" />
          <span>Visa & Legal Requirements</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          {visaRequirements.map((visa, idx) => (
            <div key={idx} className="bg-purple-50 p-2 sm:p-4 rounded-lg">
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <visa.icon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <span className="font-medium text-xs sm:text-sm">{visa.requirement}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{visa.description}</p>
              <ul className="list-disc list-inside text-xs sm:text-sm text-purple-700 space-y-1">
                {visa.documents.map((doc, i) => (
                  <li key={i}>{doc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* General Tips Section */}
      <div className="bg-white rounded-xl shadow-sm p-2 sm:p-6">
        <h2 className="text-base sm:text-xl font-bold mb-3 sm:mb-6 flex items-center gap-1 sm:gap-2">
          <Lightbulb className="h-5 w-5 text-purple-600" />
          <span>General Travel Tips</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          {tips.map((tip, idx) => (
            <div key={idx} className="bg-purple-50 p-2 sm:p-4 rounded-lg">
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <tip.icon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <span className="font-medium text-xs sm:text-sm">{tip.category}</span>
              </div>
              <ul className="list-disc list-inside text-xs sm:text-sm text-purple-700 space-y-1">
                {tip.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelTipsSection;