import React, { useState, useEffect } from 'react';
import {
  Globe, MapPin, Calendar, DollarSign, Check, ArrowRight,
  Clock, Building2, Users, FileText, Shield, MessageCircle,
  Star, Award, Briefcase, Home, Plane, CreditCard,
  Loader2, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InternshipLocation {
  id: string;
  country: string;
  cities: string[];
  flag: string;
  popular: boolean;
}

interface InternshipField {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface Company {
  id: string;
  name: string;
  logo: string;
  location: string;
  field: string;
  rating: number;
  reviews: number;
}

interface Condition {
  id: string;
  text: string;
  required: boolean;
}

const InternshipMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [showConditions, setShowConditions] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [acceptedConditions, setAcceptedConditions] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const [locations, setLocations] = useState<InternshipLocation[]>([]);
  const [fields, setFields] = useState<InternshipField[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setLocations([
          {
            id: 'spain',
            country: 'Spain',
            cities: ['Barcelona', 'Madrid', 'Valencia'],
            flag: '🇪🇸',
            popular: true
          },
          {
            id: 'uk',
            country: 'England',
            cities: ['London', 'Manchester', 'Edinburgh'],
            flag: '🇬🇧',
            popular: true
          },
          {
            id: 'usa',
            country: 'United States',
            cities: ['New York', 'Miami', 'Los Angeles'],
            flag: '🇺🇸',
            popular: true
          },
          {
            id: 'argentina',
            country: 'Argentina',
            cities: ['Buenos Aires', 'Córdoba', 'Mendoza'],
            flag: '🇦🇷',
            popular: false
          },
          {
            id: 'france',
            country: 'France',
            cities: ['Paris', 'Lyon', 'Marseille'],
            flag: '🇫🇷',
            popular: false
          },
          {
            id: 'germany',
            country: 'Germany',
            cities: ['Berlin', 'Munich', 'Hamburg'],
            flag: '🇩🇪',
            popular: false
          }
        ]);

        setFields([
          {
            id: 'technology',
            name: 'Technology & IT',
            icon: Briefcase,
            description: 'Software development, IT support, cybersecurity'
          },
          {
            id: 'business',
            name: 'Business & Marketing',
            icon: Users,
            description: 'Marketing, sales, business development'
          },
          {
            id: 'hospitality',
            name: 'Hospitality & Tourism',
            icon: Plane,
            description: 'Hotels, tourism, event management'
          },
          {
            id: 'education',
            name: 'Education',
            icon: Award,
            description: 'Teaching, educational administration'
          },
          {
            id: 'healthcare',
            name: 'Healthcare',
            icon: Shield,
            description: 'Medical, nursing, healthcare administration'
          },
          {
            id: 'engineering',
            name: 'Engineering',
            icon: Building2,
            description: 'Civil, mechanical, electrical engineering'
          }
        ]);

        setCompanies([
          {
            id: '1',
            name: 'Tech Innovators Inc.',
            logo: '/api/placeholder/80/80',
            location: 'Barcelona, Spain',
            field: 'technology',
            rating: 4.8,
            reviews: 124
          },
          {
            id: '2',
            name: 'Global Marketing Pro',
            logo: '/api/placeholder/80/80',
            location: 'London, England',
            field: 'business',
            rating: 4.6,
            reviews: 89
          },
          {
            id: '3',
            name: 'Luxury Hotels International',
            logo: '/api/placeholder/80/80',
            location: 'Miami, USA',
            field: 'hospitality',
            rating: 4.4,
            reviews: 67
          },
          {
            id: '4',
            name: 'European Education Center',
            logo: '/api/placeholder/80/80',
            location: 'Buenos Aires, Argentina',
            field: 'education',
            rating: 4.7,
            reviews: 45
          },
          {
            id: '5',
            name: 'MediCare Solutions',
            logo: '/api/placeholder/80/80',
            location: 'Paris, France',
            field: 'healthcare',
            rating: 4.9,
            reviews: 156
          },
          {
            id: '6',
            name: 'Engineering Excellence Ltd',
            logo: '/api/placeholder/80/80',
            location: 'Berlin, Germany',
            field: 'engineering',
            rating: 4.5,
            reviews: 78
          }
        ]);

      } catch (err) {
        setError('Failed to load internship data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const conditions: Condition[] = [
    { id: 'age', text: 'To be 18 years old or over', required: true },
    { id: 'language', text: 'To have a high level in the language of the country where you will carry out your internship or to have intermediate level English', required: true },
    { id: 'visa', text: 'To have a valid student visa or a valid passport for the corresponding country', required: true },
    { id: 'university', text: 'To be able to provide a university form/agreement to be signed with the company', required: true },
    { id: 'fee', text: 'You must agree to pay the placement fee of 390 Euros', required: true }
  ];

  const handleConditionToggle = (conditionId: string) => {
    setAcceptedConditions(prev =>
      prev.includes(conditionId)
        ? prev.filter(id => id !== conditionId)
        : [...prev, conditionId]
    );
  };

  const allRequiredConditionsAccepted = conditions
    .filter(condition => condition.required)
    .every(condition => acceptedConditions.includes(condition.id));

  const handleApplyNow = () => {
    if (!allRequiredConditionsAccepted) {
      setShowConditions(true);
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowPaymentModal(false);
    alert('Application submitted successfully! Our team will contact you shortly.');
  };

  const filteredCompanies = companies.filter(company => {
    const locationMatch = selectedLocation === 'all' || 
      company.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const fieldMatch = selectedField === 'all' || company.field === selectedField;
    return locationMatch && fieldMatch;
  });

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error loading internship data: {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-4">
          <Globe className="h-12 w-12 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Participate in an Overseas Internship Program</h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
          If you are a university student and you would like to enrich your CV while living and studying abroad, 
          let us help you find the right Overseas Internship Program in Spain, England, United States, Argentina 
          and other exciting destinations.
        </p>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto">
          Participating in an overseas internship offers you a chance to experience living in another country 
          while developing new skills and implementing your knowledge in an innovative, international work environment.
        </p>
      </div>

      {/* School of Leadership Section */}
      <div className="bg-purple-50 rounded-xl p-8 mb-16 text-center">
        <h2 className="text-2xl font-bold mb-4 text-purple-800">School Of Leadership</h2>
        <p className="text-lg text-purple-700 mb-4">
          allows you to choose from one of our exciting locations!
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {['New York', 'Miami', 'Barcelona', 'Buenos Aires', 'London'].map((city) => (
            <div key={city} className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-600" />
              <span className="text-purple-700 font-medium">{city}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Duration */}
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Duration</h3>
          <p className="text-gray-600">
            We offer you an internship of the duration of your choice, starting from only 4 weeks 
            and lasting for up to 12 months according to your requirements.
          </p>
        </div>

        {/* Remuneration */}
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Remuneration</h3>
          <p className="text-gray-600">
            We offer a variety of paid and unpaid internships. Some companies may offer one or more 
            of the following benefits: accommodation; meals; travel expenses refund and more.
          </p>
        </div>

        {/* Conditions */}
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Conditions</h3>
          <p className="text-gray-600 mb-4">
            Our friendly team can assist you to find the right internship for you in a reliable company.
          </p>
          <button
            onClick={() => setShowConditions(true)}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 justify-center"
          >
            See our conditions <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 rounded-xl p-8 mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 mb-4">
            We network with companies around the world in order to further your international experience. 
            As part of our service, we offer a guaranteed interview over Skype, as well as any feedback 
            required if you are unsuccessful.
          </p>
          <p className="text-gray-700 mb-4">
            We aim to place you in the city of your choice, however if you don't qualify or if it's unavailable, 
            we will do our best to offer you a different internship. If you are unable to accept a secondary 
            offer for any reason, you will receive a full refund.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <p className="text-yellow-800 font-semibold text-center">
              In other words, if you are not successful, you will not pay. That is our guarantee.
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <p className="text-red-800 font-semibold text-center">
              European Visa or European working rights required for internships in EU!
            </p>
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Available Locations</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm h-32 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <div
                key={location.id}
                className={`bg-white rounded-xl shadow-sm p-6 transition-transform hover:scale-[1.02] ${
                  location.popular ? 'ring-2 ring-purple-600' : ''
                }`}
              >
                {location.popular && (
                  <div className="bg-purple-600 text-white text-center py-1 px-3 rounded-full text-xs font-medium mb-4 inline-block">
                    Popular
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{location.flag}</span>
                  <h3 className="font-semibold text-lg">{location.country}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {location.cities.map((city) => (
                    <span key={city} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Internship Fields */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Internship Fields</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div
                key={field.id}
                className="bg-white rounded-xl shadow-sm p-6 transition-transform hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg">{field.name}</h3>
                </div>
                <p className="text-gray-600 text-sm">{field.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Companies */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Available Internship Positions</h2>
          <div className="flex gap-4">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="all">All Locations</option>
              {locations.map(location => (
                <option key={location.id} value={location.country.toLowerCase()}>
                  {location.country}
                </option>
              ))}
            </select>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="all">All Fields</option>
              {fields.map(field => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm h-48 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:scale-[1.02]"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{company.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {company.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {fields.find(f => f.id === company.field)?.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{company.rating}</span>
                      <span className="text-sm text-gray-500">({company.reviews})</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCompany(company.id);
                      setShowConditions(true);
                    }}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-purple-600 text-white rounded-xl p-8 text-center mb-16">
        <h2 className="text-2xl font-bold mb-4">Ready to go?</h2>
        <p className="text-lg mb-6 opacity-90">
          Do you want to live and work abroad and to discover a new country, a lifestyle contrary to yours? 
          School Of Leadership would like to help you realize your dream and find the right internship for you.
        </p>
        <button
          onClick={handleApplyNow}
          className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Start Your Application
        </button>
      </div>

      {/* Conditions Modal */}
      {showConditions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Conditions of Inscription</h3>
              <button
                onClick={() => setShowConditions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-700">
                Below are the criteria that you must meet in order to apply for our internships:
              </p>
              
              {conditions.map((condition) => (
                <div key={condition.id} className="flex items-start gap-3">
                  <button
                    onClick={() => handleConditionToggle(condition.id)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 ${
                      acceptedConditions.includes(condition.id)
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {acceptedConditions.includes(condition.id) && <Check className="h-4 w-4" />}
                  </button>
                  <span className={`${condition.required ? 'font-medium' : 'text-gray-600'}`}>
                    {condition.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-purple-800 mb-2">Our placement fee includes:</h4>
              <ul className="text-purple-700 space-y-1">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Resume edition and interview tips
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Placement in a company that matches your needs
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  A friendly team that can offer support and advise on your new location and finding accommodation
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  A personal follow up
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowConditions(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (allRequiredConditionsAccepted) {
                    setShowConditions(false);
                    setShowPaymentModal(true);
                  }
                }}
                disabled={!allRequiredConditionsAccepted}
                className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Complete Your Application</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Internship Duration
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={selectedDates.startDate}
                    onChange={(e) => setSelectedDates(prev => ({ ...prev, startDate: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    value={selectedDates.endDate}
                    onChange={(e) => setSelectedDates(prev => ({ ...prev, endDate: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                    placeholder="End date"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Placement Fee</span>
                  <span className="font-semibold">€390</span>
                </div>
                <p className="text-sm text-gray-500">
                  Includes resume editing, interview preparation, placement matching, and ongoing support
                </p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing || !selectedDates.startDate || !selectedDates.endDate}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Pay €390
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipMarketplace;