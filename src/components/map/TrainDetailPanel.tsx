'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TripStatusBadge, PositionSourceBadge } from '@/components/ui/StatusBadge';
import { X, ArrowRight, Gauge, Navigation2, Clock, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface TrainDetailPanelProps {
  trip: any;
  onClose: () => void;
}

export default function TrainDetailPanel({ trip, onClose }: TrainDetailPanelProps) {
  if (!trip) return null;

  const formatTime = (isoStr?: string) => {
    if (!isoStr) return '-';
    try { return format(new Date(isoStr), 'HH:mm'); } catch { return '-'; }
  };

  return (
    <div className="w-full md:w-80 bg-card border-l md:border-l border-t md:border-t-0 shadow-lg overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg">{trip.train?.name || trip.trainId}</h3>
            <p className="text-sm text-muted-foreground">{trip.train?.number}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            aria-label="Tutup panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <TripStatusBadge status={trip.currentStatus} />
          <PositionSourceBadge source={trip.positionSource} />
          {trip.delayMinutes > 0 && (
            <Badge variant="outline" className="text-orange-600 border-orange-300 text-xs">
              +{trip.delayMinutes} menit
            </Badge>
          )}
        </div>

        {/* Route */}
        <Card className="border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex-1">
                <p className="font-semibold">{trip.origin?.name}</p>
                <p className="text-xs text-muted-foreground">{formatTime(trip.scheduledDeparture)}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 text-right">
                <p className="font-semibold">{trip.destination?.name}</p>
                <p className="text-xs text-muted-foreground">{formatTime(trip.scheduledArrival)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <div className="space-y-2 text-sm">
          {trip.train?.operator && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Operator</span>
              <span className="font-medium">{trip.train.operator.name}</span>
            </div>
          )}
          {trip.train?.serviceType && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Layanan</span>
              <span>{trip.train.serviceType}</span>
            </div>
          )}
          {trip.currentSpeed != null && (
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1"><Gauge className="h-3 w-3" /> Kecepatan</span>
              <span className="font-medium">{trip.currentSpeed} km/h</span>
            </div>
          )}
          {trip.heading != null && (
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1"><Navigation2 className="h-3 w-3" /> Arah</span>
              <span>{trip.heading}°</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Diperbarui</span>
            <span className="text-xs">{formatTime(trip.lastUpdated)}</span>
          </div>
        </div>

        {/* Link */}
        <Link
          href={`/trains/${trip.trainId}`}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          <ExternalLink className="h-4 w-4" />
          Lihat Detail Perjalanan
        </Link>

        {/* Disclaimer */}
        {trip.positionSource === 'ESTIMATED' && (
          <p className="text-[11px] text-muted-foreground bg-muted/50 p-2 rounded-md">
            Posisi ini merupakan estimasi berdasarkan jadwal dan rute, bukan data GPS aktual.
          </p>
        )}
      </div>
    </div>
  );
}
