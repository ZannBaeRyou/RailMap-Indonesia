import { NextRequest, NextResponse } from 'next/server';
import { trains, stations, operators, disruptions } from '@/data/mock';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();

  if (!q) {
    return NextResponse.json({ trains: [], stations: [], operators: [], disruptions: [] });
  }

  const matchedTrains = trains.filter(t =>
    t.name.toLowerCase().includes(q) || t.number.toLowerCase().includes(q)
  );

  const matchedStations = stations.filter(s =>
    s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
  );

  const matchedOperators = operators.filter(o =>
    o.name.toLowerCase().includes(q)
  );

  const matchedDisruptions = disruptions.filter(d =>
    d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
  );

  return NextResponse.json({
    trains: matchedTrains,
    stations: matchedStations,
    operators: matchedOperators,
    disruptions: matchedDisruptions,
  });
}
