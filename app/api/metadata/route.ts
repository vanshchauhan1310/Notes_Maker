import { NextRequest, NextResponse } from 'next/server'
import { JSDOM } from 'jsdom'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BookmarkManager/1.0)',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Extract title
    const title = 
      document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
      document.querySelector('title')?.textContent ||
      ''

    // Extract description
    const description = 
      document.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      document.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
      document.querySelector('meta[name="description"]')?.getAttribute('content') ||
      ''

    // Extract favicon
    const favicon = 
      document.querySelector('link[rel="icon"]')?.getAttribute('href') ||
      document.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
      ''

    const domain = new URL(url).origin
    const faviconUrl = favicon ? (favicon.startsWith('http') ? favicon : `${domain}${favicon}`) : `${domain}/favicon.ico`

    return NextResponse.json({
      title: title.trim(),
      description: description.trim(),
      favicon: faviconUrl,
    })
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metadata' },
      { status: 500 }
    )
  }
}