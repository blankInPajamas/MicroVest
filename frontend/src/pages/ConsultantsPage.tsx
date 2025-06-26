import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, MapPin, Star, Filter } from 'lucide-react';

interface Consultant {
  id: number;
  name: string;
  expertise: string[];
  experience: number;
  rating: number;
  location: string;
  email: string;
  phone: string;
  bio: string;
  hourlyRate: number;
  image: string;
}

const ConsultantsPage: React.FC = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [filteredConsultants, setFilteredConsultants] = useState<Consultant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');

  // Mock data for consultants
  const mockConsultants: Consultant[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      expertise: ["Business Strategy", "Financial Planning", "Market Analysis"],
      experience: 15,
      rating: 4.8,
      location: "New York, NY",
      email: "sarah.johnson@consulting.com",
      phone: "+1 (555) 123-4567",
      bio: "Experienced business consultant with expertise in helping startups scale and established businesses optimize their operations.",
      hourlyRate: 250,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      expertise: ["Technology", "Digital Transformation", "Product Development"],
      experience: 12,
      rating: 4.9,
      location: "San Francisco, CA",
      email: "michael.chen@techconsulting.com",
      phone: "+1 (555) 234-5678",
      bio: "Technology consultant specializing in digital transformation and product development for growing companies.",
      hourlyRate: 300,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      expertise: ["Marketing", "Brand Strategy", "Social Media"],
      experience: 8,
      rating: 4.7,
      location: "Los Angeles, CA",
      email: "emily.rodriguez@marketing.com",
      phone: "+1 (555) 345-6789",
      bio: "Marketing consultant helping businesses build strong brands and effective marketing strategies.",
      hourlyRate: 200,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "David Thompson",
      expertise: ["Operations", "Supply Chain", "Process Optimization"],
      experience: 20,
      rating: 4.6,
      location: "Chicago, IL",
      email: "david.thompson@operations.com",
      phone: "+1 (555) 456-7890",
      bio: "Operations expert with decades of experience in supply chain management and process optimization.",
      hourlyRate: 275,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Lisa Wang",
      expertise: ["Human Resources", "Organizational Development", "Leadership Training"],
      experience: 10,
      rating: 4.8,
      location: "Seattle, WA",
      email: "lisa.wang@hrconsulting.com",
      phone: "+1 (555) 567-8901",
      bio: "HR consultant focused on organizational development and leadership training for high-growth companies.",
      hourlyRate: 225,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    }
  ];

  useEffect(() => {
    setConsultants(mockConsultants);
    setFilteredConsultants(mockConsultants);
  }, []);

  useEffect(() => {
    let filtered = consultants;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(consultant =>
        consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultant.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase())) ||
        consultant.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by expertise
    if (selectedExpertise !== 'all') {
      filtered = filtered.filter(consultant =>
        consultant.expertise.some(exp => exp.toLowerCase().includes(selectedExpertise.toLowerCase()))
      );
    }

    // Sort consultants
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'rate':
          return a.hourlyRate - b.hourlyRate;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredConsultants(filtered);
  }, [consultants, searchTerm, selectedExpertise, sortBy]);

  const expertiseOptions = [
    'all',
    'business strategy',
    'financial planning',
    'technology',
    'marketing',
    'operations',
    'human resources'
  ];

  const handleContact = (consultant: Consultant) => {
    // In a real app, this would open a contact form or messaging system
    alert(`Contact ${consultant.name} at ${consultant.email} or ${consultant.phone}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Expert Consultants</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with experienced consultants who can help grow your business and provide expert guidance.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search consultants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Expertise Filter */}
            <div>
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {expertiseOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All Expertise' : option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="rating">Sort by Rating</option>
                <option value="experience">Sort by Experience</option>
                <option value="rate">Sort by Rate</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center">
              <span className="text-gray-600">
                {filteredConsultants.length} consultant{filteredConsultants.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>

        {/* Consultants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsultants.map((consultant) => (
            <div key={consultant.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Consultant Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <img
                    src={consultant.image}
                    alt={consultant.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{consultant.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{consultant.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{consultant.experience} years</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultant Details */}
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {consultant.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{consultant.bio}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {consultant.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {consultant.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {consultant.phone}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-gray-900">
                    ${consultant.hourlyRate}/hr
                  </div>
                  <button
                    onClick={() => handleContact(consultant)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredConsultants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No consultants found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantsPage; 