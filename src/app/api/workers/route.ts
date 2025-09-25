import { NextResponse } from 'next/server'
import workersData from '../../../../workers.json'
import { getServices } from '@/lib/workers'
import { WorkerType } from '@/types/workers'

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    // Add fallback images to workers
    const workersWithFallbacks = workersData.map((worker: WorkerType & { fallbackImage?: string }) => ({
      ...worker,
      fallbackImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        worker.name
      )}&size=400&background=3B82F6&color=fff&format=jpg`
    }));

    const services = getServices();

    return NextResponse.json({
      workers: workersWithFallbacks,
      services,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch workers data'
    }, { status: 500 })
  }
}
