import React, { useState, useEffect } from 'react';
import {
  Globe, MapPin, Calendar, Check, ArrowRight,
  Clock, Building2, Users, Shield,
  Star, Award, Briefcase, Plane, CreditCard,
  Loader2, X, Upload, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://127.0.0.1:8000/api';

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
  id: number; // now numeric, matches DB
  name: string;
  logo: string;
  location: string;
  field: string;
  rating: number;
  reviews: number;
  workMode: 'online' | 'offline' | 'hybrid';
  duration: string;
  hours: string;
}

interface Condition {
  id: string;
  text: string;
  required: boolean;
}

interface Service {
  id: string; // slug from backend
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  popular?: boolean;
}

const getFieldIcon = (fieldId: string): React.ComponentType<any> => {
  switch (fieldId) {
    case 'technology':
      return Briefcase;
    case 'business':
      return Users;
    case 'hospitality':
      return Plane;
    case 'education':
      return Award;
    case 'healthcare':
      return Shield;
    case 'engineering':
      return Building2;
    default:
      return Briefcase;
  }
};

const InternshipMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [showConditions, setShowConditions] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [acceptedConditions, setAcceptedConditions] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedDates, setSelectedDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [dateError, setDateError] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [locations, setLocations] = useState<InternshipLocation[]>([]);
  const [fields, setFields] = useState<InternshipField[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate minimum and maximum dates
  const getMinStartDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 30); // 30 days from today
    return today.toISOString().split('T')[0];
  };

  const getMaxStartDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() + 1); // 1 year from today
    return today.toISOString().split('T')[0];
  };

  const calculateEndDate = (startDate: string, durationMonths: number) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + durationMonths);
    return end.toISOString().split('T')[0];
  };

  const validateDates = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return '';

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    // Check if start date is in the future (at least 30 days)
    const minStart = new Date();
    minStart.setDate(minStart.getDate() + 30);
    if (start <= today || start < minStart) {
      return 'Start date must be at least 30 days from today';
    }

    // Calculate duration in months
    const monthsDiff =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    if (monthsDiff < 3) {
      return 'Internship duration must be at least 3 months';
    }

    if (monthsDiff > 12) {
      return 'Internship duration cannot exceed 12 months';
    }

    return '';
  };

  const handleStartDateChange = (startDate: string) => {
    setSelectedDates(prev => ({ ...prev, startDate }));

    if (startDate) {
      // Auto-set end date to minimum 3 months
      const minEndDate = calculateEndDate(startDate, 3);
      setSelectedDates(prev => ({ ...prev, endDate: minEndDate }));
      setDateError('');
    }
  };

  const handleEndDateChange = (endDate: string) => {
    setSelectedDates(prev => ({ ...prev, endDate }));

    // Validate dates whenever end date changes
    if (selectedDates.startDate && endDate) {
      const error = validateDates(selectedDates.startDate, endDate);
      setDateError(error);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
    } else {
      alert('Please upload a PDF file');
    }
  };

  // Initial data: locations, fields, services, conditions
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [locRes, fieldRes, serviceRes, condRes] = await Promise.all([
          fetch(`${API_BASE}/internships/locations`),
          fetch(`${API_BASE}/internships/fields`),
          fetch(`${API_BASE}/internships/services`),
          fetch(`${API_BASE}/internships/conditions`),
        ]);

        if (!locRes.ok || !fieldRes.ok || !serviceRes.ok || !condRes.ok) {
          throw new Error('Failed to load internship data');
        }

        const [locData, fieldData, serviceData, condData] = await Promise.all([
          locRes.json(),
          fieldRes.json(),
          serviceRes.json(),
          condRes.json(),
        ]);

        setLocations(locData);
        setFields(
          fieldData.map((f: any) => ({
            ...f,
            icon: getFieldIcon(f.id),
          }))
        );
        setServices(serviceData);
        setConditions(condData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load internship data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Companies: re-fetch whenever filters change
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (selectedLocation !== 'all') params.append('location', selectedLocation);
        if (selectedField !== 'all') params.append('field', selectedField);

        const res = await fetch(
          `${API_BASE}/internships/companies${params.toString() ? `?${params.toString()}` : ''}`
        );

        if (!res.ok) throw new Error('Failed to fetch companies');

        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to load internship data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [selectedLocation, selectedField]);

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
    if (!selectedCompany) {
      alert('Please select a company');
      return;
    }

    if (selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }

    if (!cvFile) {
      alert('Please upload your CV');
      return;
    }

    // Validate dates before processing payment
    const errorMsg = validateDates(selectedDates.startDate, selectedDates.endDate);
    if (errorMsg) {
      setDateError(errorMsg);
      return;
    }

    try {
      setIsProcessing(true);
      setDateError('');

      const formData = new FormData();
      formData.append('company_id', String(selectedCompany));
      formData.append('start_date', selectedDates.startDate);
      formData.append('end_date', selectedDates.endDate);
      selectedServices.forEach(s => formData.append('selected_services[]', s));
      acceptedConditions.forEach(c => formData.append('accepted_conditions[]', c));
      formData.append('cv', cvFile);

      const res = await fetch(`${API_BASE}/auth/internships/apply`, {
        method: 'POST',
        credentials: 'include', // for Sanctum; or add Authorization header if using tokens
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Apply error:', data);
        alert(data.message || 'Failed to submit application');
        return;
      }

      // Here you can plug in your existing Stripe flow using data.client_secret
      // e.g. stripe.confirmCardPayment(data.client_secret, { payment_method: { ... } })

      setShowPaymentModal(false);

      const start = new Date(selectedDates.startDate);
      const end = new Date(selectedDates.endDate);
      const monthsDiff =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

      const selectedServiceNames = services
        .filter(service => selectedServices.includes(service.id))
        .map(service => service.name)
        .join(', ');

      alert(
        `Application submitted successfully!\n\n` +
        `Application ID: ${data.application_id}\n` +
        `Services: ${selectedServiceNames}\n` +
        `Duration: ${monthsDiff} months\n` +
        `Start Date: ${start.toLocaleDateString()}\n` +
        `End Date: ${end.toLocaleDateString()}\n\n` +
        `Next step: complete payment with Stripe using the provided client secret.`
      );
    } catch (err) {
      console.error('Payment/apply error:', err);
      alert('Something went wrong while submitting your application.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate duration for display
  const getDurationText = () => {
    if (!selectedDates.startDate || !selectedDates.endDate) return '';

    const start = new Date(selectedDates.startDate);
    const end = new Date(selectedDates.endDate);
    const monthsDiff =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    return `${monthsDiff} month${monthsDiff !== 1 ? 's' : ''}`;
  };

  // Calculate total price
  const totalPrice = services
    .filter(service => selectedServices.includes(service.id))
    .reduce((total, service) => total + service.price, 0);

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
        <h1 className="text-4xl font-bold mb-4">🌍 Build Your Career While Experiencing Life Abroad</h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-4">
          Enhance your CV and refine your motivation letter — secure your internship placement today.
        </p>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-4">
          Looking to make your Erasmus experience truly unforgettable? Join a professional environment where your creativity,
          ideas, and international mindset truly make a difference.
        </p>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto">
          Make your time abroad count — turn your stay into a powerful step toward your future career success.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Career Field Selection */}
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Briefcase className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Choose Your Career Field</h3>
          <p className="text-gray-600">
            You can choose more than two fields. Select where you want to apply and according to your CV and experience we
            will direct you to the best position available.
          </p>
        </div>

        {/* Duration Selection */}
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Select Duration</h3>
          <p className="text-gray-600">
            Fill out your preferred dates for the internship. We offer flexible durations from 3 to 12 months to fit your
            academic schedule.
          </p>
        </div>

        {/* Remuneration & Benefits */}
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Zap className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Remuneration & Benefits</h3>
          <p className="text-gray-600 mb-4">
            Gain valuable experience with comprehensive benefits designed for international students.
          </p>
          <button
            onClick={() => setShowConditions(true)}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 justify-center"
          >
            See benefits <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 rounded-xl p-8 mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 mb-4">
            We network with companies around the world to provide you with international experience. Our service includes
            guaranteed interviews and continuous support throughout your journey.
          </p>
          <p className="text-gray-700 mb-4">
            We aim to place you in your preferred company and location. If the first placement doesn't match your
            expectations, we'll find you another opportunity that better suits your needs.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
            <p className="text-green-800 font-semibold text-center text-lg">
              The service is: Enrich your CV and get the placement in the company that suits your needs!
            </p>
            <p className="text-green-700 text-center mt-2">
              We can place you in one company, if you don't like it we will place you in another company
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Remuneration & Benefits</h2>
        <p className="text-center text-gray-700 mb-8 max-w-4xl mx-auto">
          While these internships are primarily experience-based learning opportunities, students gain a wide range of
          valuable benefits that go beyond financial compensation:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            'Commissions based on performance or results (for roles involving marketing, business development, or sales)',
            'Flexible working hours to balance professional and academic commitments',
            'Remote or hybrid work options (depending on the role and project)',
            'Professional mentoring and coaching from senior team members',
            'Certification of Internship Completion recognized by international universities',
            'Real project participation – your work will be used in active company operations',
            'Portfolio development – ideal for creative and marketing students',
            'Networking opportunities with international teams and industry professionals',
            'Skill development workshops in marketing, project management, or digital tools',
            'Priority consideration for future paid roles or freelance projects',
          ].map((benefit, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-gray-700 text-sm">{benefit}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 mt-8 max-w-4xl mx-auto">
          These benefits are designed to help Erasmus and international students gain real-world experience, build their
          professional profile, and develop global employability skills in an international work environment.
        </p>
      </div>

      {/* Available Companies */}
      <div className="mb-16">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold">Available Internship Positions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="all">All Locations</option>
              <option value="barcelona">Barcelona</option>
              <option value="remote">Remote</option>
              <option value="Multiple">Multiple Locations</option>
            </select>
            <select
              value={selectedField}
              onChange={e => setSelectedField(e.target.value)}
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
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm h-48 flex items-center justify-center"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map(company => (
              <div
                key={company.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:scale-[1.02] border border-gray-100"
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

                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {fields.find(f => f.id === company.field)?.name || company.field}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{company.rating}</span>
                      <span className="text-sm text-gray-500">({company.reviews})</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span>{company.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          company.workMode === 'online'
                            ? 'bg-green-500'
                            : company.workMode === 'offline'
                            ? 'bg-blue-500'
                            : 'bg-purple-500'
                        }`}
                      ></span>
                      <span className="capitalize">{company.workMode}</span>
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-8 text-center mb-16">
        <h2 className="text-2xl font-bold mb-4">I WANT TO STAY IN SPAIN NEXT SEMESTER</h2>
        <p className="text-lg mb-6 opacity-90">
          I want to come to Spain. Send us your CV and motivation letter to get started!
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
              <h3 className="text-xl font-bold">Application Requirements</h3>
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

              {conditions.map(condition => (
                <div key={condition.id} className="flex items-start gap-3">
                  <button
                    onClick={() => handleConditionToggle(condition.id)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 ${
                      acceptedConditions.includes(condition.id)
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {acceptedConditions.includes(condition.id) && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                  <span
                    className={`${
                      condition.required ? 'font-medium' : 'text-gray-600'
                    }`}
                  >
                    {condition.text}
                  </span>
                </div>
              ))}
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
                Continue to Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Complete Your Application</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Services Selection */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Choose Your Services</h4>
                <div className="grid gap-4">
                  {services.map(service => (
                    <div
                      key={service.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedServices.includes(service.id)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      } ${service.popular ? 'ring-2 ring-purple-400' : ''}`}
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                              selectedServices.includes(service.id)
                                ? 'bg-purple-600 border-purple-600 text-white'
                                : 'border-gray-300'
                            }`}
                          >
                            {selectedServices.includes(service.id) && (
                              <Check className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-semibold">{service.name}</h5>
                              {service.popular && (
                                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {service.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">€{service.price}</div>
                          {service.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              €{service.originalPrice}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CV Upload */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Upload Your CV</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="cv-upload"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-gray-600">
                      {cvFile ? cvFile.name : 'Click to upload your CV (PDF only)'}
                    </span>
                    <span className="text-sm text-gray-500">Max file size: 5MB</span>
                  </label>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Select Internship Duration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={selectedDates.startDate}
                      onChange={e => handleStartDateChange(e.target.value)}
                      min={getMinStartDate()}
                      max={getMaxStartDate()}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={selectedDates.endDate}
                      onChange={e => handleEndDateChange(e.target.value)}
                      min={
                        selectedDates.startDate
                          ? calculateEndDate(selectedDates.startDate, 3)
                          : ''
                      }
                      max={
                        selectedDates.startDate
                          ? calculateEndDate(selectedDates.startDate, 12)
                          : ''
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                    />
                  </div>
                </div>

                {selectedDates.startDate && selectedDates.endDate && (
                  <div className="text-center">
                    <span className="text-sm font-medium text-purple-600">
                      Duration: {getDurationText()}
                    </span>
                  </div>
                )}

                {dateError && (
                  <div className="text-red-600 text-sm mt-2 text-center">
                    {dateError}
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>€{totalPrice}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={
                isProcessing ||
                selectedServices.length === 0 ||
                !cvFile ||
                !selectedDates.startDate ||
                !selectedDates.endDate ||
                !!dateError
              }
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 mt-6"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Secure Your Placement - Pay €{totalPrice}
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
