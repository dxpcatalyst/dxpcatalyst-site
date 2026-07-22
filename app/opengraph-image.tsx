import { ImageResponse } from 'next/og';

// Default social-share image for every page (Open Graph + Twitter fall back to
// this when a route sets no image of its own). Generated at the edge — brand
// navy with the DXP Catalyst wordmark and positioning line.
export const runtime = 'edge';
export const alt = 'DXP Catalyst — vendor-neutral DXP and MarTech advisory';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#1A1F2E',
          padding: '72px 80px',
        }}
      >
        {/* Eyebrow: accent tile + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 9,
              border: '3px solid #4C7AC4',
              display: 'flex',
            }}
          />
          <div
            style={{
              marginLeft: 22,
              color: '#8FA6C9',
              fontSize: 27,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            DXP Catalyst
          </div>
        </div>

        {/* Headline + supporting line */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: '#ffffff',
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1,
            }}
          >
            Vendor-neutral DXP &amp; MarTech advisory
          </div>
          <div style={{ color: '#C3CEDE', fontSize: 33, marginTop: 28, lineHeight: 1.3 }}>
            Platform selection and architecture for organizations modernizing their digital ecosystem.
          </div>
        </div>

        {/* Footer: accent rule + domain */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 44, height: 4, backgroundColor: '#285197', display: 'flex' }} />
          <div style={{ marginLeft: 18, color: '#8FA6C9', fontSize: 28 }}>dxpcatalyst.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
