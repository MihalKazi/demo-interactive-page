'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface MapBlockProps {
  title: string;
  center: [number, number];
  zoom: number;
  points: { id: number; lat: number; lng: number; label: string }[];
}

export const MapBlock = ({ title, center, zoom, points }: MapBlockProps) => {
  useEffect(() => {
    // We run this inside useEffect so it ONLY executes in the browser
    if (typeof window !== 'undefined') {
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
    }
  }, []);

  return (
    <div className="my-12 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm z-0 relative">
      <h3 className="text-xl font-bold text-gray-950 mb-6 text-center">{title}</h3>
      <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-100 z-10 relative">
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((point) => (
            <Marker key={point.id} position={[point.lat, point.lng]}>
              <Popup>{point.label}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};