import { NextRequest, NextResponse } from 'next/server';
import { normalizeRTDBUrl, fetchWithTimeout } from '@/lib/firebase-rest';

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Incoming delete request:", body);
    const { url, path } = body;
    
    if (!url || !path) {
      return NextResponse.json({ error: 'URL and path are required' }, { status: 400 });
    }

    let p = path;
    if (p === '/') {
      return NextResponse.json({ error: 'Cannot delete the root path via this tool' }, { status: 400 });
    } else {
       if (!p.startsWith('/')) p = '/' + p;
       if (!p.endsWith('.json')) p = p + '.json';
    }

    let baseUrl = '';
    try {
      baseUrl = normalizeRTDBUrl(url);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    const fetchUrl = `${baseUrl}${p}`;

    const response = await fetchWithTimeout(fetchUrl, {
      method: 'DELETE'
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Delete operation not permitted (Status ${response.status})` }, { status: response.status });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Backend delete error:", error);
    return NextResponse.json({ error: 'Delete operation failed', details: error.message }, { status: 500 });
  }
}
