import React, { useEffect, useRef, useState } from 'react';
import { MapPin, AlertCircle, Navigation } from 'lucide-react';
import { StorePlace } from '../types';

interface StoreMapProps {
    apiKey?: string;
}

export const StoreMap: React.FC<StoreMapProps> = ({ apiKey }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [nearbyStores, setNearbyStores] = useState<StorePlace[]>([]);
    const [loading, setLoading] = useState(false);

    // Mock data for fallback
    const mockStores: StorePlace[] = [
        { name: "Supermarché U", vicinity: "300m • Ouvert", geometry: { location: { lat: 0, lng: 0 } } },
        { name: "Lidl Campus", vicinity: "800m • Ferme à 20h", geometry: { location: { lat: 0, lng: 0 } }, rating: 4.2 },
        { name: "Épicerie Solidaire", vicinity: "1.2km", geometry: { location: { lat: 0, lng: 0 } }, rating: 4.8 },
    ];

    useEffect(() => {
        // Fallback if no API key or script loading fails
        if (!apiKey || !(window as any).google) {
            setNearbyStores(mockStores);
            return;
        }

        const initMap = () => {
            if (!mapRef.current) return;
            
            // Try to get user location
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    const map = new (window as any).google.maps.Map(mapRef.current!, {
                        center,
                        zoom: 14,
                        disableDefaultUI: true,
                        styles: [
                            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
                        ]
                    });

                    // Search functionality would go here with PlacesService
                    // For now, we simulate finding markers nearby
                    setLoading(true);
                    const service = new (window as any).google.maps.places.PlacesService(map);
                    service.nearbySearch({
                        location: center,
                        radius: 1500,
                        type: 'supermarket'
                    }, (results: any[], status: any) => {
                         setLoading(false);
                         if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && results) {
                             const mappedResults = results.map(r => ({
                                 name: r.name || 'Magasin',
                                 vicinity: r.vicinity || '',
                                 rating: r.rating,
                                 geometry: { location: { lat: r.geometry?.location?.lat() || 0, lng: r.geometry?.location?.lng() || 0 } }
                             }));
                             setNearbyStores(mappedResults);
                             
                             // Add markers
                             mappedResults.forEach(store => {
                                 new (window as any).google.maps.Marker({
                                     position: store.geometry.location,
                                     map: map,
                                     title: store.name,
                                     icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png"
                                 });
                             });
                         } else {
                             setNearbyStores(mockStores); // Fallback on search fail
                         }
                    });
                },
                (err) => {
                    setError("Géolocalisation refusée.");
                    setNearbyStores(mockStores);
                }
            );
        };

        if (!(window as any).google) {
             // In a real app, we'd load the script here if not present in index.html
             // But for this output, we assume either index.html has it or we fallback.
             setNearbyStores(mockStores);
        } else {
            initMap();
        }

    }, [apiKey]);

    if (!apiKey) {
        return (
            <div className="space-y-4">
                 <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
                    <div className="mx-auto bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                        <MapPin className="text-orange-500" />
                    </div>
                    <h3 className="font-bold text-orange-900 mb-1">Carte indisponible</h3>
                    <p className="text-xs text-orange-700">La clé API Google Maps n'est pas configurée.</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                     <h4 className="text-sm font-bold text-slate-400 uppercase mb-3">Magasins Simulés</h4>
                     {mockStores.map((store, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                            <div>
                                <p className="font-bold text-slate-800">{store.name}</p>
                                <p className="text-xs text-slate-400">{store.vicinity}</p>
                            </div>
                            <button className="bg-slate-100 p-2 rounded-full text-slate-600">
                                <Navigation size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[60vh] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
            <div ref={mapRef} className="w-full h-full bg-slate-100" />
            
            {loading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-2"></div>
                        <p className="text-xs font-bold text-emerald-800">Recherche...</p>
                    </div>
                </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
                 <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">À proximité ({nearbyStores.length})</h4>
                 {nearbyStores.map((store, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                         <div className="w-2/3">
                            <p className="font-bold text-slate-800 truncate">{store.name}</p>
                            <p className="text-xs text-slate-500 truncate">{store.vicinity}</p>
                        </div>
                        {store.rating && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">
                                ★ {store.rating}
                            </span>
                        )}
                    </div>
                 ))}
            </div>
        </div>
    );
};