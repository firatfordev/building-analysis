import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)',
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(37,99,235,0.35)',
        }}
      >
        <div
          style={{
            color: '#ffffff',
            fontSize: 20,
            fontWeight: 900,
            fontFamily: 'Georgia, serif',
            lineHeight: 1,
            letterSpacing: '-1px',
          }}
        >
          A
        </div>
      </div>
    ),
    { ...size },
  );
}
