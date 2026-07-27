import { NextResponse } from 'next/server';
import { disruptions } from '@/data/mock';

export async function GET() {
  return NextResponse.json(disruptions);
}
