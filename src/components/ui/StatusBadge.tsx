import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 'SCHEDULED' | 'BOARDING' | 'IN_TRANSIT' | 'ARRIVED' | 'DELAYED' | 'CANCELLED';
type SourceType = 'LIVE' | 'ESTIMATED' | 'SCHEDULED' | 'OFFLINE';

export function TripStatusBadge({ status }: { status: StatusType }) {
  const variants: Record<StatusType, string> = {
    SCHEDULED: 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100',
    BOARDING: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100',
    IN_TRANSIT: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100',
    ARRIVED: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100',
    DELAYED: 'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-100',
    CANCELLED: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100',
  };

  const labels: Record<StatusType, string> = {
    SCHEDULED: 'Terjadwal',
    BOARDING: 'Persiapan',
    IN_TRANSIT: 'Perjalanan',
    ARRIVED: 'Tiba',
    DELAYED: 'Terlambat',
    CANCELLED: 'Batal',
  };

  return (
    <Badge className={cn('font-medium border-0', variants[status])}>
      {labels[status]}
    </Badge>
  );
}

export function PositionSourceBadge({ source }: { source: SourceType }) {
  const variants: Record<SourceType, { class: string; icon: string }> = {
    LIVE: { class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200', icon: '🟢' },
    ESTIMATED: { class: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200', icon: '🟣' },
    SCHEDULED: { class: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200', icon: '⚪' },
    OFFLINE: { class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200', icon: '🔴' },
  };

  return (
    <Badge variant="outline" className={cn('font-medium text-xs gap-1', variants[source].class)}>
      <span className="text-[10px]">{variants[source].icon}</span>
      {source}
    </Badge>
  );
}
