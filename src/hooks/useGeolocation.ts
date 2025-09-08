import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  city: string | null;
  detectedLocation: 'south-surrey' | 'surrey' | 'langley' | 'white-rock' | 'delta' | 'other' | null;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
    city: null,
    detectedLocation: null,
  });

  const defaultOptions: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000, // 5 minutes
    ...options,
  };

  useEffect(() => {
    // Simplified location detection - just set South Surrey as default
    const detectLocationByIP = async () => {
      try {
        // Check if we're in development or if Supabase is properly configured
        const isLocalDev = window.location.hostname === 'localhost' || 
                          window.location.hostname.includes('webcontainer') ||
                          window.location.hostname.includes('local-credentialless');
        
        if (isLocalDev || 
            !import.meta.env.VITE_SUPABASE_URL || 
            import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
          console.log('Using fallback location detection (development mode or Supabase not configured)');
          setState(prev => ({
            ...prev,
            loading: false,
            city: 'Surrey',
            detectedLocation: 'surrey'
          }));
          return true;
        }

        // Try to call the edge function, but with better error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ip-geolocation`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Edge function not available`);
        }

        const text = await response.text();
        const data = JSON.parse(text);
        
        if (data.city || data.detectedLocation) {
          setState({
            latitude: data.coordinates?.lat || null,
            longitude: data.coordinates?.lon || null,
            error: null,
            loading: false,
            city: data.city,
            detectedLocation: data.detectedLocation,
          });
          return true;
        }
      } catch (error) {
        console.log('IP geolocation not available, using fallback location:', error instanceof Error ? error.message : 'Unknown error');
      }
      
      return false;
    };

    // Start with IP geolocation, but always fallback to South Surrey
    detectLocationByIP().then((success) => {
      if (!success) {
        setState(prev => ({
          ...prev,
          loading: false,
          city: 'South Surrey',
          detectedLocation: 'south-surrey'
        }));
      }
    });
  }, []);

  const requestPreciseLocation = () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
        city: 'Surrey',
        detectedLocation: 'surrey'
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const handleSuccess = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      
      try {
        // Check if we're in development or if Supabase is properly configured
        const isLocalDev = window.location.hostname === 'localhost' || 
                          window.location.hostname.includes('webcontainer') ||
                          window.location.hostname.includes('local-credentialless');
        
        if (isLocalDev || 
            !import.meta.env.VITE_SUPABASE_URL || 
            import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
          console.log('Using fallback geocoding (development mode or Supabase not configured)');
          setState({
            latitude,
            longitude,
            error: null,
            loading: false,
            city: 'Surrey',
            detectedLocation: 'surrey',
          });
          return;
        }

        // Use our Supabase Edge Function to reverse geocode with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-maps-proxy/geocode`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              address: `${latitude},${longitude}`
            }),
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        const data = await response.json();
        
        if (data.result) {
          const addressComponents = data.result.address_components;
          let city = null;
          let detectedLocation: 'south-surrey' | 'langley' | 'white-rock' | 'other' = 'other';

          // Extract city from address components
          for (const component of addressComponents) {
            if (component.types.includes('locality') || component.types.includes('sublocality')) {
              city = component.long_name;
              break;
            }
          }

          // Determine service area based on city/area
          const locationName = city?.toLowerCase() || '';
          const fullAddress = data.result.formatted_address.toLowerCase();

          // Prioritize more specific locations first
          if (fullAddress.includes('south surrey') || locationName.includes('south surrey')) {
            detectedLocation = 'south-surrey';
            city = 'South Surrey';
          } else if (locationName.includes('surrey')) {
            detectedLocation = 'surrey';
            city = 'Surrey';
          } else if (locationName.includes('delta')) {
            detectedLocation = 'delta';
            city = 'Delta';
          } else if (locationName.includes('langley')) {
            detectedLocation = 'langley';
            city = 'Langley';
          } else if (locationName.includes('white rock')) {
            detectedLocation = 'white-rock';
            city = 'White Rock';
          }

          setState({
            latitude,
            longitude,
            error: null,
            loading: false,
            city,
            detectedLocation,
          });
        } else {
          throw new Error('Unable to determine location');
        }
      } catch (geocodeError) {
        console.log('Geocoding not available, using fallback location:', geocodeError instanceof Error ? geocodeError.message : 'Unknown error');
        // Fallback to South Surrey if geocoding fails
        setState(prev => ({
          ...prev,
          latitude,
          longitude,
          error: null,
          loading: false,
          city: 'Surrey',
          detectedLocation: 'surrey',
        }));
      }
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = 'Unable to retrieve precise location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied by user';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
      }

      // Always fallback to South Surrey when geolocation fails
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
        city: 'Surrey',
        detectedLocation: 'surrey',
      }));
    };

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      defaultOptions
    );
  };

  return {
    ...state,
    requestPreciseLocation, // Renamed from requestLocation to be more specific
  };
};