import React, { useEffect, useRef, useState } from 'react';
import { Location, Business } from '../types';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

interface GoogleMapProps {
  location: Location;
  businesses: Business[];
  onBusinessClick: (business: Business) => void;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ location, businesses, onBusinessClick, className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const circlesRef = useRef<any[]>([]);
  const mainMarkerRef = useRef<any | null>(null);
  const { isLoaded, loadError } = useGoogleMaps();
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeMap = () => {
    if (!mapRef.current || !window.google || mapInstanceRef.current) return;

    const map = new (window as any).google.maps.Map(mapRef.current, {
      center: location,
      zoom: 14,
      styles: [
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{ color: '#eeeeee' }],
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#ffffff' }],
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#757575' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#c9c9c9' }],
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#9e9e9e' }],
        },
      ],
    });

    mapInstanceRef.current = map;

    // Add initial main location marker
    mainMarkerRef.current = new (window as any).google.maps.Marker({
      position: location,
      map,
      title: 'Selected Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#3B82F6"/>
            <circle cx="12" cy="9" r="2.5" fill="white"/>
          </svg>
        `),
        scaledSize: new (window as any).google.maps.Size(32, 32),
        anchor: new (window as any).google.maps.Point(16, 32),
      },
    });

    // Add initial radius circles (300m and 1km)
    const radii = [300, 1000];
    const colors = ['#EF4444', '#3B82F6'];
    
    radii.forEach((radius, index) => {
      const circle = new (window as any).google.maps.Circle({
        strokeColor: colors[index],
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: colors[index],
        fillOpacity: 0.1,
        map,
        center: location,
        radius,
      });
      circlesRef.current.push(circle);
    });

    setIsInitialized(true);
  };

  const updateBusinessMarkers = () => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add business markers
    businesses.forEach(business => {
      const marker = new (window as any).google.maps.Marker({
        position: business.position,
        map: mapInstanceRef.current,
        title: business.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EF4444"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
          `),
          scaledSize: new (window as any).google.maps.Size(24, 24),
          anchor: new (window as any).google.maps.Point(12, 24),
        },
      });

      marker.addListener('click', () => onBusinessClick(business));
      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (isLoaded && !loadError) {
      initializeMap();
    }
  }, [isLoaded, loadError]);

  // Update map center when location changes
  useEffect(() => {
    if (mapInstanceRef.current && location && isInitialized) {
      mapInstanceRef.current.setCenter(location);
      mapInstanceRef.current.setZoom(14);
      
      // Clear existing circles and add new ones
      circlesRef.current.forEach(circle => circle.setMap(null));
      circlesRef.current = [];
      
      // Add new radius circles (300m and 1km)
      const radii = [300, 1000];
      const colors = ['#EF4444', '#3B82F6'];
      
      radii.forEach((radius, index) => {
        const circle = new (window as any).google.maps.Circle({
          strokeColor: colors[index],
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: colors[index],
          fillOpacity: 0.1,
          map: mapInstanceRef.current,
          center: location,
          radius,
        });
        circlesRef.current.push(circle);
      });
      
      // Update main marker position
      if (mainMarkerRef.current) {
        mainMarkerRef.current.setPosition(location);
      }
    }
  }, [location, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      updateBusinessMarkers();
    }
  }, [isInitialized, businesses]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      circlesRef.current.forEach(circle => circle.setMap(null));
      if (mainMarkerRef.current) {
        mainMarkerRef.current.setMap(null);
      }
    };
  }, []);

  if (loadError) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="text-destructive text-lg font-semibold mb-2">Map Loading Error</div>
          <div className="text-muted-foreground text-sm">
            {loadError}
            {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
              <div className="mt-2 p-3 bg-warning-light border border-warning/20 rounded text-warning">
                Please set VITE_GOOGLE_MAPS_API_KEY in your environment variables
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-muted-foreground">Loading map...</div>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={`rounded-lg ${className}`} />;
};

export default GoogleMap;