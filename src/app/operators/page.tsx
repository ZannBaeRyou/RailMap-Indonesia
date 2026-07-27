'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Train, MapPin, Activity } from 'lucide-react';
import Link from 'next/link';

export default function OperatorsPage() {
  const { data: operators = [], isLoading } = useQuery({
    queryKey: ['operators'],
    queryFn: () => fetch('/api/operators').then(r => r.json()),
  });

  const { data: trains = [] } = useQuery({
    queryKey: ['trains'],
    queryFn: () => fetch('/api/trains').then(r => r.json()),
  });

  const { data: trips = [] } = useQuery({
    queryKey: ['trips'],
    queryFn: () => fetch('/api/trips').then(r => r.json()),
  });

  const { data: stations = [] } = useQuery({
    queryKey: ['stations'],
    queryFn: () => fetch('/api/stations').then(r => r.json()),
  });

  const getOperatorStats = (operatorId: string) => {
    const opTrains = trains.filter((t: any) => t.operatorId === operatorId);
    const opTrips = trips.filter((t: any) => opTrains.some((tr: any) => tr.id === t.trainId));
    const activeTrips = opTrips.filter((t: any) => ['IN_TRANSIT', 'BOARDING', 'DELAYED'].includes(t.currentStatus));
    const delayedTrips = opTrips.filter((t: any) => t.currentStatus === 'DELAYED' || t.delayMinutes > 0);

    // Count unique stations served by this operator's trips
    const stationIds = new Set<string>();
    opTrips.forEach((t: any) => {
      stationIds.add(t.originId);
      stationIds.add(t.destinationId);
      t.stops?.forEach((s: any) => stationIds.add(s.stationId));
    });

    return {
      trainCount: opTrains.length,
      tripCount: opTrips.length,
      activeCount: activeTrips.length,
      delayedCount: delayedTrips.length,
      stationCount: stationIds.size,
    };
  };

  const serviceColors: Record<string, string> = {
    'Intercity': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'Commuter Line': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'MRT': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'LRT': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    'High Speed': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    'Airport Train': 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
    'Cargo': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Operator</h1>
        <p className="text-sm text-muted-foreground">Operator kereta api di Indonesia</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {operators.map((op: any) => {
            const stats = getOperatorStats(op.id);
            return (
              <Card key={op.id} className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{op.name}</CardTitle>
                        <Badge className={`text-[10px] mt-1 border-0 ${serviceColors[op.serviceType] || 'bg-gray-100 text-gray-800'}`}>
                          {op.serviceType}
                        </Badge>
                      </div>
                    </div>
                    {stats.activeCount > 0 && (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <Activity className="h-3 w-3" />
                        <span className="text-xs font-medium">{stats.activeCount} aktif</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="text-center p-2 rounded-md bg-muted/50">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                        <Train className="h-3 w-3" />
                        <span className="text-[10px]">Kereta</span>
                      </div>
                      <p className="text-lg font-bold">{stats.trainCount}</p>
                    </div>
                    <div className="text-center p-2 rounded-md bg-muted/50">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                        <Activity className="h-3 w-3" />
                        <span className="text-[10px]">Perjalanan</span>
                      </div>
                      <p className="text-lg font-bold">{stats.tripCount}</p>
                    </div>
                    <div className="text-center p-2 rounded-md bg-muted/50">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                        <MapPin className="h-3 w-3" />
                        <span className="text-[10px]">Stasiun</span>
                      </div>
                      <p className="text-lg font-bold">{stats.stationCount}</p>
                    </div>
                    <div className="text-center p-2 rounded-md bg-muted/50">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                        <span className="text-[10px]">⏱️ Terlambat</span>
                      </div>
                      <p className={`text-lg font-bold ${stats.delayedCount > 0 ? 'text-orange-600 dark:text-orange-400' : ''}`}>{stats.delayedCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
