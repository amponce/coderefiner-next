import { NextRequest, NextResponse } from 'next/server'
import { CodeAnalyzer } from '@/lib/analyzer'
import type { AnalyzerConfig } from '@/lib/analyzer/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { paths, framework, exclude, thresholds } = body as AnalyzerConfig

    if (!paths || !Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or missing paths' },
        { status: 400 }
      )
    }

    if (!framework) {
      return NextResponse.json(
        { error: 'Framework type is required' },
        { status: 400 }
      )
    }

    const analyzer = new CodeAnalyzer({
      paths,
      framework,
      exclude,
      thresholds
    })

    const results = await analyzer.analyze()

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error during analysis:', error)
    return NextResponse.json(
      { error: 'Internal server error during analysis' },
      { status: 500 }
    )
  }
} 