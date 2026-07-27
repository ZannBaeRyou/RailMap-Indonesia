'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TripStatusBadge, PositionSourceBadge } from '@/components/ui/StatusBadge';
import { Train, ArrowRight, ArrowLeft, Clock, Gauge, Navigation2, MapPin, CheckCircle, Circle, AlertCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function TrainDetailPage() {
  const params = useParams();
  const trainId = params.trainId as string;

  const { data: trains = [] } = useQuery({
    queryKey: ['trains'],
    queryFn: () => fetch('/api/trains').then(r => r.json()),
  });

  const { data: trips = [] } = useQuery({
    queryKey: ['trips'],
    queryFn: () => fetch('/api/trips').then(r => r.json()),
  });

  const { data: operators = [] } = useQuery({
    queryKey: ['operators'],
    queryFn: () => fetch('/api/operators').then(r => r.json()),
  });

  const { data: stations = [] } = useQuery({
    queryKey: ['stations'],
    queryFn: () => fetch('/api/stations').then(r => r.json()),
  });

  const train = trains.find((t: any) => t.id === trainId);
  const trainTrips = trips.filter((t: any) => t.trainId === trainId);
  const activeTrip = trainTrips.find((t: any) => ['IN_TRANSIT', 'BOARDING', 'DELAYED', 'SCHEDULED'].includes(t.currentStatus)) || trainTrips[0];
  const operator = train ? operators.find((o: any) => o.id === train.operatorId) : null;

  const formatTime = (isoStr?: string) => {
    if (!isoStr) return '-';
    try { return format(new Date(isoStr), 'HH:mm'); } catch { return '-'; }
  };

  const getStationName = (stationId: string) => {
    return stations.find((s: any) => s.id === stationId)?.name || stationId;
  };

  const getStationCode = (stationId: string) => {
    return stations.find((s: any) => s.id === stationId)?.code || '';
  };

  if (!train) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p>Kereta tidak ditemukan.</p>
        <Link href="/trains" className="text-primary hover:underline text-sm mt-2 inline-block">← Kembali ke daftar kereta</Link>
      </div>
    );
  }

  const getStopIcon = (status: string) => {
    switch (status) {
      case 'ARRIVED': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'BOARDING': return <Circle className="h-4 w-4 text-blue-500 fill-blue-500" />;
      case 'IN_TRANSIT': return <Circle className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'DELAYED': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Link href="/trains" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">
        <ArrowLeft className="h-3 w-3" /> Kembali
      </Link>

      {/* Train Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Train className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{train.name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="outline" className="font-mono">{train.number}</Badge>
            {operator && <Badge variant="outline" className="text-xs">{operator.name}</Badge>}
            <span className="text-sm text-muted-foreground">{train.serviceType}</span>
            {train.class && <span className="text-sm text-muted-foreground">• {train.class}</span>}
          </div>
        </div>
        {activeTrip && (
          <div className="flex items-center gap-2">
            <TripStatusBadge status={activeTrip.currentStatus} />
            <PositionSourceBadge source={activeTrip.positionSource} />
          </div>
        )}
      </div>

      {activeTrip ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Trip Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Route summary */}
            <Card className="border">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 text-center">
                    <p className="font-bold text-lg">{getStationName(activeTrip.originId)}</p>
                    <p className="text-xs text-muted-foreground font-mono">{getStationCode(activeTrip.originId)}</p>
                    <p className="text-sm font-mono mt-1">{formatTime(activeTrip.scheduledDeparture)}</p>
                    {activeTrip.actualDeparture && (
                      <p className="text-xs text-green-600 dark:text-green-400">Aktual: {formatTime(activeTrip.actualDeparture)}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    {activeTrip.delayMinutes > 0 && (
                      <Badge variant="outline" className="text-orange-600 border-orange-300 text-[10px]">
                        +{activeTrip.delayMinutes}m
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 text-center">
                    <p className="font-bold text-lg">{getStationName(activeTrip.destinationId)}</p>
                    <p className="text-xs text-muted-foreground font-mono">{getStationCode(activeTrip.destinationId)}</p>
                    <p className="text-sm font-mono mt-1">{formatTime(activeTrip.scheduledArrival)}</p>
                    {activeTrip.estimatedArrival && activeTrip.estimatedArrival !== activeTrip.scheduledArrival && (
                      <p className="text-xs text-purple-600 dark:text-purple-400">Est: {formatTime(activeTrip.estimatedArrival)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Journey Timeline */}
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Timeline Perjalanan</CardTitle>
              </CardHeader>
              <CardContent>
                {activeTrip.stops && activeTrip.stops.length > 0 ? (
                  <div className="space-y-0">
                    {activeTrip.stops.map((stop: any, index: number) => {
                      const isFirst = index === 0;
                      const isLast = index === activeTrip.stops.length - 1;
                      const isPassed = stop.status === 'ARRIVED';
                      const isCurrent = stop.status === 'BOARDING' || stop.status === 'IN_TRANSIT';

                      return (
                        <div key={stop.id} className="flex gap-3 relative">
                          {/* Vertical line + node */}
                          <div className="flex flex-col items-center">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ${
                              isPassed ? 'bg-green-100 dark:bg-green-900/30' :
                              isCurrent ? 'bg-blue-100 dark:bg-blue-900/30' :
                              stop.status === 'CANCELLED' ? 'bg-red-100 dark:bg-red-900/30' :
                              'bg-muted'
                            }`}>
                              {getStopIcon(stop.status)}
                            </div>
                            {!isLast && (
                              <div className={`w-0.5 flex-1 min-h-[3rem] ${
                                isPassed ? 'bg-green-300 dark:bg-green-700' : 'bg-border'
                              }`} />
                            )}
                          </div>

                          {/* Stop details */}
                          <div className={`flex-1 pb-5 ${isLast ? 'pb-0' : ''}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <Link href={`/stations/${stop.stationId}`} className="font-semibold text-sm hover:text-primary">
                                  {getStationName(stop.stationId)}
                                </Link>
                                <span className="text-xs text-muted-foreground ml-1.5 font-mono">{getStationCode(stop.stationId)}</span>
                                {stop.platform && (
                                  <Badge variant="outline" className="text-[10px] ml-2">Peron {stop.platform}</Badge>
                                )}
                              </div>
                              <TripStatusBadge status={stop.status} />
                            </div>
                            <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                              {!isFirst && (
                                <span>
                                  Tiba: <span className="font-mono">{formatTime(stop.actualArrival || stop.estimatedArrival || stop.scheduledArrival)}</span>
                                  {stop.scheduledArrival && (stop.actualArrival || stop.estimatedArrival) && (
                                    <span className="ml-1 opacity-60">(Jadwal: {formatTime(stop.scheduledArrival)})</span>
                                  )}
                                </span>
                              )}
                              {!isLast && (
                                <span>
                                  Berangkat: <span className="font-mono">{formatTime(stop.actualDeparture || stop.estimatedDeparture || stop.scheduledDeparture)}</span>
                                </span>
                              )}
                              {stop.delayMinutes > 0 && (
                                <span className="text-orange-600 dark:text-orange-400 font-semibold">+{stop.delayMinutes}m</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Data pemberhentian tidak tersedia.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            {/* Position Info */}
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Informasi Posisi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <TripStatusBadge status={activeTrip.currentStatus} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sumber Posisi</span>
                  <PositionSourceBadge source={activeTrip.positionSource} />
                </div>
                {activeTrip.currentSpeed != null && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1"><Gauge className="h-3.5 w-3.5" /> Kecepatan</span>
                    <span className="font-semibold">{activeTrip.currentSpeed} km/h</span>
                  </div>
                )}
                {activeTrip.heading != null && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1"><Navigation2 className="h-3.5 w-3.5" /> Arah</span>
                    <span>{activeTrip.heading}°</span>
                  </div>
                )}
                {activeTrip.currentLat != null && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Koordinat</span>
                    <span className="font-mono text-xs">{activeTrip.currentLat?.toFixed(4)}, {activeTrip.currentLng?.toFixed(4)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Diperbarui</span>
                  <span className="text-xs">{formatTime(activeTrip.lastUpdated)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Delay Info */}
            {activeTrip.delayMinutes > 0 && (
              <Card className="border border-orange-200 dark:border-orange-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold text-sm text-orange-700 dark:text-orange-400">Keterlambatan</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">+{activeTrip.delayMinutes} menit</p>
                  <p className="text-xs text-muted-foreground mt-1">dari jadwal semula</p>
                </CardContent>
              </Card>
            )}

            {/* Map link */}
            <Card className="border">
              <CardContent className="p-4">
                <Link href="/map" className="flex items-center justify-center gap-2 w-full py-2 px-3 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
                  <MapPin className="h-4 w-4" />
                  Lihat di Peta
                </Link>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            {activeTrip.positionSource === 'ESTIMATED' && (
              <div className="text-[11px] text-muted-foreground bg-muted/50 p-3 rounded-lg border border-dashed">
                <p className="font-medium mb-1">⚠️ Posisi Estimasi</p>
                <p>Posisi kereta ini merupakan perkiraan berdasarkan jadwal, waktu, dan rute perjalanan, bukan data GPS aktual.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Card className="border">
          <CardContent className="p-8 text-center text-muted-foreground">
            <Train className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Tidak ada perjalanan aktif</p>
            <p className="text-sm mt-1">Kereta ini tidak memiliki perjalanan yang sedang berlangsung saat ini.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
