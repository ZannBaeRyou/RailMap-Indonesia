'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Station {
  id: string; code: string; name: string; lat: number; lng: number; type: string;
}

interface TripMarker {
  id: string; trainId: string; trainName?: string; trainNumber?: string; operatorName?: string;
  currentLat?: number; currentLng?: number; positionSource: string; currentStatus: string;
  originName?: string; destinationName?: string; delayMinutes: number; currentSpeed?: number;
}

interface TrackMapProps {
  stations: Station[];
  trips: TripMarker[];
  selectedTripId: string | null;
  onSelectTrip: (id: string | null) => void;
}

export default function TrackMap({ stations, trips, selectedTripId, onSelectTrip }: TrackMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const stationMarkersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [-7.0, 110.0],
      zoom: 7,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    stationMarkersRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update station markers
  useEffect(() => {
    if (!stationMarkersRef.current) return;
    stationMarkersRef.current.clearLayers();

    stations.forEach((station) => {
      const marker = L.circleMarker([station.lat, station.lng], {
        radius: 5,
        fillColor: '#1e40af',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      });

      marker.bindTooltip(`<strong>${station.name}</strong><br/><span style="font-size:11px">${station.code}</span>`, {
        direction: 'top',
        offset: [0, -8],
      });

      stationMarkersRef.current!.addLayer(marker);
    });
  }, [stations]);

  // Update train markers
  useEffect(() => {
    if (!markersRef.current) return;
    markersRef.current.clearLayers();

    trips.forEach((trip) => {
      if (!trip.currentLat || !trip.currentLng) return;

      const sourceColors: Record<string, string> = {
        LIVE: '#22c55e',
        ESTIMATED: '#a855f7',
        SCHEDULED: '#94a3b8',
        OFFLINE: '#ef4444',
      };

      const color = sourceColors[trip.positionSource] || '#94a3b8';
      const isSelected = trip.id === selectedTripId;

      const icon = L.divIcon({
        html: `<div class="train-marker train-marker--${trip.positionSource.toLowerCase()}" style="width:${isSelected ? 32 : 24}px;height:${isSelected ? 32 : 24}px;${isSelected ? 'box-shadow:0 0 0 4px rgba(59,130,246,0.4);' : ''}">🚆</div>`,
        className: '',
        iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
        iconAnchor: [isSelected ? 16 : 12, isSelected ? 16 : 12],
      });

      const marker = L.marker([trip.currentLat, trip.currentLng], { icon });

      marker.bindTooltip(
        `<div style="font-size:12px;">
          <strong>${trip.trainNumber || ''} ${trip.trainName || ''}</strong><br/>
          <span>${trip.originName || ''} → ${trip.destinationName || ''}</span><br/>
          <span style="color:${color};font-weight:600;">${trip.positionSource}</span>
          ${trip.delayMinutes > 0 ? `<span style="color:#ea580c;margin-left:6px;">+${trip.delayMinutes}m</span>` : ''}
          ${trip.currentSpeed ? `<br/><span>${trip.currentSpeed} km/h</span>` : ''}
        </div>`,
        { direction: 'top', offset: [0, -16] }
      );

      marker.on('click', () => onSelectTrip(trip.id));
      markersRef.current!.addLayer(marker);
    });
  }, [trips, selectedTripId, onSelectTrip]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
  );
}
