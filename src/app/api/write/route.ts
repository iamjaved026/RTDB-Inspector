import { NextRequest, NextResponse } from 'next/server';
import { normalizeRTDBUrl, fetchWithTimeout } from '@/lib/firebase-rest';

export async function PUT(req: NextRequest) {
  return handleWrite(req, 'PUT');
}

export async function PATCH(req: NextRequest) {
  return handleWrite(req, 'PATCH');
}

async function handleWrite(req: NextRequest, method: 'PUT' | 'PATCH') {
  try {
    const body = await req.json();
    console.log("Incoming write request:", body);
    
    // User requested the key to be "value"
    const { url, path, value } = body;
    
    if (!url || !path || value === undefined) {
      return NextResponse.json({ error: 'URL, path, and value are required' }, { status: 400 });
    }

    let p = path;
    if (p === '/') {
       p = '/.json';
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
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Write failed due to Firebase security rules (Status ${response.status})` }, { status: response.status });
    }

    const responseData = await response.json();
    return NextResponse.json({ success: true, data: responseData });

  } catch (error: any) {
    console.error("Backend write error:", error);
    return NextResponse.json({ error: 'Write operation failed', details: error.message }, { status: 500 });
  }
}
