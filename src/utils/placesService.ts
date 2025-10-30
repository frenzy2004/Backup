import { Business, Location } from '../types';
import { classifyBusinessesWithAI } from './businessClassifier';

declare global {
  interface Window {
    google: any;
  }
}

export const findNearbyBusinesses = async (
  location: Location, 
  businessType: string
): Promise<Business[]> => {
  if (!window.google?.maps) return [];

  const service = new window.google.maps.places.PlacesService(document.createElement('div'));
  const allBusinesses: Business[] = [];

  try {
    // Get nearby food establishments with multiple searches
    const searchTypes = ['restaurant', 'cafe', 'food', 'meal_takeaway'];
    const allResults: any[] = [];
    
    for (const searchType of searchTypes) {
      const results = await new Promise<any[]>((resolve) => {
        service.nearbySearch({
          location: { lat: location.lat, lng: location.lng },
          radius: 1000,
          type: searchType
        }, (results: any, status: any) => {
          resolve(status === window.google.maps.places.PlacesServiceStatus.OK && results ? results : []);
        });
      });
      allResults.push(...results);
    }
    
    // Remove duplicates based on place_id
    const uniqueResults = allResults.filter((place, index, self) => 
      index === self.findIndex(p => p.place_id === place.place_id)
    );

    uniqueResults.forEach((place, index) => {
      if (place.geometry?.location && place.name) {
        const placeLat = place.geometry.location.lat();
        const placeLng = place.geometry.location.lng();
        
        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
          new window.google.maps.LatLng(location.lat, location.lng),
          new window.google.maps.LatLng(placeLat, placeLng)
        );

        if (distance <= 1000) {
          allBusinesses.push({
            id: `place_${index}_${place.place_id}`,
            name: place.name,
            rating: place.rating || 0,
            address: place.vicinity || 'Address not available',
            distance: Math.round(distance) / 1000,
            category: place.types?.[0]?.replace('_', ' ') || 'Business',
            contact: 'Contact not available',
            thumbnail: place.photos?.[0]?.getUrl({ maxWidth: 400 }) || 
                      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
            position: { lat: placeLat, lng: placeLng, address: '' },
            reviewTrend: Array.from({ length: 6 }, () => (place.rating || 4) + (Math.random() - 0.5) * 0.5)
          });
        }
      }
    });

    // Use AI to filter relevant businesses
    const relevantBusinesses = await classifyBusinessesWithAI(allBusinesses, businessType);
    return relevantBusinesses;
    
  } catch (error) {
    console.error('Error finding nearby businesses:', error);
    return [];
  }
};