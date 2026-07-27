'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TripStatusBadge, PositionSourceBadge } from '@/components/ui/StatusBadge';
import { Train, Clock, AlertTriangle, CheckCircle, MapPin, Activity, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: trips = [] } = useQuery({
    queryKey: ['trips'],
    queryFn: () => fetch('/api/trips').then(r => r.json()),
    refetchInterval: 30000,
  });

  const { data: disruptions = [] } = useQuery({
    queryKey: ['disruptions'],
    queryFn: () => fetch('/api/disruptions').then(r => r.json()),
    refetchInterval: 30000,
  });

  const totalTrips = trips.length;
  const inTransit = trips.filter((t: any) => t.currentStatus === 'IN_TRANSIT').length;
  const onTime = trips.filter((t: any) => t.delayMinutes === 0 && t.currentStatus !== 'CANCELLED').length;
  const delayed = trips.filter((t: any) => t.currentStatus === 'DELAYED' || t.delayMinutes > 0).length;
  const arrived = trips.filter((t: any) => t.currentStatus === 'ARRIVED').length;
  const activeDisruptions = disruptions.filter((d: any) => d.status === 'ACTIVE').length;

  const summaryCards = [
    { title: 'Total Perjalanan', value: totalTrips, icon: Train, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
    { title: 'Sedang Berjalan', value: inTransit, icon: Activity, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/40' },
    { title: 'Tepat Waktu', value: onTime, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { title: 'Terlambat', value: delayed, icon: Clock, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/40' },
    { title: 'Tiba', value: arrived, icon: MapPin, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800/40' },
    { title: 'Gangguan Aktif', value: activeDisruptions, icon: AlertTriangle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">RailMap Indonesia</h1>
          <p className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE, dd MMMM yyyy", { locale: localeId })}
          </p>
        </div>
        <Badge variant="outline" className="w-fit text-xs gap-1.5 border-amber-300 text-amber-700 dark:text-amber-400 dark:border-amber-700">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
          Data Simulasi
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-md ${card.bg}`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-0.5">{card.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Map placeholder + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Peta Jaringan</span>
              <Link href="/map" className="text-sm text-primary font-medium hover:underline">
                Buka Peta Penuh →
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-80 bg-muted/50 rounded-lg flex items-center justify-center border border-dashed">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">Peta Interaktif</p>
                <Link href="/map" className="text-xs text-primary hover:underline">
                  Buka Track Map →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick navigation */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Navigasi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: 'Live Board', desc: 'Jadwal keberangkatan & kedatangan', href: '/live', icon: '📋' },
              { label: 'Track Map', desc: 'Peta pelacakan kereta', href: '/map', icon: '🗺️' },
              { label: 'Stasiun', desc: 'Daftar stasiun di Pulau Jawa', href: '/stations', icon: '🏛️' },
              { label: 'Kereta', desc: 'Daftar kereta dan perjalanan', href: '/trains', icon: '🚄' },
              { label: 'Operator', desc: 'Operator kereta api', href: '/operators', icon: '🏢' },
              { label: 'Gangguan', desc: 'Info gangguan operasional', href: '/disruptions', icon: '⚠️' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors group"
              >
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{item.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Departures & Disruptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Trips */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Perjalanan Terkini</span>
              <Link href="/live" className="text-sm text-primary font-medium hover:underline">Lihat Semua →</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trips.slice(0, 6).map((trip: any) => (
                <div key={trip.id} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{trip.train?.number || trip.trainId}</span>
                      <span className="text-sm text-muted-foreground truncate">{trip.train?.name || '-'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <span>{trip.origin?.name || trip.originId}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>{trip.destination?.name || trip.destinationId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {trip.delayMinutes > 0 && (
                      <span className="text-xs font-medium text-orange-600 dark:text-orange-400">+{trip.delayMinutes}m</span>
                    )}
                    <TripStatusBadge status={trip.currentStatus} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Disruptions */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Gangguan Aktif</span>
              <Link href="/disruptions" className="text-sm text-primary font-medium hover:underline">Lihat Semua →</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {disruptions.filter((d: any) => d.status === 'ACTIVE').slice(0, 5).map((d: any) => {
                const severityColors: Record<string, string> = {
                  CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400',
                  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-400',
                  MEDIUM: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400',
                  LOW: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400',
                  INFO: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400',
                };
                return (
                  <div key={d.id} className="p-2.5 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${d.severity === 'CRITICAL' || d.severity === 'HIGH' ? 'text-red-500' : 'text-amber-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">{d.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{d.location}</p>
                      </div>
                      <Badge className={`text-[10px] shrink-0 border-0 ${severityColors[d.severity] || ''}`}>
                        {d.severity}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-muted-foreground py-4 border-t">
        <p>Posisi kereta yang ditandai <Badge variant="outline" className="text-[10px] mx-0.5">Estimated</Badge> merupakan perkiraan berdasarkan jadwal, waktu, dan rute perjalanan, bukan data GPS aktual.</p>
        <p className="mt-1">Data yang ditampilkan adalah data simulasi untuk keperluan pengembangan.</p>
      </div>
    </div>
  );
}
