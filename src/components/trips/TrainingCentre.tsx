import React, { useState, useEffect } from 'react';
import {
  BookOpen, Users, Calendar, MapPin, Clock, Award,
  Check, Star, Globe, Building2, MessageCircle, ArrowRight,
  CreditCard, Loader2, X, ChevronDown, ChevronUp,
  Laptop, Briefcase, Languages, Microscope, Palette,
  Code, BarChart3, Heart, Camera, Music
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  price: number;
  originalPrice?: number;
  location: string;
  instructor: string;
  rating: number;
  students: number;
  image: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  seats: number;
  startDate: string;
  endDate: string;
  includes: string[];
  requirements: string[];
}

interface TrainingCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
}

interface Location {
  id: string;
  city: string;
  country: string;
  flag: string;
  address: string;
  capacity: number;
}

const TrainingCentre: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<TrainingProgram | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showErasmusInfo, setShowErasmusInfo] = useState(false);

  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [categories, setCategories] = useState<TrainingCategory[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setCategories([
          {
            id: 'programming',
            name: 'Programming & Tech',
            icon: Code,
            description: 'Web development, mobile apps, software engineering',
            color: 'bg-blue-100 text-blue-600'
          },
          {
            id: 'business',
            name: 'Business & Marketing',
            icon: Briefcase,
            description: 'Digital marketing, entrepreneurship, management',
            color: 'bg-green-100 text-green-600'
          },
          {
            id: 'languages',
            name: 'Language Courses',
            icon: Languages,
            description: 'English, Spanish, German and more',
            color: 'bg-purple-100 text-purple-600'
          },
          {
            id: 'data-science',
            name: 'Data Science',
            icon: BarChart3,
            description: 'AI, machine learning, data analysis',
            color: 'bg-orange-100 text-orange-600'
          },
          {
            id: 'design',
            name: 'Design & Creative',
            icon: Palette,
            description: 'UI/UX design, graphic design, photography',
            color: 'bg-pink-100 text-pink-600'
          },
          {
            id: 'healthcare',
            name: 'Healthcare',
            icon: Heart,
            description: 'Medical training, nursing, healthcare',
            color: 'bg-red-100 text-red-600'
          }
        ]);

        setLocations([
          {
            id: 'barcelona',
            city: 'Barcelona',
            country: 'Spain',
            flag: '🇪🇸',
            address: 'Tech Campus Barcelona, Diagonal 123',
            capacity: 50
          },
          {
            id: 'vilnius',
            city: 'Vilnius',
            country: 'Lithuania',
            flag: '🇱🇹',
            address: 'Innovation Hub Vilnius, Gedimino 45',
            capacity: 35
          },
          {
            id: 'riga',
            city: 'Riga',
            country: 'Latvia',
            flag: '🇱🇻',
            address: 'Creative Center Riga, Brivibas 67',
            capacity: 40
          },
          {
            id: 'online',
            city: 'Online',
            country: 'Remote',
            flag: '🌐',
            address: 'Live interactive sessions',
            capacity: 100
          }
        ]);

        setTrainings([
          {
            id: '1',
            title: 'Full-Stack Web Development',
            description: 'Learn modern web development with React, Node.js, and MongoDB. Build real-world projects and portfolio.',
            category: 'programming',
            duration: '8 weeks',
            price: 899,
            originalPrice: 1199,
            location: 'barcelona',
            instructor: 'Dr. Maria Rodriguez',
            rating: 4.9,
            students: 234,
            image: '/api/placeholder/400/250',
            level: 'intermediate',
            seats: 12,
            startDate: '2024-03-15',
            endDate: '2024-05-10',
            includes: ['Course materials', 'Project mentorship', 'Certificate', 'Career support'],
            requirements: ['Basic HTML/CSS knowledge', 'Laptop required', 'Intermediate English']
          },
          {
            id: '2',
            title: 'Business English Mastery',
            description: 'Improve your professional English communication skills for international business environments.',
            category: 'languages',
            duration: '6 weeks',
            price: 499,
            originalPrice: 699,
            location: 'vilnius',
            instructor: 'Prof. James Wilson',
            rating: 4.7,
            students: 156,
            image: '/api/placeholder/400/250',
            level: 'beginner',
            seats: 15,
            startDate: '2024-04-01',
            endDate: '2024-05-15',
            includes: ['Course materials', 'Speaking practice', 'Certificate', 'Business vocabulary'],
            requirements: ['Basic English knowledge', 'Willingness to practice']
          },
          {
            id: '3',
            title: 'Digital Marketing Strategy',
            description: 'Master digital marketing channels, analytics, and strategy development for modern businesses.',
            category: 'business',
            duration: '10 weeks',
            price: 799,
            originalPrice: 999,
            location: 'riga',
            instructor: 'Sarah Chen',
            rating: 4.8,
            students: 189,
            image: '/api/placeholder/400/250',
            level: 'intermediate',
            seats: 12,
            startDate: '2024-03-20',
            endDate: '2024-05-29',
            includes: ['Case studies', 'Tools access', 'Certificate', 'Portfolio review'],
            requirements: ['Basic marketing knowledge', 'Laptop required']
          },
          {
            id: '4',
            title: 'Data Science Fundamentals',
            description: 'Introduction to Python, statistics, and machine learning for data analysis and visualization.',
            category: 'data-science',
            duration: '12 weeks',
            price: 1299,
            originalPrice: 1599,
            location: 'barcelona',
            instructor: 'Dr. Alex Thompson',
            rating: 4.9,
            students: 178,
            image: '/api/placeholder/400/250',
            level: 'beginner',
            seats: 14,
            startDate: '2024-04-10',
            endDate: '2024-06-30',
            includes: ['Python tutorials', 'Dataset access', 'Certificate', 'Project guidance'],
            requirements: ['Basic math knowledge', 'Laptop required', 'No coding experience needed']
          },
          {
            id: '5',
            title: 'UI/UX Design Bootcamp',
            description: 'Learn user-centered design principles, prototyping, and design tools like Figma and Adobe XD.',
            category: 'design',
            duration: '8 weeks',
            price: 699,
            originalPrice: 899,
            location: 'vilnius',
            instructor: 'Elena Petrova',
            rating: 4.6,
            students: 145,
            image: '/api/placeholder/400/250',
            level: 'beginner',
            seats: 12,
            startDate: '2024-03-25',
            endDate: '2024-05-20',
            includes: ['Design tools', 'Portfolio projects', 'Certificate', 'Mentorship'],
            requirements: ['Creative mindset', 'Laptop required', 'Basic computer skills']
          },
          {
            id: '6',
            title: 'Healthcare Management',
            description: 'Modern healthcare administration, patient care coordination, and medical facility management.',
            category: 'healthcare',
            duration: '10 weeks',
            price: 899,
            originalPrice: 1099,
            location: 'riga',
            instructor: 'Dr. Robert Kim',
            rating: 4.8,
            students: 98,
            image: '/api/placeholder/400/250',
            level: 'intermediate',
            seats: 12,
            startDate: '2024-04-05',
            endDate: '2024-06-14',
            includes: ['Case studies', 'Industry insights', 'Certificate', 'Networking'],
            requirements: ['Healthcare background', 'Intermediate English']
          },
          {
            id: '7',
            title: 'Spanish for Beginners',
            description: 'Learn Spanish from scratch with focus on conversation and practical communication skills.',
            category: 'languages',
            duration: '6 weeks',
            price: 399,
            location: 'barcelona',
            instructor: 'Carlos Mendez',
            rating: 4.5,
            students: 267,
            image: '/api/placeholder/400/250',
            level: 'beginner',
            seats: 18,
            startDate: '2024-03-18',
            endDate: '2024-04-29',
            includes: ['Course materials', 'Audio lessons', 'Certificate', 'Cultural insights'],
            requirements: ['No prior knowledge needed', 'Willingness to practice']
          },
          {
            id: '8',
            title: 'Python Programming Online',
            description: 'Complete Python programming course with live online sessions and real-time coding practice.',
            category: 'programming',
            duration: '8 weeks',
            price: 599,
            originalPrice: 799,
            location: 'online',
            instructor: 'David Park',
            rating: 4.7,
            students: 312,
            image: '/api/placeholder/400/250',
            level: 'beginner',
            seats: 25,
            startDate: '2024-04-01',
            endDate: '2024-05-24',
            includes: ['Live coding sessions', 'Exercises', 'Certificate', 'Community access'],
            requirements: ['Laptop required', 'Internet connection', 'No prior experience needed']
          }
        ]);

      } catch (err) {
        setError('Failed to load training programs');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEnroll = (training: TrainingProgram) => {
    setSelectedTraining(training);
    setShowTrainingModal(true);
  };

  const handlePayment = async () => {
    if (!selectedTraining) return;
    
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowTrainingModal(false);
    alert(`Successfully enrolled in ${selectedTraining.title}! Confirmation email sent.`);
  };

  const filteredTrainings = trainings.filter(training => {
    const categoryMatch = selectedCategory === 'all' || training.category === selectedCategory;
    const locationMatch = selectedLocation === 'all' || training.location === selectedLocation;
    const levelMatch = selectedLevel === 'all' || training.level === selectedLevel;
    return categoryMatch && locationMatch && levelMatch;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error loading training programs: {error}
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
          <BookOpen className="h-12 w-12 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Training Centre</h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
          Advance your career with our specialized training programs in Barcelona, Lithuania, Latvia, and online. 
          Designed for students and professionals seeking practical skills and international experience.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Erasmus+ Students Welcome!</span>
          </div>
          <p className="text-blue-700 text-sm">
            Erasmus+ students can join these programs. Minimum 12 students per class. 
            Special rates and academic credit available for university partnerships.
          </p>
        </div>
      </div>

      {/* Erasmus Info Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white mb-16">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Erasmus+ Program</h2>
            <p className="opacity-90">
              Special arrangements for Erasmus+ students. Minimum 12 students required to start a program.
              Contact us for group discounts and academic recognition.
            </p>
          </div>
          <button
            onClick={() => setShowErasmusInfo(true)}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Small Class Sizes</h3>
          <p className="text-gray-600">
            Maximum 12-18 students per class ensuring personalized attention and interactive learning.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Award className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">International Certificate</h3>
          <p className="text-gray-600">
            Receive globally recognized certificates upon completion to boost your career prospects.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Building2 className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Modern Facilities</h3>
          <p className="text-gray-600">
            State-of-the-art training centers in Barcelona, Vilnius, Riga, and online options available.
          </p>
        </div>
      </div>

      {/* Locations Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Our Training Locations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-xl shadow-sm p-6 text-center transition-transform hover:scale-[1.02]"
            >
              <div className="text-3xl mb-3">{location.flag}</div>
              <h3 className="font-semibold text-lg mb-1">{location.city}</h3>
              <p className="text-gray-600 text-sm mb-3">{location.country}</p>
              <p className="text-gray-500 text-xs mb-2">{location.address}</p>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                Capacity: {location.capacity} students
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">Training Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`p-4 rounded-lg text-center transition-colors ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BookOpen className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">All Categories</span>
          </button>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg text-center transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex-1"
        >
          <option value="all">All Locations</option>
          {locations.map(location => (
            <option key={location.id} value={location.id}>
              {location.city}, {location.country}
            </option>
          ))}
        </select>
        
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex-1"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Training Programs Grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Available Training Programs</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm h-96 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainings.map((training) => {
              const category = categories.find(c => c.id === training.category);
              const location = locations.find(l => l.id === training.location);
              
              return (
                <div
                  key={training.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:scale-[1.02]"
                >
                  <div className="relative">
                    <img
                      src={training.image}
                      alt={training.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(training.level)}`}>
                        {training.level.charAt(0).toUpperCase() + training.level.slice(1)}
                      </span>
                    </div>
                    {training.originalPrice && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                        Save €{training.originalPrice - training.price}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      {category && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${category.color}`}>
                          {category.name}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{training.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{training.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {location?.city}, {location?.country}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        {training.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        Starts: {new Date(training.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        {training.seats} seats available • {training.students} enrolled
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{training.rating}</span>
                        <span className="text-gray-500 text-sm">({training.students})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-purple-600">€{training.price}</span>
                        {training.originalPrice && (
                          <span className="text-gray-500 text-sm line-through ml-2">€{training.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleEnroll(training)}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-purple-600 text-white rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Your Training?</h2>
        <p className="text-lg mb-6 opacity-90">
          Join hundreds of students who have advanced their careers with our international training programs. 
          Erasmus+ students welcome with special group arrangements.
        </p>
        <button
          onClick={() => navigate('/contact')}
          className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Contact Our Advisors
        </button>
      </div>

      {/* Training Detail Modal */}
      {showTrainingModal && selectedTraining && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedTraining.image}
                alt={selectedTraining.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setShowTrainingModal(false)}
                className="absolute top-4 right-4 bg-white text-gray-500 p-2 rounded-full hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(selectedTraining.level)}`}>
                  {selectedTraining.level.charAt(0).toUpperCase() + selectedTraining.level.slice(1)}
                </span>
                {categories.find(c => c.id === selectedTraining.category) && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    categories.find(c => c.id === selectedTraining.category)?.color
                  }`}>
                    {categories.find(c => c.id === selectedTraining.category)?.name}
                  </span>
                )}
              </div>
              
              <h2 className="text-2xl font-bold mb-4">{selectedTraining.title}</h2>
              <p className="text-gray-700 mb-6">{selectedTraining.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-3">Course Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{selectedTraining.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{new Date(selectedTraining.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">{new Date(selectedTraining.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">
                        {locations.find(l => l.id === selectedTraining.location)?.city}, 
                        {locations.find(l => l.id === selectedTraining.location)?.country}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Instructor:</span>
                      <span className="font-medium">{selectedTraining.instructor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seats Available:</span>
                      <span className="font-medium">{selectedTraining.seats}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">What's Included</h3>
                  <ul className="space-y-2">
                    {selectedTraining.includes.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Requirements</h3>
                <ul className="space-y-1">
                  {selectedTraining.requirements.map((req, index) => (
                    <li key={index} className="text-gray-700">• {req}</li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-2xl font-bold text-purple-600">€{selectedTraining.price}</span>
                    {selectedTraining.originalPrice && (
                      <span className="text-gray-500 line-through ml-2">€{selectedTraining.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex items-center gap-2 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Enroll Now - €{selectedTraining.price}
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Erasmus+ students: Contact us for group discounts (minimum 12 students)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Erasmus Info Modal */}
      {showErasmusInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Erasmus+ Program Information</h3>
              <button
                onClick={() => setShowErasmusInfo(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Special Conditions for Erasmus+ Students</h4>
                <ul className="text-blue-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Minimum 12 students required to start a program
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Group discounts available for Erasmus+ partnerships
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Academic credit recognition support
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Assistance with accommodation and local integration
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Cultural activities and networking events included
                  </li>
                </ul>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">How to Apply as Erasmus+ Group</h4>
                <ol className="text-purple-700 space-y-2">
                  <li>1. Contact our Erasmus+ coordinator with your university details</li>
                  <li>2. We'll create a customized training program for your group</li>
                  <li>3. Coordinate dates and location preferences</li>
                  <li>4. Sign the Erasmus+ inter-institutional agreement</li>
                  <li>5. Start your international training experience!</li>
                </ol>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => navigate('/contact')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Contact Erasmus+ Coordinator
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingCentre;