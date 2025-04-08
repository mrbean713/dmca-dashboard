import { NextResponse } from 'next/server'
import { scanLeaks } from '@/lib/scraper'

export async function POST(req: Request) {
  const { modelName } = await req.json()
  try {
    const foundLinks = await scanLeaks(modelName)
    return NextResponse.json({ success: true, foundLinks })
  } catch (err) {
    console.error('DMCA Scan Error:', err)
    return NextResponse.json({ success: false, error: 'Scan failed.' })
  }
}
