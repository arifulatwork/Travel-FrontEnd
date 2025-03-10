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
    <div className="space-y-8">
      {/* Quick Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Map className="h-5 w-5 text-purple-600" />
            <span className="font-medium">Download offline maps</span>
          </div>
          <p className="text-sm text-gray-600">Save maps for offline use before your trip</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Sun className="h-5 w-5 text-purple-600" />
            <span className="font-medium">Check weather</span>
          </div>
          <p className="text-sm text-gray-600">Pack according to the forecast</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Utensils className="h-5 w-5 text-purple-600" />
            <span className="font-medium">Local food guide</span>
          </div>
          <p className="text-sm text-gray-600">Research local food recommendations</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            <span className="font-medium">Power adapters</span>
          </div>
          <p className="text-sm text-gray-600">Check local power outlets and bring adapters</p>
        </div>
      </div>

      {/* Insurance Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Shield className="h-6 w-6 text-purple-600" />
          Travel Insurance Options
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insuranceOptions.map((insurance, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <insurance.icon className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-lg">{insurance.type}</h3>
              </div>
              <p className="text-gray-600 mb-4">{insurance.description}</p>
              <ul className="space-y-2">
                {insurance.coverage.map((item, i) => (
                  <li key={i} className="flex items-center space-x-2 text-sm">
                    <span className="text-purple-600">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Visa Requirements Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Passport className="h-6 w-6 text-purple-600" />
          Visa Requirements
        </h2>
        <div className="space-y-6">
          {visaRequirements.map((visa, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <visa.icon className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-lg">{visa.requirement}</h3>
              </div>
              <p className="text-gray-600 mb-4">{visa.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visa.documents.map((doc, i) => (
                  <div key={i} className="flex items-center space-x-2 text-sm bg-gray-50 p-2 rounded">
                    <FileCheck className="h-4 w-4 text-purple-600" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Tips Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-purple-600" />
          Travel Tips & Tricks
        </h2>
        <div className="space-y-6">
          {tips.map((section, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <section.icon className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-lg">{section.category}</h3>
              </div>
              <ul className="space-y-2">
                {section.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-center space-x-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
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