import dynamic from 'next/dynamic';

const TrackMap = dynamic(() => import('./TrackMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/30">
      <div className="text-center text-muted-foreground">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-sm">Memuat peta...</p>
      </div>
    </div>
  ),
});

export default TrackMap;
