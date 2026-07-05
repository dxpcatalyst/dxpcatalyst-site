import { NextResponse, type NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';

export const runtime = 'nodejs';

// Sanity publish webhook (spec §3). On content publish this:
//   1. verifies the request signature against SANITY_WEBHOOK_SECRET,
//   2. purges the relevant Next.js cache tag (ISR),
//   3. notifies ai12z to re-sync its Sanity connector.
//
// Configure the webhook in Sanity to POST here with a projection that includes
// `_type`, e.g. { "_type": _type, "slug": slug.current }.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ message: 'Webhook secret not configured' }, { status: 500 });
  }

  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  const body = await req.text();

  const valid = signature ? await isValidSignature(body, signature, secret) : false;
  if (!valid) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  let payload: { _type?: string } = {};
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ message: 'Malformed payload' }, { status: 400 });
  }

  const type = payload._type;
  if (type) {
    // Purge the tag for the changed document type; pages using sanityFetch with
    // this tag will regenerate on next request.
    revalidateTag(type);
  }

  // Notify ai12z to re-sync (fire-and-forget; failures don't block revalidation).
  await notifyAi12z(type).catch(() => {});

  return NextResponse.json({ revalidated: true, type: type ?? null });
}

async function notifyAi12z(type?: string) {
  const url = process.env.AI12Z_SYNC_WEBHOOK_URL;
  if (!url) return; // Optional — configure when the ai12z connector supports push re-sync.
  await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ source: 'sanity', type: type ?? null }),
  });
}
