import React from 'react';
import { Star, MapPin, Phone } from 'lucide-react';
import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
  onClick: (business: Business) => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onClick }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-warning text-warning" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-border" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-warning text-warning" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-border" />
      );
    }

    return stars;
  };

  return (
    <div
      className="card-elevated hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer transform hover:scale-[1.01] group"
      onClick={() => onClick(business)}
    >
      <div className="flex p-5 gap-4">
        <div className="relative">
          <img
            src={business.thumbnail}
            alt={business.name}
            className="w-24 h-24 rounded-lg object-cover flex-shrink-0 border border-border group-hover:border-primary/50 transition-all"
          />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black text-xs font-bold border border-border">
            {business.rating.toFixed(1)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground truncate text-base mb-2">{business.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              {renderStars(business.rating)}
            </div>
            <span className="text-xs text-muted-foreground">({business.rating})</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="truncate">{business.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-xs font-medium text-primary">
              {business.distance}km away
            </div>
            <span className="badge-accent text-xs">
              {business.category}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-5 py-3 bg-background/40">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Phone className="w-3.5 h-3.5" />
          <span>{business.contact}</span>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;