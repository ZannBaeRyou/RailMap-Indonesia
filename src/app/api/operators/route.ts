import { NextResponse } from 'next/server';
import { operators } from '@/data/mock';

export async function GET() {
  return NextResponse.json(operators);
}
