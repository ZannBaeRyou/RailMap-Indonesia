import { NextResponse } from 'next/server';
import { trips, trains, operators, stations } from '@/data/mock';

export async function GET() {
  const enrichedTrips = trips.map(trip => {
    const train = trains.find(t => t.id === trip.trainId);
    const operator = train ? operators.find(o => o.id === train.operatorId) : null;
    const origin = stations.find(s => s.id === trip.originId);
    const destination = stations.find(s => s.id === trip.destinationId);

    // Enrich stops with station names
    const enrichedStops = trip.stops?.map(stop => {
      const station = stations.find(s => s.id === stop.stationId);
      return { ...stop, station };
    });

    return {
      ...trip,
      train: train ? { ...train, operator } : undefined,
      origin,
      destination,
      stops: enrichedStops,
    };
  });

  return NextResponse.json(enrichedTrips);
}
