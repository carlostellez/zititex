'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { contactData } from '@/data/contactData';

interface GoogleMapProps {
  height?: string;
  className?: string;
  showInfoWindow?: boolean;
}

// Declarar tipos para Google Maps API
declare global {
  interface Window {
    google: any;
    initGoogleMap: () => void;
  }
}

export function GoogleMap({ 
  height = '400px', 
  className = '',
  showInfoWindow = true 
}: GoogleMapProps) {
  const [mounted, setMounted] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Usar tema de forma segura para evitar errores de hidratación
  let theme = 'light';

  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
  } catch {
    // Si no hay contexto disponible, usar tema por defecto
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  // Inicializar Google Maps
  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      const { coordinates } = contactData.location;
      
      // Configuración del mapa
      const mapOptions = {
        center: { lat: coordinates.lat, lng: coordinates.lng },
        zoom: 15,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: theme === 'dark' ? getDarkMapStyles() : [],
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        mapTypeControl: false,
      };

      // Crear mapa
      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      // Crear marcador personalizado
      const marker = new window.google.maps.Marker({
        position: { lat: coordinates.lat, lng: coordinates.lng },
        map: map,
        title: contactData.location.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#2563eb" stroke="white" stroke-width="4"/>
              <path d="M20 10C16.686 10 14 12.686 14 16C14 21 20 30 20 30S26 21 26 16C26 12.686 23.314 10 20 10ZM20 19C18.343 19 17 17.657 17 16C17 14.343 18.343 13 20 13C21.657 13 23 14.343 23 16C23 17.657 21.657 19 20 19Z" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40)
        }
      });

      // Crear ventana de información si está habilitada
      if (showInfoWindow) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 300px; font-family: system-ui, -apple-system, sans-serif;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                ${contactData.location.name}
              </h3>
              <p style="margin: 0 0 8px 0; color: #4b5563; font-size: 14px; line-height: 1.4;">
                ${contactData.location.address}<br>
                ${contactData.location.city}, ${contactData.location.country}
              </p>
              <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 13px; line-height: 1.4;">
                ${contactData.location.description}
              </p>
              <div style="display: flex; gap: 8px;">
                <a href="https://maps.google.com/?q=${coordinates.lat},${coordinates.lng}" 
                   target="_blank" 
                   style="display: inline-block; padding: 6px 12px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 500;">
                  Ver en Google Maps
                </a>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}" 
                   target="_blank" 
                   style="display: inline-block; padding: 6px 12px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 500;">
                  Cómo llegar
                </a>
              </div>
            </div>
          `
        });

        // Mostrar ventana de información al hacer clic en el marcador
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        // Mostrar ventana de información por defecto
        infoWindow.open(map, marker);
      }

      setMapLoaded(true);
    } catch (error) {
      console.error('Error inicializando Google Maps:', error);
      setMapError(true);
    }
  };

  // Estilos para modo oscuro
  const getDarkMapStyles = () => [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }]
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }]
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }]
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2937" }]
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }]
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }]
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }]
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }]
    }
  ];

  // Cargar Google Maps API
  useEffect(() => {
    if (!mounted) return;

    // Verificar si hay API key configurada
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
      console.warn('Google Maps API key no configurada. Mostrando fallback.');
      setMapError(true);
      return;
    }

    // Verificar si Google Maps ya está cargado
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Función global para inicializar el mapa
    window.initGoogleMap = initializeMap;

    // Cargar script de Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMap&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onerror = () => {
      console.error('Error cargando Google Maps API - Verificar API key y configuración');
      setMapError(true);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (window.initGoogleMap) {
        delete window.initGoogleMap;
      }
    };
  }, [mounted, theme]);

  // Actualizar estilos del mapa cuando cambie el tema
  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded) {
      mapInstanceRef.current.setOptions({
        styles: theme === 'dark' ? getDarkMapStyles() : []
      });
    }
  }, [theme, mapLoaded]);

  // Renderizar fallback si hay error
  if (mapError) {
    return (
      <div 
        className={`flex items-center justify-center rounded-lg border-2 border-dashed ${
          mounted && theme === 'light' 
            ? 'bg-gray-50 border-gray-300' 
            : 'bg-gray-800 border-gray-600'
        } ${className}`}
        style={{ height }}
      >
        <div className="text-center p-8">
          <svg className={`w-12 h-12 mx-auto mb-4 ${
            mounted && theme === 'light' ? 'text-gray-400' : 'text-gray-500'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className={`text-lg font-semibold mb-2 ${
            mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Mapa no disponible
          </h3>
          <p className={`text-sm mb-4 ${
            mounted && theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            Para ver el mapa interactivo, configure la API key de Google Maps
          </p>
          <div className={`text-xs mb-4 p-3 rounded-lg ${
            mounted && theme === 'light' ? 'bg-blue-50 text-blue-700' : 'bg-blue-900/30 text-blue-300'
          }`}>
            <p className="font-medium mb-1">Configuración requerida:</p>
            <p>1. Crear archivo .env.local</p>
            <p>2. Agregar: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key</p>
            <p>3. Obtener API key en: console.cloud.google.com</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className={mounted && theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
              <strong>{contactData.location.name}</strong>
            </p>
            <p className={mounted && theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              {contactData.location.address}<br />
              {contactData.location.city}, {contactData.location.country}
            </p>
            <div className="pt-4">
              <a
                href={`https://maps.google.com/?q=${contactData.location.coordinates.lat},${contactData.location.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Ver en Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-lg ${className}`}>
      {/* Loading State */}
      {!mapLoaded && (
        <div 
          className={`absolute inset-0 flex items-center justify-center ${
            mounted && theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
          }`}
          style={{ height }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className={`text-sm ${
              mounted && theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Cargando mapa...
            </p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapRef}
        style={{ height }}
        className="w-full"
      />
    </div>
  );
}
