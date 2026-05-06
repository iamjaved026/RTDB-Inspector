import { NextRequest, NextResponse } from 'next/server';
import { normalizeRTDBUrl, fetchWithTimeout } from '@/lib/firebase-rest';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    let path = searchParams.get('path') || '/';
    const shallow = searchParams.get('shallow') === 'true';

    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    
    // Ensure path has leading slash, but handle root '/' properly
    if (path === '/') {
       path = '/.json';
    } else {
       if (!path.startsWith('/')) path = '/' + path;
       if (!path.endsWith('.json')) path = path + '.json';
    }

    let baseUrl = '';
    try {
      baseUrl = normalizeRTDBUrl(url);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    const fetchUrl = new URL(`${baseUrl}${path}`);
    if (shallow) fetchUrl.searchParams.append('shallow', 'true');

    const response = await fetchWithTimeout(fetchUrl.toString(), { method: 'GET' });
    
    if (!response.ok) {
        return NextResponse.json({ error: `Firebase responded with status ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ data });

  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch data', details: error.message }, { status: 500 });
  }
}
