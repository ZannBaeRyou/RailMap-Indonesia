'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import MapWrapper from '@/components/map/MapWrapper';
import TrainDetailPanel from '@/components/map/TrainDetailPanel';
import { Badge } from '@/components/ui/badge';

export default function MapPage() {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const { data: trips = [] } = useQuery({
    queryKey: ['trips'],
    queryFn: () => fetch('/api/trips').then(r => r.json()),
    refetchInterval: 30000,
  });

  const { data: stations = [] } = useQuery({
    queryKey: ['stations'],
    queryFn: () => fetch('/api/stations').then(r => r.json()),
  });

  const tripMarkers = trips.map((t: any) => ({
    id: t.id,
    trainId: t.trainId,
    trainName: t.train?.name,
    trainNumber: t.train?.number,
    operatorName: t.train?.operator?.name,
    currentLat: t.currentLat,
    currentLng: t.currentLng,
    positionSource: t.positionSource,
    currentStatus: t.currentStatus,
    originName: t.origin?.name,
    destinationName: t.destination?.name,
    delayMinutes: t.delayMinutes,
    currentSpeed: t.currentSpeed,
  }));

  const selectedTrip = selectedTripId ? trips.find((t: any) => t.id === selectedTripId) : null;

  const handleSelectTrip = useCallback((id: string | null) => {
    setSelectedTripId(id);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-3.5rem)] relative">
      {/* Map */}
      <div className="flex-1 relative">
        <MapWrapper
          stations={stations}
          trips={tripMarkers}
          selectedTripId={selectedTripId}
          onSelectTrip={handleSelectTrip}
        />

        {/* Legend overlay */}
        <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur border rounded-lg p-3 text-xs space-y-1.5 z-[500] shadow-md">
          <p className="font-semibold text-sm mb-1">Legenda</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 border border-white shadow-sm" />
            <span>Live — Data aktual</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500 border border-white shadow-sm" />
            <span>Estimated — Perhitungan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400 border border-white shadow-sm" />
            <span>Scheduled — Jadwal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm opacity-60" />
            <span>Offline — Tidak aktif</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t">
            <span className="w-3 h-3 rounded-full bg-blue-800 border-2 border-white shadow-sm" style={{ width: 8, height: 8 }} />
            <span>Stasiun</span>
          </div>
        </div>

        {/* Info overlay */}
        <div className="absolute top-4 left-4 z-[500]">
          <Badge variant="outline" className="bg-card/95 backdrop-blur shadow-sm text-xs gap-1.5">
            🚆 {tripMarkers.filter((t: any) => t.currentLat).length} kereta aktif di peta
          </Badge>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedTrip && (
        <TrainDetailPanel
          trip={selectedTrip}
          onClose={() => setSelectedTripId(null)}
        />
      )}
    </div>
  );
}
