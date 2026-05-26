import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)',
          borderRadius: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Subtle inner glow ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 36,
            background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.15), transparent 60%)',
          }}
        />
        {/* Letter mark */}
        <div
          style={{
            color: '#ffffff',
            fontSize: 110,
            fontWeight: 900,
            fontFamily: 'Georgia, serif',
            lineHeight: 1,
            letterSpacing: '-4px',
            marginTop: 6,
          }}
        >
          A
        </div>
      </div>
    ),
    { ...size },
  );
}
