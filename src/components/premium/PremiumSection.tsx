import React, { useState } from 'react';
import { Crown, Check, Star, Globe, Zap, Shield, Gift, Clock, X, CreditCard, MessageCircle, Ticket, Coffee, Building2, Camera, Utensils, MapPin, Calendar, Tag, ArrowRight, Home, BedDouble, Bath, Ruler, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PricingTier {
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

const PremiumSection: React.FC = () => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [activeTab, setActiveTab] = useState<'individual' | 'business'>('individual');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string | null>(null);

  const handleSupportAccess = () => {
    navigate('/messages?openSupport=true');
  };

  const benefits = [
    {
      icon: Star,
      title: 'Priority Access',
      description: 'Book popular experiences before they sell out'
    },
    {
      icon: Globe,
      title: 'Worldwide Coverage',
      description: 'Travel insurance coverage in all destinations'
    },
    {
      icon: MessageCircle,
      title: 'Fast Support',
      description: '24/7 priority customer support',
      action: handleSupportAccess,
      actionLabel: 'Contact Support'
    },
    {
      icon: Shield,
      title: 'Secure Bookings',
      description: 'Full refund guarantee for cancellations'
    },
    {
      icon: Gift,
      title: 'Exclusive Perks',
      description: 'Access to members-only events and offers'
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Free rescheduling on all bookings'
    }
  ];

  const pricingTiers: PricingTier[] = [
    {
      name: 'Basic',
      price: 4.99,
      period: 'month',
      type: 'individual',
      features: [
        'Priority booking access',
        'Basic travel insurance',
        'Email support',
        'Basic cancellation coverage',
        'Access to premium discounts'
      ]
    },
    {
      name: 'Pro',
      price: 9.99,
      period: 'month',
      type: 'individual',
      isPopular: true,
      features: [
        'All Basic features',
        'Premium travel insurance',
        '24/7 priority support',
        'Full cancellation coverage',
        'Exclusive member events',
        'Flexible rescheduling',
        'VIP discounts and offers',
        'Early access to new discounts'
      ]
    },
    {
      name: 'Business Starter',
      price: 19.99,
      period: 'month',
      type: 'business',
      features: [
        'All Pro features',
        'Up to 5 team members',
        'Basic travel management',
        'Standard reporting',
        'Group booking discounts'
      ]
    },
    {
      name: 'Business Pro',
      price: 49.99,
      period: 'month',
      type: 'business',
      isPopular: true,
      features: [
        'All Business Starter features',
        'Up to 20 team members',
        'Advanced travel management',
        'Custom travel reports',
        'Dedicated account manager',
        'Priority group bookings',
        'Custom corporate rates'
      ]
    },
    {
      name: 'Enterprise',
      price: 99.99,
      period: 'month',
      type: 'business',
      features: [
        'All Business Pro features',
        'Unlimited team members',
        'Enterprise travel management',
        'Advanced analytics & reporting',
        'Custom integration options',
        'Multiple account managers',
        'Bespoke corporate packages'
      ]
    }
  ];

  // Sample premium discounts data
  const premiumDiscounts: SpecialDiscount[] = [
    {
      id: '1',
      title: 'Sagrada Familia VIP Tour',
      description: '25% off on VIP guided tours with skip-the-line access',
      location: 'Barcelona',
      discount: '25% OFF',
      category: 'attraction',
      validUntil: '2024-12-31',
      image: 'https://images.unsplash.com/photo-1583779457094-ab6f77f7bf57?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      title: 'El Nacional Restaurant',
      description: '20% discount on total bill for premium members',
      location: 'Barcelona',
      discount: '20% OFF',
      category: 'restaurant',
      validUntil: '2024-12-31',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      title: 'MNAC Museum',
      description: 'Free audio guide and 30% off on tickets',
      location: 'Barcelona',
      discount: '30% OFF',
      category: 'museum',
      validUntil: '2024-12-31',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '4',
      title: 'El Corte Inglés',
      description: '15% discount on all purchases + tax refund service',
      location: 'Barcelona',
      discount: '15% OFF',
      category: 'shop',
      validUntil: '2024-12-31',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '5',
      title: 'Luxury Beachfront Villa',
      description: 'Exclusive 10% discount for premium members on selected dates',
      location: 'Costa Brava',
      discount: '10% OFF',
      category: 'realestate',
      validUntil: '2024-12-31',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Sample real estate properties
  const realEstateProperties: RealEstateProperty[] = [
    {
      id: 're1',
      title: 'Modern Downtown Apartment',
      description: 'Spacious 3-bedroom apartment with panoramic city views',
      location: 'Barcelona, Eixample',
      price: '€1,200,000',
      type: 'apartment',
      bedrooms: 3,
      bathrooms: 2,
      area: '120 m²',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
      premiumDiscount: '5% discount for premium members'
    },
    {
      id: 're2',
      title: 'Luxury Beachfront Villa',
      description: 'Private villa with direct beach access and infinity pool',
      location: 'Costa Brava',
      price: '€3,500,000',
      type: 'villa',
      bedrooms: 5,
      bathrooms: 4,
      area: '350 m²',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      premiumDiscount: '10% discount for premium members'
    },
    {
      id: 're3',
      title: 'Commercial Space in City Center',
      description: 'Prime retail space in the heart of Barcelona',
      location: 'Barcelona, Gothic Quarter',
      price: '€2,800,000',
      type: 'commercial',
      bedrooms: 0,
      bathrooms: 2,
      area: '250 m²',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      premiumDiscount: '7% discount for premium members'
    },
    {
      id: 're4',
      title: 'Penthouse with Terrace',
      description: 'Luxurious penthouse with 360° views and private terrace',
      location: 'Barcelona, Diagonal Mar',
      price: '€2,100,000',
      type: 'penthouse',
      bedrooms: 4,
      bathrooms: 3,
      area: '180 m²',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      premiumDiscount: '5% discount for premium members'
    },
    {
      id: 're5',
      title: 'Countryside Mansion',
      description: 'Historic mansion with extensive gardens and vineyard',
      location: 'Sitges',
      price: '€4,200,000',
      type: 'villa',
      bedrooms: 6,
      bathrooms: 5,
      area: '500 m²',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      premiumDiscount: '8% discount for premium members'
    },
    {
      id: 're6',
      title: 'Modern Office Space',
      description: 'Fully equipped office space in tech district',
      location: 'Barcelona, 22@ District',
      price: '€1,800,000',
      type: 'commercial',
      bedrooms: 0,
      bathrooms: 2,
      area: '200 m²',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
      premiumDiscount: '6% discount for premium members'
    },
    {
      id: 're7',
      title: 'Chic Townhouse',
      description: 'Renovated townhouse in the historic district',
      location: 'Barcelona, Born',
      price: '€1,950,000',
      type: 'townhouse',
      bedrooms: 3,
      bathrooms: 2,
      area: '160 m²',
      image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=800&q=80',
      premiumDiscount: '5% discount for premium members'
    }
  ];

  const handleSubscribe = (tier: PricingTier) => {
    setSelectedTier(tier);
    setShowPaymentModal(true);
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
    ? premiumDiscounts.filter(discount => discount.category === selectedCategory)
    : premiumDiscounts;

  const filteredProperties = selectedPropertyType && selectedPropertyType !== 'all'
    ? realEstateProperties.filter(property => property.type === selectedPropertyType)
    : realEstateProperties;

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
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <benefit.icon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
            <p className="text-gray-600 mb-4">{benefit.description}</p>
            {benefit.action && (
              <button
                onClick={benefit.action}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                {benefit.actionLabel}
                <MessageCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers
            .filter(tier => tier.type === activeTab)
            .map((tier, index) => (
              <div
                key={index}
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
            <div className="mb-6">
              <p className="text-gray-600">
                You are about to subscribe to our {selectedTier.name} plan at €{selectedTier.price}/{selectedTier.period}
              </p>
            </div>
            <button
              onClick={() => {
                // Handle payment processing
                setShowPaymentModal(false);
                setSelectedTier(null);
              }}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <CreditCard className="h-5 w-5" />
              Process Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumSection;