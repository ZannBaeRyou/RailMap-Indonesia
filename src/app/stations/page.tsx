'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function StationsPage() {
  const [search, setSearch] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('ALL');

  const { data: stations = [], isLoading } = useQuery({
    queryKey: ['stations'],
    queryFn: () => fetch('/api/stations').then(r => r.json()),
  });

  const provinces = ([...new Set(stations.map((s: any) => s.province))] as string[]).sort();

  const filtered = stations.filter((s: any) => {
    const matchSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase());
    const matchProvince = provinceFilter === 'ALL' || s.province === provinceFilter;
    return matchSearch && matchProvince;
  });

  const typeColors: Record<string, string> = {
    MAIN: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    COMMUTER: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    MRT: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    HIGH_SPEED: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    LRT: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Stasiun</h1>
        <p className="text-sm text-muted-foreground">Daftar stasiun kereta api di Pulau Jawa</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari stasiun, kode, kota..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={provinceFilter}
          onChange={(e) => setProvinceFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="ALL">Semua Provinsi</option>
          {provinces.map((p: string) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} stasiun ditemukan</p>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((station: any) => (
            <Link key={station.id} href={`/stations/${station.id}`}>
              <Card className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer group h-full">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{station.name}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono">{station.code}</Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>{station.city}, {station.province}</p>
                  </div>
                  <div className="mt-3">
                    <Badge className={`text-[10px] border-0 ${typeColors[station.type] || 'bg-gray-100 text-gray-800'}`}>
                      {station.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
