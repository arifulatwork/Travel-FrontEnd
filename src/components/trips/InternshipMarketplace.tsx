import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  DollarSign, 
  Star, 
  MapPin, 
  Calendar,
  X,
  Check,
  Users,
  Briefcase,
  Building,
  Award,
  CreditCard
} from 'lucide-react';

// Types
interface Internship {
  id: number;
  title: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  company: string;
  location: string;
  mode: 'remote' | 'on-site' | 'hybrid';
  skills: string[];
  learningOutcomes: string[];
  image: string;
  featured: boolean;
  deadline?: string;
  spotsLeft?: number;
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  count: number;
}

interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  locations: string[];
  modes: string[];
  skills: string[];
}

// Mock data
const CATEGORIES: Category[] = [
  { id: 'it', name: 'Information Technology', icon: Briefcase, count: 42 },
  { id: 'management', name: 'Business Management', icon: Users, count: 28 },
  { id: 'marketing', name: 'Digital Marketing', icon: Building, count: 19 },
  { id: 'design', name: 'UI/UX Design', icon: Award, count: 15 },
  { id: 'data', name: 'Data Science', icon: BookOpen, count: 23 },
];

const LOCATIONS = ['North America', 'Europe', 'Asia', 'Africa', 'South America', 'Australia', 'Remote'];
const MODES = ['Remote', 'On-site', 'Hybrid'];
const SKILLS = ['React', 'Python', 'Leadership', 'Marketing', 'Design', 'Data Analysis', 'Project Management'];

const InternshipMarketplace: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 5000],
    locations: [],
    modes: [],
    skills: []
  });

  // Load mock data
  useEffect(() => {
    const loadInternships = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockInternships: Internship[] = [
          {
            id: 1,
            title: 'Frontend Development Intern',
            category: 'it',
            description: 'Join our dynamic team to build cutting-edge web applications using React and TypeScript.',
            duration: '3 months',
            price: 299,
            originalPrice: 399,
            rating: 4.8,
            reviewCount: 142,
            company: 'TechInnovate Inc.',
            location: 'North America',
            mode: 'remote',
            skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
            learningOutcomes: [
              'Master React and modern frontend frameworks',
              'Learn to work in agile development teams',
              'Build portfolio-worthy projects'
            ],
            image: '/api/placeholder/300/200?text=Frontend+Intern',
            featured: true,
            deadline: '2023-11-30',
            spotsLeft: 5
          },
          {
            id: 2,
            title: 'IT Project Management Intern',
            category: 'management',
            description: 'Gain hands-on experience managing IT projects from conception to delivery.',
            duration: '4 months',
            price: 349,
            rating: 4.6,
            reviewCount: 89,
            company: 'GlobalTech Solutions',
            location: 'Europe',
            mode: 'hybrid',
            skills: ['Project Management', 'Agile', 'Scrum', 'JIRA'],
            learningOutcomes: [
              'Learn project management methodologies',
              'Develop leadership and team coordination skills',
              'Understand budgeting and resource allocation'
            ],
            image: '/api/placeholder/300/200?text=IT+Management',
            featured: true,
            spotsLeft: 8
          },
          {
            id: 3,
            title: 'Data Science Internship',
            category: 'data',
            description: 'Work with large datasets and build machine learning models in a real-world environment.',
            duration: '6 months',
            price: 449,
            originalPrice: 549,
            rating: 4.9,
            reviewCount: 217,
            company: 'DataInsights Corp',
            location: 'Asia',
            mode: 'on-site',
            skills: ['Python', 'Machine Learning', 'SQL', 'Data Visualization'],
            learningOutcomes: [
              'Master data cleaning and preprocessing techniques',
              'Build and evaluate machine learning models',
              'Create compelling data visualizations'
            ],
            image: '/api/placeholder/300/200?text=Data+Science',
            featured: false,
            deadline: '2023-12-15'
          },
          {
            id: 4,
            title: 'Digital Marketing Intern',
            category: 'marketing',
            description: 'Develop and execute digital marketing campaigns across various platforms.',
            duration: '3 months',
            price: 249,
            rating: 4.5,
            reviewCount: 93,
            company: 'NextGen Media',
            location: 'Remote',
            mode: 'remote',
            skills: ['SEO', 'Social Media', 'Content Marketing', 'Analytics'],
            learningOutcomes: [
              'Plan and execute multi-channel marketing campaigns',
              'Analyze campaign performance with analytics tools',
              'Optimize content for search engines'
            ],
            image: '/api/placeholder/300/200?text=Marketing',
            featured: false
          },
          {
            id: 5,
            title: 'UI/UX Design Intern',
            category: 'design',
            description: 'Create intuitive and beautiful user interfaces for our product suite.',
            duration: '4 months',
            price: 329,
            originalPrice: 399,
            rating: 4.7,
            reviewCount: 124,
            company: 'DesignCraft Studios',
            location: 'North America',
            mode: 'hybrid',
            skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping'],
            learningOutcomes: [
              'Conduct user research and usability testing',
              'Create wireframes and interactive prototypes',
              'Design responsive interfaces for multiple devices'
            ],
            image: '/api/placeholder/300/200?text=UI/UX+Design',
            featured: true,
            spotsLeft: 3
          },
          {
            id: 6,
            title: 'Business Analytics Intern',
            category: 'data',
            description: 'Help businesses make data-driven decisions through analytical insights.',
            duration: '5 months',
            price: 399,
            rating: 4.6,
            reviewCount: 78,
            company: 'StrategyPlus Consultants',
            location: 'Europe',
            mode: 'remote',
            skills: ['Excel', 'SQL', 'Tableau', 'Statistical Analysis'],
            learningOutcomes: [
              'Transform raw data into actionable insights',
              'Create dashboards and reports for stakeholders',
              'Develop predictive models for business forecasting'
            ],
            image: '/api/placeholder/300/200?text=Business+Analytics',
            featured: false
          }
        ];
        setInternships(mockInternships);
        setFilteredInternships(mockInternships);
        setLoading(false);
      }, 800);
    };

    loadInternships();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...internships];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(internship => 
        internship.title.toLowerCase().includes(query) ||
        internship.description.toLowerCase().includes(query) ||
        internship.company.toLowerCase().includes(query) ||
        internship.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }
    
    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(internship => 
        filters.categories.includes(internship.category)
      );
    }
    
    // Price filter
    result = result.filter(internship => 
      internship.price >= filters.priceRange[0] && 
      internship.price <= filters.priceRange[1]
    );
    
    // Location filter
    if (filters.locations.length > 0) {
      result = result.filter(internship => 
        filters.locations.includes(internship.location)
      );
    }
    
    // Mode filter
    if (filters.modes.length > 0) {
      result = result.filter(internship => 
        filters.modes.map(m => m.toLowerCase()).includes(internship.mode)
      );
    }
    
    // Skills filter
    if (filters.skills.length > 0) {
      result = result.filter(internship => 
        filters.skills.some(skill => 
          internship.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
        )
      );
    }
    
    setFilteredInternships(result);
  }, [searchQuery, filters, internships]);

  const handleFilterChange = (filterType: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const toggleFilter = (filterType: keyof FilterOptions, item: string) => {
    setFilters(prev => {
      const currentFilters = [...prev[filterType]] as string[];
      const index = currentFilters.indexOf(item);
      
      if (index >= 0) {
        currentFilters.splice(index, 1);
      } else {
        currentFilters.push(item);
      }
      
      return {
        ...prev,
        [filterType]: currentFilters
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 5000],
      locations: [],
      modes: [],
      skills: []
    });
    setSearchQuery('');
  };

  const handleEnroll = (internship: Internship) => {
    setSelectedInternship(internship);
    // In a real app, this would open a payment modal or redirect to a checkout page
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            className={`h-4 w-4 ${
              star <= Math.floor(rating) 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`} 
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse text-2xl font-bold text-gray-900 mb-4">Loading internships...</div>
            <div className="flex justify-center">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900">Global Internship Marketplace</h1>
            <p className="mt-2 text-lg text-gray-600">
              Discover internship opportunities from around the world
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Always visible on large screens */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 lg:mb-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Clear all
                </button>
              </div>
              
              {/* Search inside filters */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search internships..."
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Scrollable filters container */}
              <div className="overflow-y-auto max-h-[calc(100vh-250px)] pr-2">
                {/* Categories Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                  <div className="space-y-1">
                    {CATEGORIES.map(category => {
                      const Icon = category.icon;
                      return (
                        <div key={category.id} className="flex items-center">
                          <button
                            onClick={() => toggleFilter('categories', category.id)}
                            className={`flex items-center flex-1 text-left p-2 rounded-md text-sm ${
                              filters.categories.includes(category.id) 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            <span className="flex-1">{category.name}</span>
                            <span className="text-xs text-gray-500">({category.count})</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
                  <div className="space-y-1">
                    {LOCATIONS.map(location => (
                      <div key={location} className="flex items-center">
                        <button
                          onClick={() => toggleFilter('locations', location)}
                          className={`flex items-center flex-1 text-left p-2 rounded-md text-sm ${
                            filters.locations.includes(location) 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{location}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mode Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Work Mode</h3>
                  <div className="space-y-1">
                    {MODES.map(mode => (
                      <div key={mode} className="flex items-center">
                        <button
                          onClick={() => toggleFilter('modes', mode)}
                          className={`flex items-center flex-1 text-left p-2 rounded-md text-sm ${
                            filters.modes.includes(mode) 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Briefcase className="h-4 w-4 mr-2" />
                          <span>{mode}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
                  <div className="space-y-1">
                    {SKILLS.map(skill => (
                      <div key={skill} className="flex items-center">
                        <button
                          onClick={() => toggleFilter('skills', skill)}
                          className={`flex items-center flex-1 text-left p-2 rounded-md text-sm ${
                            filters.skills.includes(skill) 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Award className="h-4 w-4 mr-2" />
                          <span>{skill}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                  <div className="px-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">${filters.priceRange[0]}</span>
                      <span className="text-xs text-gray-500">${filters.priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-gray-600 mt-2 text-center">
                      Up to ${filters.priceRange[1]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing <span className="font-medium">{filteredInternships.length}</span> internships
              </p>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                <select className="text-sm border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500">
                  <option>Most Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Highest Rated</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            {/* Internship Grid */}
            {filteredInternships.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No internships found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredInternships.map(internship => (
                  <div key={internship.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                    {internship.featured && (
                      <div className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1">
                        Featured
                      </div>
                    )}
                    <div className="relative">
                      <img 
                        src={internship.image} 
                        alt={internship.title}
                        className="w-full h-48 object-cover"
                      />
                      {internship.spotsLeft && internship.spotsLeft < 10 && (
                        <div className="absolute top-3 right-3 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                          Only {internship.spotsLeft} spots left
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
                          <p className="text-sm text-gray-600">{internship.company}</p>
                        </div>
                        {internship.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">${internship.originalPrice}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="mr-4">{internship.location}</span>
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span className="capitalize">{internship.mode}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{internship.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-600">{internship.duration}</span>
                        </div>
                        {renderStars(internship.rating)}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {internship.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                            {skill}
                          </span>
                        ))}
                        {internship.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                            +{internship.skills.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-gray-900">
                          ${internship.price}
                        </div>
                        <button
                          onClick={() => handleEnroll(internship)}
                          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Enroll Now
                        </button>
                      </div>
                      
                      {internship.deadline && (
                        <div className="mt-3 text-xs text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Application deadline: {new Date(internship.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Enrollment Modal */}
        {selectedInternship && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Enroll in {selectedInternship.title}</h2>
                  <button 
                    onClick={() => setSelectedInternship(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="md:w-1/3">
                    <img 
                      src={selectedInternship.image} 
                      alt={selectedInternship.title}
                      className="w-full rounded-lg"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-lg font-semibold mb-2">Program Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{selectedInternship.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{selectedInternship.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="capitalize">{selectedInternship.mode}</span>
                      </div>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{selectedInternship.company}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">What You'll Learn</h3>
                    <ul className="text-sm space-y-1 mb-4">
                      {selectedInternship.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Program fee</span>
                      <span className="font-semibold">${selectedInternship.price}</span>
                    </div>
                    {selectedInternship.originalPrice && (
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Original price</span>
                        <span className="line-through">${selectedInternship.originalPrice}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center font-bold">
                      <span>Total</span>
                      <span>${selectedInternship.price}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                      Save for later
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Global Internship Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InternshipMarketplace;