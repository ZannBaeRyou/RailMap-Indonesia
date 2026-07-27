'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TripStatusBadge, PositionSourceBadge } from '@/components/ui/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, ArrowRight, LayoutList, LayoutGrid } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LiveBoardPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [operatorFilter, setOperatorFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const { data: trips = [], isLoading, refetch } = useQuery({
    queryKey: ['live-board'],
    queryFn: () => fetch('/api/live-board').then(r => r.json()),
    refetchInterval: 30000,
  });

  const { data: operators = [] } = useQuery({
    queryKey: ['operators'],
    queryFn: () => fetch('/api/operators').then(r => r.json()),
  });

  useEffect(() => {
    setLastRefresh(new Date());
  }, [trips]);

  const filterTrips = (tabFilter?: string) => {
    let filtered = [...trips];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((t: any) =>
        t.train?.name?.toLowerCase().includes(q) ||
        t.train?.number?.toLowerCase().includes(q) ||
        t.origin?.name?.toLowerCase().includes(q) ||
        t.destination?.name?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((t: any) => t.currentStatus === statusFilter);
    }

    if (operatorFilter !== 'ALL') {
      filtered = filtered.filter((t: any) => t.train?.operatorId === operatorFilter);
    }

    return filtered;
  };

  const formatTime = (isoStr?: string) => {
    if (!isoStr) return '-';
    try { return format(new Date(isoStr), 'HH:mm'); } catch { return '-'; }
  };

  const TripRow = ({ trip }: { trip: any }) => (
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell className="font-mono text-sm">{formatTime(trip.scheduledDeparture)}</TableCell>
      <TableCell>
        <Link href={`/trains/${trip.trainId}`} className="font-semibold text-sm hover:text-primary transition-colors">
          {trip.train?.number || '-'}
        </Link>
      </TableCell>
      <TableCell className="text-sm">{trip.train?.name || '-'}</TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {trip.train?.operator?.name || '-'}
        </Badge>
      </TableCell>
      <TableCell className="text-sm">
        <Link href={`/stations/${trip.originId}`} className="hover:text-primary">{trip.origin?.name || '-'}</Link>
      </TableCell>
      <TableCell className="text-sm">
        <Link href={`/stations/${trip.destinationId}`} className="hover:text-primary">{trip.destination?.name || '-'}</Link>
      </TableCell>
      <TableCell className="font-mono text-sm">{formatTime(trip.estimatedDeparture || trip.scheduledDeparture)}</TableCell>
      <TableCell>
        {trip.delayMinutes > 0 ? (
          <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">+{trip.delayMinutes}m</span>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
      <TableCell><TripStatusBadge status={trip.currentStatus} /></TableCell>
      <TableCell><PositionSourceBadge source={trip.positionSource} /></TableCell>
    </TableRow>
  );

  const TripCard = ({ trip }: { trip: any }) => (
    <Card className="border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <Link href={`/trains/${trip.trainId}`} className="font-bold text-sm hover:text-primary">{trip.train?.number}</Link>
            <span className="text-sm text-muted-foreground ml-2">{trip.train?.name}</span>
          </div>
          <TripStatusBadge status={trip.currentStatus} />
        </div>
        <div className="flex items-center gap-2 text-sm mb-2">
          <span>{trip.origin?.name}</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span>{trip.destination?.name}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>Jadwal: {formatTime(trip.scheduledDeparture)}</span>
            {trip.delayMinutes > 0 && (
              <span className="text-orange-600 dark:text-orange-400 font-semibold">+{trip.delayMinutes}m</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px]">{trip.train?.operator?.name}</Badge>
            <PositionSourceBadge source={trip.positionSource} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Board</h1>
          <p className="text-sm text-muted-foreground">Jadwal keberangkatan dan kedatangan kereta</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="h-3 w-3" />
          <span>Diperbarui: {format(lastRefresh, 'HH:mm:ss')}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kereta, stasiun..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="ALL">Semua Status</option>
          <option value="SCHEDULED">Terjadwal</option>
          <option value="BOARDING">Persiapan</option>
          <option value="IN_TRANSIT">Perjalanan</option>
          <option value="ARRIVED">Tiba</option>
          <option value="DELAYED">Terlambat</option>
          <option value="CANCELLED">Batal</option>
        </select>
        <select
          value={operatorFilter}
          onChange={(e) => setOperatorFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="ALL">Semua Operator</option>
          {operators.map((op: any) => (
            <option key={op.id} value={op.id}>{op.name}</option>
          ))}
        </select>
        <div className="flex items-center gap-1 border rounded-md">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-l-md transition-colors ${viewMode === 'table' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            aria-label="Tampilan tabel"
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`p-2 rounded-r-md transition-colors ${viewMode === 'card' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            aria-label="Tampilan kartu"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Semua ({filterTrips().length})</TabsTrigger>
          <TabsTrigger value="departure">Keberangkatan</TabsTrigger>
          <TabsTrigger value="arrival">Kedatangan</TabsTrigger>
        </TabsList>

        {['all', 'departure', 'arrival'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />
                ))}
              </div>
            ) : viewMode === 'table' ? (
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Waktu</TableHead>
                      <TableHead className="w-[80px]">No. KA</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Asal</TableHead>
                      <TableHead>Tujuan</TableHead>
                      <TableHead className="w-[80px]">Estimasi</TableHead>
                      <TableHead className="w-[70px]">Terlambat</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Posisi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterTrips().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                          Tidak ada perjalanan yang sesuai filter.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filterTrips().map((trip: any) => <TripRow key={trip.id} trip={trip} />)
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filterTrips().length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    Tidak ada perjalanan yang sesuai filter.
                  </div>
                ) : (
                  filterTrips().map((trip: any) => <TripCard key={trip.id} trip={trip} />)
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
