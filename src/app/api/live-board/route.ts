import { NextRequest, NextResponse } from 'next/server';
import { trips, trains, operators, stations } from '@/data/mock';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stationFilter = searchParams.get('station');
  const operatorFilter = searchParams.get('operator');
  const statusFilter = searchParams.get('status');
  const typeFilter = searchParams.get('type'); // departure | arrival

  let enrichedTrips = trips.map(trip => {
    const train = trains.find(t => t.id === trip.trainId);
    const operator = train ? operators.find(o => o.id === train.operatorId) : null;
    const origin = stations.find(s => s.id === trip.originId);
    const destination = stations.find(s => s.id === trip.destinationId);
    return { ...trip, train: train ? { ...train, operator } : undefined, origin, destination };
  });

  if (stationFilter) {
    enrichedTrips = enrichedTrips.filter(t =>
      t.originId === stationFilter || t.destinationId === stationFilter ||
      t.stops?.some(s => s.stationId === stationFilter)
    );
  }

  if (operatorFilter) {
    enrichedTrips = enrichedTrips.filter(t => t.train?.operatorId === operatorFilter);
  }

  if (statusFilter) {
    enrichedTrips = enrichedTrips.filter(t => t.currentStatus === statusFilter);
  }

  return NextResponse.json(enrichedTrips);
}
