import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  BookOpen,
  Clock,
  Star,
  MapPin,
  Calendar,
  X,
  Check,
  Users,
  Briefcase,
  Building,
  Award,
  CreditCard,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000/api';

/** ===================== Types ===================== */
interface Internship {
  id: number;
  title: string;
  category: string | null; // slug
  description: string;
  duration: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviewCount: number;
  company: string;
  location: string;
  mode: 'remote' | 'on-site' | 'hybrid';
  skills: string[];
  learningOutcomes: string[];
  image: string;
  featured: boolean;
  deadline?: string | null;
  spotsLeft?: number | null;
}

interface Category {
  id: string; // slug
  name: string;
  icon: React.ComponentType<any>;
  count: number;
}

interface ApiCategory {
  id: string; // slug
  name: string;
  icon?: string | null;
  count: number;
}

interface OptionsResponse {
  categories: ApiCategory[];
  locations: string[];
  modes: string[];           // ["Remote","On-site","Hybrid"] for UI chips
  skills: string[];
  priceRange: [number, number];
}

interface ListResponse {
  data: Internship[];
  meta: {
    total: number; per_page: number; current_page: number; last_page: number;
  };
}

interface FilterOptions {
  categories: string[];                // slugs
  priceRange: [number, number];
  locations: string[];
  modes: string[];                     // UI strings: "Remote" | "On-site" | "Hybrid"
  skills: string[];
}

interface AuthUser {
  id: number | string;
  first_name?: string;
  last_name?: string;
  email?: string;
  location?: string;
}

/** ===================== Helpers ===================== */
const ICONS: Record<string, React.ComponentType<any>> = {
  briefcase: Briefcase,
  users: Users,
  building: Building,
  award: Award,
  'book-open': BookOpen,
};

const toIcon = (icon?: string | null) => {
  if (!icon) return Briefcase;
  return ICONS[icon] ?? Briefcase;
};

const toApiMode = (uiMode: string) =>
  uiMode.toLowerCase() as 'remote' | 'on-site' | 'hybrid';

const mapApiCategoryToUI = (c: ApiCategory): Category => ({
  id: c.id,
  name: c.name,
  icon: toIcon(c.icon),
  count: c.count,
});

function paramsToQuery(params: Record<string, any>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) return;
    if (Array.isArray(v)) v.forEach(item => usp.append(`${k}[]`, String(item)));
    else usp.append(k, String(v));
  });
  return usp.toString();
}

const formatPrice = (n: number) =>
  `€${Number(n).toFixed(2).replace(/\.00$/, '')}`;

/** Auth header helper (same pattern as your ProfileSection) */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
};

// Updated fetchJSON to return status and handle 409
const fetchJSON = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, options);
  const text = await res.text();
  if (!res.ok) {
    // Surface status + message upstream
    let msg = text;
    try { msg = JSON.parse(text)?.message ?? text; } catch {}
    const error: any = new Error(`${res.status} ${res.statusText} — ${msg}`);
    error.status = res.status;
    throw error;
  }
  return JSON.parse(text);
};

// Optional: PaymentIntent confirmation for manual Stripe.js flow
const confirmPaymentIntent = async (payment_intent_id: string) => {
  try {
    const res = await fetchJSON(`${API_BASE}/auth/internships/enroll/confirm`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ payment_intent_id }),
    });
    // handle res.status === 'ok' | 'processing' | 'failed'
    return res;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

/** ===================== Component ===================== */
const InternshipMarketplace: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  // auth'd user (like DestinationCard / ProfileSection)
  const [user, setUser] = useState<AuthUser | null>(null);
  const isAuthed = useMemo(() => !!localStorage.getItem('token'), []);

  // Server-powered options
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [modes, setModes] = useState<string[]>([]); // UI strings
  const [skills, setSkills] = useState<string[]>([]);
  const [dbPriceRange, setDbPriceRange] = useState<[number, number]>([0, 5000]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<'popularity' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('popularity');

  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 5000],
    locations: [],
    modes: [],
    skills: [],
  });

  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [enrollBusy, setEnrollBusy] = useState(false);
  const [enrollError, setEnrollError] = useState<string>('');

  /** ---------- Load authenticated user (if token exists) ---------- */
  useEffect(() => {
    const loadUser = async () => {
      if (!isAuthed) {
        setUser(null);
        return;
      }
      try {
        const u = await fetchJSON(`${API_BASE}/auth/user`, { headers: getAuthHeaders() });
        setUser(u);
      } catch (err) {
        console.warn('Failed to load auth user:', err);
        setUser(null);
      }
    };
    loadUser();
  }, [isAuthed]);

  /** ---------- Load options on mount ---------- */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data: OptionsResponse = await fetchJSON(`${API_BASE}/internships/options`);
        setCategories(data.categories.map(mapApiCategoryToUI));
        setLocations(data.locations);
        setModes(data.modes);
        setSkills(data.skills);
        setDbPriceRange(data.priceRange);
        setFilters((f) => ({ ...f, priceRange: data.priceRange }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /** ---------- Load internships whenever filters/search/sort change ---------- */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const query = paramsToQuery({
          search: searchQuery || undefined,
          categories: filters.categories,                // slugs
          locations: filters.locations,
          modes: filters.modes.map(toApiMode),
          skills: filters.skills,
          price_min: filters.priceRange[0],
          price_max: filters.priceRange[1],
          sort,
          per_page: 60,
        });
        const data: ListResponse = await fetchJSON(`${API_BASE}/internships?${query}`);
        setInternships(data.data);
      } catch (err) {
        console.error(err);
        setInternships([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchQuery, filters, sort]);

  const handleFilterChange = (filterType: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const toggleFilter = (filterType: keyof FilterOptions, item: string) => {
    setFilters(prev => {
      const current = new Set(prev[filterType] as string[]);
      if (current.has(item)) current.delete(item);
      else current.add(item);
      return { ...prev, [filterType]: Array.from(current) } as FilterOptions;
    });
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [...dbPriceRange] as [number, number],
      locations: [],
      modes: [],
      skills: [],
    });
    setSearchQuery('');
    setSort('popularity');
  };

  const handleEnrollClick = (internship: Internship) => {
    if (!isAuthed) {
      alert('Please log in to enroll in an internship.');
      return;
    }
    setSelectedInternship(internship);
    setEnrollError('');
  };

  /** Updated startPayment with 409 handling */
  const startPayment = async () => {
    if (!selectedInternship) return;
    setEnrollBusy(true);
    setEnrollError('');
    try {
      const resp = await fetchJSON(`${API_BASE}/auth/internships/enroll/create-payment-intent`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ internship_id: selectedInternship.id }),
      });

      if (resp?.checkout_url) {
        window.location.href = resp.checkout_url; // Stripe Checkout
        return;
      }

      if (resp?.client_secret) {
        // PaymentIntent (manual confirm with Stripe.js)
        alert('Payment initiated (client_secret received). Plug in Stripe.js confirm here.');
        setSelectedInternship(null);
        return;
      }

      alert('Payment created, but no redirect/client_secret returned. Check backend response.');
      setSelectedInternship(null);
    } catch (err: any) {
      console.error('Payment start error:', err);
      if (err?.status === 409) {
        setEnrollError('You are already enrolled in this internship. 🎉');
      } else {
        setEnrollError(err?.message ?? 'Failed to start payment.');
      }
    } finally {
      setEnrollBusy(false);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600">({rating})</span>
    </div>
  );

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

  const filteredInternships = internships; // server-side filtered already

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">Global Internship Marketplace</h1>
              <p className="mt-2 text-lg text-gray-600">
                Discover internship opportunities from around the world
              </p>
            </div>
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Signed in as</p>
                  <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">
                    {(user.first_name?.[0] || 'U').toUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="hidden sm:block">
                <a
                  href="/login"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Log in
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
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
                    {categories.map(category => {
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
                    {locations.map(location => (
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
                    {modes.map(mode => (
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
                    {skills.map(skill => (
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
                      <span className="text-xs text-gray-500">{formatPrice(filters.priceRange[0])}</span>
                      <span className="text-xs text-gray-500">{formatPrice(filters.priceRange[1])}</span>
                    </div>
                    <input
                      type="range"
                      min={dbPriceRange[0]}
                      max={dbPriceRange[1]}
                      step="10"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value, 10)])
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-gray-600 mt-2 text-center">
                      Up to {formatPrice(filters.priceRange[1])}
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
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
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
                          <span className="text-xs text-gray-500 line-through">{formatPrice(internship.originalPrice)}</span>
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
                          {formatPrice(internship.price)}
                        </div>
                        <button
                          onClick={() => handleEnrollClick(internship)}
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
                      <span className="font-semibold">{formatPrice(selectedInternship.price)}</span>
                    </div>
                    {selectedInternship.originalPrice && (
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Original price</span>
                        <span className="line-through">{formatPrice(selectedInternship.originalPrice)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center font-bold">
                      <span>Total</span>
                      <span>{formatPrice(selectedInternship.price)}</span>
                    </div>
                  </div>

                  {enrollError && (
                    <div className="mb-3 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                      {enrollError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      onClick={() => setSelectedInternship(null)}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={enrollBusy}
                      onClick={startPayment}
                      className={`px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center ${
                        enrollBusy ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      {enrollBusy ? 'Processing…' : 'Proceed to Payment'}
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