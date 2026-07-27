'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, MapPin, Info } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useState } from 'react';

export default function DisruptionsPage() {
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data: disruptions = [], isLoading } = useQuery({
    queryKey: ['disruptions'],
    queryFn: () => fetch('/api/disruptions').then(r => r.json()),
  });

  const filtered = disruptions.filter((d: any) => {
    const matchSeverity = severityFilter === 'ALL' || d.severity === severityFilter;
    const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchSeverity && matchStatus;
  });

  // Sort: ACTIVE first, then by severity
  const severityOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, INFO: 4 };
  const sorted = [...filtered].sort((a: any, b: any) => {
    if (a.status !== b.status) return a.status === 'ACTIVE' ? -1 : 1;
    return (severityOrder[a.severity] ?? 5) - (severityOrder[b.severity] ?? 5);
  });

  const severityConfig: Record<string, { color: string; bgColor: string; icon: React.ReactNode }> = {
    CRITICAL: {
      color: 'text-red-700 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-950/50 border-red-200 dark:border-red-800',
      icon: <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />,
    },
    HIGH: {
      color: 'text-orange-700 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
      icon: <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
    },
    MEDIUM: {
      color: 'text-amber-700 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
    },
    LOW: {
      color: 'text-yellow-700 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
      icon: <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
    },
    INFO: {
      color: 'text-blue-700 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
      icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    },
  };

  const typeLabels: Record<string, string> = {
    SIGNAL: 'Persinyalan',
    TRACK: 'Jalur/Rel',
    WEATHER: 'Cuaca',
    TRAIN: 'Rangkaian',
    OTHER: 'Lainnya',
  };

  const formatTime = (isoStr?: string) => {
    if (!isoStr) return '-';
    try { return format(new Date(isoStr), 'HH:mm, dd MMM', { locale: localeId }); } catch { return '-'; }
  };

  const formatRelative = (isoStr?: string) => {
    if (!isoStr) return '';
    try { return formatDistanceToNow(new Date(isoStr), { addSuffix: true, locale: localeId }); } catch { return ''; }
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gangguan</h1>
        <p className="text-sm text-muted-foreground">Informasi gangguan dan perubahan operasional</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="ALL">Semua Tingkat</option>
          <option value="CRITICAL">Kritis</option>
          <option value="HIGH">Tinggi</option>
          <option value="MEDIUM">Sedang</option>
          <option value="LOW">Rendah</option>
          <option value="INFO">Informasi</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="ALL">Semua Status</option>
          <option value="ACTIVE">Aktif</option>
          <option value="RESOLVED">Selesai</option>
        </select>
      </div>

      <p className="text-sm text-muted-foreground">{sorted.length} gangguan ditemukan</p>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : sorted.length === 0 ? (
        <Card className="border">
          <CardContent className="p-8 text-center text-muted-foreground">
            <CheckCircle className="h-10 w-10 mx-auto mb-3 text-green-500 opacity-60" />
            <p className="font-medium">Tidak ada gangguan</p>
            <p className="text-sm mt-1">Semua layanan beroperasi normal.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map((d: any) => {
            const config = severityConfig[d.severity] || severityConfig.INFO;
            const isResolved = d.status === 'RESOLVED';

            return (
              <Card key={d.id} className={`border ${isResolved ? 'opacity-60' : ''} ${config.bgColor}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isResolved ? <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" /> : config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`font-semibold text-sm ${config.color}`}>{d.title}</h3>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Badge variant={isResolved ? 'outline' : 'default'} className={`text-[10px] ${
                            isResolved ? 'border-green-300 text-green-700 dark:text-green-400' : ''
                          }`}>
                            {isResolved ? '✓ Selesai' : d.severity}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {typeLabels[d.type] || d.type}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-foreground/80 mb-2">{d.description}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        {d.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {d.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Mulai: {formatTime(d.startTime)}
                        </span>
                        {d.endTime && (
                          <span>Est. selesai: {formatTime(d.endTime)}</span>
                        )}
                        <span className="text-xs opacity-70">{formatRelative(d.startTime)}</span>
                      </div>
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
