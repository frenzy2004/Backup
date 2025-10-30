import { Business, Location } from '../types';

// Generate random businesses around a location
export const generateBusinessesAroundLocation = (centerLocation: Location, businessType: string): Business[] => {
  const businesses: Business[] = [];
  const businessCount = 5 + Math.floor(Math.random() * 3); // 5-7 businesses
  
  // Business categories based on the selected business type
  const getRelevantCategories = (type: string): string[] => {
    const categoryMap: Record<string, string[]> = {
      'Restaurant': ['Fine Dining', 'Casual Dining', 'Fast Food', 'Food Court', 'Street Food'],
      'Cafe': ['Coffee Shop', 'Bakery Cafe', 'Tea House', 'Specialty Coffee', 'Chain Cafe'],
      'Retail Store': ['Fashion Store', 'Electronics Store', 'Department Store', 'Specialty Shop', 'Boutique'],
      'Office Space': ['Business Center', 'Coworking Space', 'Corporate Office', 'Serviced Office', 'Shared Office'],
      'Gym/Fitness': ['Fitness Center', 'Yoga Studio', 'Boxing Gym', 'Pilates Studio', 'Sports Club'],
      'Beauty Salon': ['Hair Salon', 'Nail Salon', 'Spa', 'Beauty Center', 'Barbershop'],
      'Medical Clinic': ['General Clinic', 'Dental Clinic', 'Specialist Clinic', 'Medical Center', 'Pharmacy'],
      'Educational Center': ['Language School', 'Tuition Center', 'Training Institute', 'Learning Center', 'Academy'],
      'Entertainment Venue': ['Cinema', 'Karaoke', 'Gaming Center', 'Bar', 'Club'],
      'Service Business': ['Bank', 'Insurance Office', 'Travel Agency', 'Real Estate', 'Consulting Firm']
    };
    
    return categoryMap[type] || ['General Business', 'Service Provider', 'Retail Outlet', 'Commercial Space', 'Local Business'];
  };

  const categories = getRelevantCategories(businessType);
  
  // Generate business names based on category
  const generateBusinessName = (category: string, index: number): string => {
    const nameTemplates: Record<string, string[]> = {
      'Fine Dining': ['Elite Restaurant', 'Premium Bistro', 'Luxury Dining', 'Gourmet House', 'Signature Restaurant'],
      'Casual Dining': ['Family Restaurant', 'Corner Cafe', 'Local Eatery', 'Neighborhood Diner', 'Comfort Food'],
      'Fast Food': ['Quick Bites', 'Express Food', 'Fast Lane', 'Speed Eats', 'Rapid Restaurant'],
      'Coffee Shop': ['Bean & Brew', 'Coffee Corner', 'Roast House', 'Cafe Central', 'Morning Cup'],
      'Fashion Store': ['Style Hub', 'Fashion Forward', 'Trendy Boutique', 'Chic Collection', 'Modern Wardrobe'],
      'Electronics Store': ['Tech Zone', 'Digital World', 'Gadget Hub', 'Electronics Plus', 'Tech Central'],
      'Fitness Center': ['Power Gym', 'Fit Zone', 'Active Life', 'Strength Studio', 'Wellness Center'],
      'Hair Salon': ['Style Studio', 'Hair Artistry', 'Beauty Lounge', 'Glamour Salon', 'Chic Cuts']
    };
    
    const templates = nameTemplates[category] || ['Local Business', 'City Center', 'Plaza Shop', 'Main Street', 'Downtown'];
    const baseName = templates[index % templates.length];
    return `${baseName} ${String.fromCharCode(65 + index)}`; // Add A, B, C suffix
  };

  for (let i = 0; i < businessCount; i++) {
    const category = categories[i % categories.length];
    
    // Generate position within 2km radius of center location
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 0.02; // ~2km in degrees
    
    const lat = centerLocation.lat + (distance * Math.cos(angle));
    const lng = centerLocation.lng + (distance * Math.sin(angle));
    
    // Calculate actual distance in km
    const actualDistance = Math.sqrt(
      Math.pow((lat - centerLocation.lat) * 111, 2) + 
      Math.pow((lng - centerLocation.lng) * 111 * Math.cos(centerLocation.lat * Math.PI / 180), 2)
    );

    const business: Business = {
      id: `generated_${i}`,
      name: generateBusinessName(category, i),
      rating: 3.5 + Math.random() * 1.5, // 3.5 to 5.0
      address: `${Math.floor(Math.random() * 999) + 1} Street ${i + 1}, Local Area`,
      distance: Math.round(actualDistance * 10) / 10, // Round to 1 decimal
      category,
      contact: `+60 ${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000}`,
      thumbnail: `https://images.pexels.com/photos/${[262978, 1267320, 941861, 1640777, 1579739][i % 5]}/pexels-photo-${[262978, 1267320, 941861, 1640777, 1579739][i % 5]}.jpeg?auto=compress&cs=tinysrgb&w=400`,
      position: { lat, lng, address: '' },
      reviewTrend: Array.from({ length: 6 }, () => 3.5 + Math.random() * 1.5)
    };
    
    businesses.push(business);
  }
  
  return businesses.sort((a, b) => a.distance - b.distance); // Sort by distance
};