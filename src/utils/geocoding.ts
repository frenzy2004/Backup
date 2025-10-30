import { Location } from '../types';

export const geocodeLocation = async (address: string): Promise<Location | null> => {
  if (!window.google?.maps) {
    console.error('Google Maps not loaded');
    return null;
  }

  const geocoder = new google.maps.Geocoder();
  
  try {
    const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
      geocoder.geocode({ address }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === 'OK' && results && results.length > 0) {
          resolve(results);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });

    const location = result[0].geometry.location;
    return {
      lat: location.lat(),
      lng: location.lng(),
      address: result[0].formatted_address,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};