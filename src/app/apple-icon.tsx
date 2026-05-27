import { ImageResponse } from 'next/og';

export const size        = { width: 180, height: 180 };
export const contentType = 'image/png';

// Lucide React "Activity" icon — scaled for Apple Touch Icon
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width:          180,
          height:         180,
          borderRadius:   40,
          background:     'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          position:       'relative',
        }}
      >
        {/* Subtle inner highlight */}
        <div
          style={{
            position:   'absolute',
            inset:       0,
            borderRadius: 40,
            background:  'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.18), transparent 60%)',
          }}
        />
        {/* Activity icon */}
        <svg
          width="110"
          height="110"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
