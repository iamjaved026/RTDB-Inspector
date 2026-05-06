import { NextRequest, NextResponse } from 'next/server';
import { normalizeRTDBUrl, generateSafeTestPath, fetchWithTimeout } from '@/lib/firebase-rest';
import { AnalysisResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    let baseUrl = '';
    try {
      baseUrl = normalizeRTDBUrl(url);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    const safeTestPath = generateSafeTestPath();
    const notes: string[] = [];
    
    // Performance measurement helper
    const measureTime = async (fn: () => Promise<Response>) => {
      const start = Date.now();
      const response = await fn();
      const latency = Date.now() - start;
      return { response, latency };
    };

    // 1. Read Test (.json?shallow=true)
    let readAccess = false;
    let readLatency = 0;
    try {
      const { response, latency } = await measureTime(() => 
        fetchWithTimeout(`${baseUrl}/.json?shallow=true`, { method: 'GET' })
      );
      readLatency = latency;
      if (response.ok) {
        readAccess = true;
        notes.push('Read access is allowed at root level.');
      } else if (response.status === 401 || response.status === 403) {
        notes.push('Read access is denied at root level (may still be allowed on specific child paths).');
      } else if (response.status === 404) {
        return NextResponse.json({ error: 'Please check the URL. The database might not exist, could be shut down, or is unreachable (404 Not Found).' }, { status: 400 });
      } else {
        notes.push(`Read test failed with status: ${response.status}`);
      }
    } catch (e: any) {
      if (e.message === 'Request timed out' || e.message.includes('fetch failed') || e.message.includes('ENOTFOUND') || e.message.includes('getaddrinfo')) {
        return NextResponse.json({ error: 'Please check the URL. The database might not exist, could be shut down, or is unreachable.' }, { status: 400 });
      }
      notes.push(`Read request failed or timed out (${e.message}).`);
    }

    // 2. Rules Visibility Test (/.settings/rules.json)
    let rulesVisible = false;
    try {
      const response = await fetchWithTimeout(`${baseUrl}/.settings/rules.json`, { method: 'GET' });
      if (response.ok) {
        rulesVisible = true;
        notes.push('Security rules are publicly visible (this is unusual and risky).');
      }
    } catch (e) {}

    // 3. Write Test
    let writeAccess = false;
    let writeLatency = 0;
    try {
      const { response, latency } = await measureTime(() => 
        fetchWithTimeout(`${baseUrl}${safeTestPath}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "test": true, "timestamp": Date.now() })
        })
      );
      writeLatency = latency;
      if (response.ok) {
        writeAccess = true;
        notes.push('Write access is allowed (verified via safe test path).');
      } else if (response.status === 401 || response.status === 403) {
        notes.push('Write access is denied at the generated test path.');
      }
    } catch (e: any) {
      notes.push(`Write request failed or timed out.`);
    }

    // 4. Delete Test
    let deleteAccess = false;
    let deleteLatency = 0;
    try {
       const { response, latency } = await measureTime(() => 
        fetchWithTimeout(`${baseUrl}${safeTestPath}`, { method: 'DELETE' })
      );
      deleteLatency = latency;
      if (response.ok) {
        deleteAccess = true;
      }
    } catch(e) {}

    // 5. Patch Test
    let patchAccess = false;
    let patchLatency = 0;
    try {
      const testPatchPath = generateSafeTestPath();
      const { response, latency } = await measureTime(() => 
        fetchWithTimeout(`${baseUrl}${testPatchPath}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "patchTest": true })
        })
      );
      patchLatency = latency;
      if (response.ok) {
        patchAccess = true;
        // Clean up patch test
        await fetchWithTimeout(`${baseUrl}${testPatchPath}`, { method: 'DELETE' }).catch(() => {});
      }
    } catch (e: any) {}

    const result: AnalysisResult = {
      read: readAccess,
      write: writeAccess,
      delete: deleteAccess,
      patch: patchAccess,
      rulesVisible,
      latency: {
        read: readLatency,
        write: writeLatency,
        delete: deleteLatency,
        patch: patchLatency
      },
      notes
    };

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
