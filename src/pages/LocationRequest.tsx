import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import NeuralBackground from '../components/NeuralBackground';
import { DottedSurface } from '../components/ui/dotted-surface';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

interface LocationRequestProps {
  onSubmit: (location: string, businessType: string) => void;
}

const LocationRequest: React.FC<LocationRequestProps> = ({ onSubmit }) => {
  const [location, setLocation] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessScale, setBusinessScale] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteService = useRef<any | null>(null);
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  const handleLocationChange = (value: string) => {
    setLocation(value);
    
    if (value.length > 2 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          types: ['establishment', 'geocode']
        },
        (predictions: any, status: any) => {
          if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions.slice(0, 5));
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setLocation(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const businessTypes = [
    'Restaurant',
    'Cafe',
    'Retail Store',
    'Office Space',
    'Gym/Fitness',
    'Beauty Salon',
    'Medical Clinic',
    'Educational Center',
    'Entertainment Venue',
    'Service Business',
  ];

  const businessScales = [
    'SME',
    'Franchise',
    'Corporate'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim() && businessType) {
      onSubmit(location.trim(), businessType);
    }
  };

  const isFormValid = location.trim() && businessType && businessScale;

  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-16 relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/motion.webm" type="video/webm" />
      </video>
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      <DottedSurface />
      
      <div className="w-full max-w-7xl space-y-12 animate-fade-in relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <MapPin className="w-16 h-16 text-blue-500 drop-shadow-lg" fill="currentColor" />
              <div className="absolute inset-0 blur-xl bg-blue-500/30"></div>
            </div>
            <h1 className="text-7xl font-bold text-white drop-shadow-2xl">
              BizLocate
            </h1>
          </div>
          <p className="text-2xl text-white/90 font-medium drop-shadow-lg">
            Finding the best location for your business
          </p>
        </div>

        {/* Horizontal Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-start gap-4 max-w-6xl mx-auto">
            {/* Location Input with Suggestions */}
            <div className="flex-1 relative">
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="e.g., near LRT KLCC, Malaysia"
                className="w-full h-14 px-12 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg text-base"
                required
              />
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-2xl max-h-80 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {suggestion.structured_formatting.main_text}
                          </div>
                          <div className="text-sm text-gray-600">
                            {suggestion.structured_formatting.secondary_text}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Business Type Dropdown */}
            <div className="relative">
              <select
                id="business-type"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="h-14 px-6 pr-10 bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg min-w-[220px] appearance-none text-base"
                required
              >
                <option value="">Select business type</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>

            {/* Business Scale Dropdown */}
            <div className="relative">
              <select
                id="business-scale"
                value={businessScale}
                onChange={(e) => setBusinessScale(e.target.value)}
                className="h-14 px-6 pr-10 bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg min-w-[220px] appearance-none text-base"
                required
              >
                <option value="">Select business scale</option>
                {businessScales.map((scale) => (
                  <option key={scale} value={scale}>
                    {scale}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 whitespace-nowrap text-base"
            >
              {isFormValid ? 'Analyze Location' : 'Fill all fields'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationRequest;