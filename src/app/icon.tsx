import { ImageResponse } from 'next/og';

export const size        = { width: 32, height: 32 };
export const contentType = 'image/png';

// Lucide React "Activity" icon — polyline SVG path
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width:          32,
          height:         32,
          borderRadius:   8,
          background:     'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          boxShadow:      '0 2px 8px rgba(124,58,237,0.45)',
        }}
      >
        {/* Activity icon — identical to Lucide React's Activity */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
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
