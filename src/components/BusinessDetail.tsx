import React from 'react';
import { X, Star, MapPin, Phone, TrendingUp } from 'lucide-react';
import { Business } from '../types';

interface BusinessDetailProps {
  business: Business;
  onClose: () => void;
  onRecenter: (business: Business) => void;
}

const BusinessDetail: React.FC<BusinessDetailProps> = ({ business, onClose, onRecenter }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-5 h-5 fill-accent-yellow text-accent-yellow" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-5 h-5 text-border" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-5 h-5 fill-accent-yellow text-accent-yellow" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-5 h-5 text-border" />
      );
    }

    return stars;
  };

  const maxTrend = Math.max(...business.reviewTrend);
  const minTrend = Math.min(...business.reviewTrend);

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
      <div className="card max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={business.thumbnail}
            alt={business.name}
            className="w-full h-48 object-cover rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 bg-background hover:bg-muted rounded-lg text-primary transition-colors border border-border"
            aria-label="Close business details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">{business.name}</h2>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {renderStars(business.rating)}
            </div>
            <span className="text-lg font-semibold text-foreground">{business.rating}</span>
            <span className="badge-primary ml-2">
              {business.category}
            </span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-foreground">{business.address}</div>
                <div className="text-sm text-primary font-medium">{business.distance}km from selected location</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">{business.contact}</span>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Rating Trend (Last 6 Months)</h3>
            </div>
            <div className="flex items-end gap-2 h-16">
              {business.reviewTrend.map((rating, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-primary rounded-t"
                    style={{
                      height: `${((rating - minTrend) / (maxTrend - minTrend)) * 100}%`,
                      minHeight: '20px',
                    }}
                  ></div>
                  <div className="text-xs text-muted-foreground mt-1">{rating}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onRecenter(business)}
              className="btn-primary flex-1"
            >
              <MapPin className="w-4 h-4" />
              Show on Map
            </button>
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;