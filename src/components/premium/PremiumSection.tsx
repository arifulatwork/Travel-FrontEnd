import React, { useState, useEffect } from 'react';
import {
  Crown, Check, Star, Globe, Shield, Gift, Clock, X,
  CreditCard, MessageCircle, Ticket, Building2, Camera,
  Utensils, MapPin, Calendar, Tag, ArrowRight, Home,
  BedDouble, Bath, Ruler, Layers, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  isPopular?: boolean;
  type: 'individual' | 'business';
}

interface SpecialDiscount {
  id: string;
  title: string;
  description: string;
  location: string;
  discount: string;
  category: 'restaurant' | 'museum' | 'shop' | 'attraction' | 'realestate';
  validUntil: string;
  image: string;
}

interface RealEstateProperty {
  id: string;
  title: string;
  description: string;
  location: string;
  price: string;
  type: 'apartment' | 'villa' | 'commercial' | 'penthouse' | 'townhouse';
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
  premiumDiscount?: string;
}

interface ApiResponse<T> {
  data: {
    benefits?: T[];
    tiers?: T[];
    discounts?: T[];
    properties?: T[];
  };
  message?: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Crown, Check, Star, Globe, Shield, Gift, Clock, MessageCircle,
  Ticket, Building2, Camera, Utensils, MapPin, Calendar, Tag,
  ArrowRight, Home, BedDouble, Bath, Ruler, Layers
};

const PremiumSection: React.FC = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [activeTab, setActiveTab] = useState<'individual' | 'business'>('individual');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [benefits, setBenefits] = useState<any[]>([]);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [premiumDiscounts, setPremiumDiscounts] = useState<SpecialDiscount[]>([]);
  const [realEstateProperties, setRealEstateProperties] = useState<RealEstateProperty[]>([]);
  const [isLoading, setIsLoading] = useState({
    benefits: true,
    pricing: true,
    discounts: true,
    properties: true
  });
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading({
        benefits: true,
        pricing: true,
        discounts: true,
        properties: true
      });
      setError(null);

      const [benefitsRes, pricingRes, discountsRes, propertiesRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/premium/benefits'),
        fetch(`http://127.0.0.1:8000/api/premium/tiers?type=${activeTab}`),
        fetch('http://127.0.0.1:8000/api/premium/discounts'),
        fetch('http://127.0.0.1:8000/api/premium/properties')
      ]);

      if (!benefitsRes.ok || !pricingRes.ok || !discountsRes.ok || !propertiesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const benefitsData: ApiResponse<any> = await benefitsRes.json();
      const pricingData: ApiResponse<PricingTier> = await pricingRes.json();
      const discountsData: ApiResponse<SpecialDiscount> = await discountsRes.json();
      const propertiesData: ApiResponse<RealEstateProperty> = await propertiesRes.json();

      setBenefits(benefitsData.data.benefits || []);
      setPricingTiers(pricingData.data.tiers || []);
      setPremiumDiscounts(discountsData.data.discounts || []);
      setRealEstateProperties(propertiesData.data.properties || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading({
        benefits: false,
        pricing: false,
        discounts: false,
        properties: false
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleSupportAccess = () => {
    navigate('/messages?openSupport=true');
  };

  const handleSubscribe = (tier: PricingTier) => {
    if (!tier?.id) {
      alert('Invalid subscription tier');
      return;
    }
    setSelectedTier(tier);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!stripe || !elements || !selectedTier) return;

    setIsProcessing(true);

    const card = elements.getElement(CardElement);
    if (!card) {
      setIsProcessing(false);
      return;
    }

    const { token, error: tokenError } = await stripe.createToken(card);

    if (tokenError || !token) {
      alert(tokenError?.message || 'Payment failed');
      setIsProcessing(false);
      return;
    }

    try {
      // Process payment
      const res = await fetch('http://127.0.0.1:8000/api/auth/payments/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          token: token.id,
          amount: selectedTier.price,
          purpose: 'premium',
          tier_id: selectedTier.id
        })
      });

      const result = await res.json();
      console.log('💳 Payment result:', result);
      
      if (!res.ok) {
        throw new Error(result.message || 'Payment failed');
      }

      // Validate required fields
      if (!result.payment_id || !result.charge_id) {
        alert("Subscription failed: Missing payment or charge ID.");
        setIsProcessing(false);
        return;
      }

      if (!selectedTier?.id) {
        alert("Subscription failed: Missing tier information.");
        setIsProcessing(false);
        return;
      }

      // Create subscription
      const subscriptionPayload = {
        payment_id: result.payment_id,
        gateway_subscription_id: result.charge_id,
        premium_tier_id: selectedTier.id
      };
      
      console.log("📦 Subscription payload:", subscriptionPayload);

      const subscriptionRes = await fetch('http://127.0.0.1:8000/api/auth/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(subscriptionPayload)
      });

      if (!subscriptionRes.ok) {
        const subscriptionError = await subscriptionRes.json();
        throw new Error(subscriptionError.message || 'Subscription creation failed');
      }

      alert('Payment successful! Premium benefits are now active.');
      setShowPaymentModal(false);
      setSelectedTier(null);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Payment failed');
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const discountCategories = [
    { id: 'restaurant', label: 'Restaurants', icon: Utensils },
    { id: 'museum', label: 'Museums', icon: Building2 },
    { id: 'attraction', label: 'Attractions', icon: Camera },
    { id: 'shop', label: 'Shopping', icon: Tag },
    { id: 'realestate', label: 'Real Estate', icon: Home }
  ];

  const propertyTypes = [
    { id: 'all', label: 'All Properties', icon: Home },
    { id: 'apartment', label: 'Apartments', icon: Layers },
    { id: 'villa', label: 'Villas', icon: Home },
    { id: 'commercial', label: 'Commercial', icon: Building2 },
    { id: 'penthouse', label: 'Penthouses', icon: Layers },
    { id: 'townhouse', label: 'Townhouses', icon: Home }
  ];

  const filteredDiscounts = selectedCategory
    ? premiumDiscounts.filter(d => d.category === selectedCategory)
    : premiumDiscounts;

  const filteredProperties = selectedPropertyType && selectedPropertyType !== 'all'
    ? realEstateProperties.filter(p => p.type === selectedPropertyType)
    : realEstateProperties;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error loading premium content: {error}
        </div>
        <button 
          onClick={fetchData}
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
          <Crown className="h-12 w-12 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Upgrade to Premium</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Unlock exclusive benefits and enhance your travel experience with our premium features
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {isLoading.benefits ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm h-64 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ))
        ) : (
          benefits.map((benefit, i) => {
            const Icon = iconMap[benefit.icon] || Star;
            return (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-600 mb-4">{benefit.description}</p>
                {benefit.hasAction && (
                  <button
                    onClick={handleSupportAccess}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                  >
                    Contact Support <MessageCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Premium Discounts Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Exclusive Premium Discounts</h2>
          <p className="text-gray-600">Special offers and discounts available only for premium members</p>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedCategory === null
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Ticket className="h-4 w-4" />
            All Discounts
          </button>
          {discountCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </button>
          ))}
        </div>

        {isLoading.discounts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm h-96 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiscounts.map(discount => (
              <div key={discount.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:scale-[1.02]">
                <div className="relative h-48">
                  <img
                    src={discount.image}
                    alt={discount.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {discount.discount}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{discount.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{discount.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {discount.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Valid until {new Date(discount.validUntil).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real Estate Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Premium Real Estate Listings</h2>
          <p className="text-gray-600">Exclusive properties with special deals for premium members</p>
        </div>

        {/* Property Type Filter */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {propertyTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedPropertyType(type.id === 'all' ? null : type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                (selectedPropertyType === null && type.id === 'all') || selectedPropertyType === type.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <type.icon className="h-4 w-4" />
              {type.label}
            </button>
          ))}
        </div>

        {isLoading.properties ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm h-96 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <div key={property.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:scale-[1.02]">
                <div className="relative h-48">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    {property.type === 'apartment' && <Layers className="h-3 w-3" />}
                    {property.type === 'villa' && <Home className="h-3 w-3" />}
                    {property.type === 'commercial' && <Building2 className="h-3 w-3" />}
                    {property.type === 'penthouse' && <Layers className="h-3 w-3" />}
                    {property.type === 'townhouse' && <Home className="h-3 w-3" />}
                    {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                  </div>
                  {property.premiumDiscount && (
                    <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {property.premiumDiscount.split(' ')[0]}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{property.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                  
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <BedDouble className="h-4 w-4 mr-1" />
                      {property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Bath className="h-4 w-4 mr-1" />
                      {property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Ruler className="h-4 w-4 mr-1" />
                      {property.area}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold text-purple-600">{property.price}</p>
                      {property.premiumDiscount && (
                        <p className="text-xs text-purple-500">{property.premiumDiscount}</p>
                      )}
                    </div>
                    <button className="text-purple-600 hover:text-purple-700 flex items-center gap-1">
                      View Details <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pricing Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h2>
        
        {/* Plan Type Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'individual'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Individual Plans
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'business'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Business Plans
          </button>
        </div>

        {isLoading.pricing ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm h-96 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers
              .filter(tier => tier.type === activeTab)
              .map((tier, index) => (
                <div
                  key={tier.id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                    tier.isPopular ? 'ring-2 ring-purple-600' : ''
                  }`}
                >
                  {tier.isPopular && (
                    <div className="bg-purple-600 text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">€{tier.price}</span>
                      <span className="text-gray-600">/{tier.period}</span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleSubscribe(tier)}
                      className={`w-full py-2 px-4 rounded-lg font-medium ${
                        tier.isPopular
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Subscribe Now
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedTier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Subscribe to {selectedTier.name}</h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedTier(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-600">
                You are about to subscribe to our {selectedTier.name} plan at €{selectedTier.price}/{selectedTier.period}
              </p>
            </div>
            
            <div className="mb-6">
              <CardElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
            
            <button
              onClick={handlePayment}
              disabled={!stripe || isProcessing}
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
                  Pay €{selectedTier.price}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumSection;