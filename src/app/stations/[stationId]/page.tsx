'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TripStatusBadge } from '@/components/ui/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, ArrowRight, Clock, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function StationDetailPage() {
  const params = useParams();
  const stationId = params.stationId as string;

  const { data: stations = [] } = useQuery({
    queryKey: ['stations'],
    queryFn: () => fetch('/api/stations').then(r => r.json()),
  });

  const { data: trips = [] } = useQuery({
    queryKey: ['trips'],
    queryFn: () => fetch('/api/trips').then(r => r.json()),
  });

  const station = stations.find((s: any) => s.id === stationId);
  const stationTrips = trips.filter((t: any) =>
    t.originId === stationId || t.destinationId === stationId ||
    t.stops?.some((s: any) => s.stationId === stationId)
  );

  const formatTime = (isoStr?: string) => {
    if (!isoStr) return '-';
    try { return format(new Date(isoStr), 'HH:mm'); } catch { return '-'; }
  };

  if (!station) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p>Stasiun tidak ditemukan.</p>
        <Link href="/stations" className="text-primary hover:underline text-sm mt-2 inline-block">← Kembali ke daftar stasiun</Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Link href="/stations" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">
        <ArrowLeft className="h-3 w-3" /> Kembali
      </Link>

      {/* Station Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/10">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{station.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="font-mono">{station.code}</Badge>
            <span className="text-sm text-muted-foreground">{station.city}, {station.province}</span>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border">
          <CardHeader className="pb-2"><CardTitle className="text-base">Informasi Stasiun</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Kota</span><span>{station.city}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Provinsi</span><span>{station.province}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tipe</span><Badge className="text-xs">{station.type}</Badge></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Koordinat</span><span className="font-mono text-xs">{station.lat}, {station.lng}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Perjalanan hari ini</span><span className="font-semibold">{stationTrips.length}</span></div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-2"><CardTitle className="text-base">Lokasi</CardTitle></CardHeader>
          <CardContent>
            <div className="h-48 bg-muted/50 rounded-lg flex items-center justify-center border border-dashed">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-6 w-6 mx-auto mb-1 opacity-50" />
                <p className="text-xs">Peta stasiun</p>
                <Link href="/map" className="text-xs text-primary hover:underline">Buka di Track Map →</Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Station Live Board */}
      <Card className="border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Jadwal Keberangkatan & Kedatangan</CardTitle>
        </CardHeader>
        <CardContent>
          {stationTrips.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Tidak ada perjalanan yang melewati stasiun ini saat ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. KA</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Asal</TableHead>
                    <TableHead>Tujuan</TableHead>
                    <TableHead>Jadwal</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stationTrips.map((trip: any) => (
                    <TableRow key={trip.id}>
                      <TableCell className="font-semibold">
                        <Link href={`/trains/${trip.trainId}`} className="hover:text-primary">{trip.train?.number || '-'}</Link>
                      </TableCell>
                      <TableCell>{trip.train?.name || '-'}</TableCell>
                      <TableCell>{trip.origin?.name || '-'}</TableCell>
                      <TableCell>{trip.destination?.name || '-'}</TableCell>
                      <TableCell className="font-mono">{formatTime(trip.scheduledDeparture)}</TableCell>
                      <TableCell><TripStatusBadge status={trip.currentStatus} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
