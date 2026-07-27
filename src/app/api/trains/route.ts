import { NextResponse } from 'next/server';
import { trains } from '@/data/mock';

export async function GET() {
  return NextResponse.json(trains);
}
