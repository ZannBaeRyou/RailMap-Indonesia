import { NextResponse } from 'next/server';
import { stations } from '@/data/mock';

export async function GET() {
  return NextResponse.json(stations);
}
