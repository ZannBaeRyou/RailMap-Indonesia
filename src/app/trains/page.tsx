'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TripStatusBadge, PositionSourceBadge } from '@/components/ui/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Train, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function TrainsPage() {
  const [search, setSearch] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');

  const { data: trains = [], isLoading } = useQuery({
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

  const serviceTypes = ([...new Set(trains.map((t: any) => t.serviceType))] as string[]).sort();

  const filtered = trains.filter((t: any) => {
    const matchSearch = !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.number.toLowerCase().includes(search.toLowerCase());
    const matchOperator = operatorFilter === 'ALL' || t.operatorId === operatorFilter;
    const matchService = serviceFilter === 'ALL' || t.serviceType === serviceFilter;
    return matchSearch && matchOperator && matchService;
  });

  const getActiveTrip = (trainId: string) => {
    return trips.find((t: any) => t.trainId === trainId && ['IN_TRANSIT', 'BOARDING', 'DELAYED'].includes(t.currentStatus));
  };

  const getOperatorName = (operatorId: string) => {
    return operators.find((o: any) => o.id === operatorId)?.name || operatorId;
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kereta</h1>
        <p className="text-sm text-muted-foreground">Daftar kereta api di Indonesia</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari nama atau nomor kereta..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={operatorFilter}
          onChange={(e) => setOperatorFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="ALL">Semua Operator</option>
          {operators.map((op: any) => <option key={op.id} value={op.id}>{op.name}</option>)}
        </select>
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="ALL">Semua Layanan</option>
          {serviceTypes.map((st: string) => <option key={st} value={st}>{st}</option>)}
        </select>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} kereta ditemukan</p>

      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-muted animate-pulse rounded-md" />)}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. KA</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Layanan</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Status Aktif</TableHead>
                  <TableHead>Posisi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((train: any) => {
                  const activeTrip = getActiveTrip(train.id);
                  return (
                    <TableRow key={train.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <Link href={`/trains/${train.id}`} className="font-semibold text-sm hover:text-primary">{train.number}</Link>
                      </TableCell>
                      <TableCell className="text-sm">
                        <Link href={`/trains/${train.id}`} className="hover:text-primary">{train.name}</Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{getOperatorName(train.operatorId)}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{train.serviceType}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{train.class || '-'}</TableCell>
                      <TableCell>
                        {activeTrip ? <TripStatusBadge status={activeTrip.currentStatus} /> : <span className="text-xs text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        {activeTrip ? <PositionSourceBadge source={activeTrip.positionSource} /> : <span className="text-xs text-muted-foreground">—</span>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {filtered.map((train: any) => {
              const activeTrip = getActiveTrip(train.id);
              return (
                <Link key={train.id} href={`/trains/${train.id}`}>
                  <Card className="border shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-1.5">
                        <div>
                          <span className="font-bold text-sm">{train.number}</span>
                          <span className="text-sm text-muted-foreground ml-2">{train.name}</span>
                        </div>
                        {activeTrip && <TripStatusBadge status={activeTrip.currentStatus} />}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px]">{getOperatorName(train.operatorId)}</Badge>
                        <span className="text-xs text-muted-foreground">{train.serviceType}</span>
                        {train.class && <span className="text-xs text-muted-foreground">• {train.class}</span>}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
