import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0A0F1C',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '80px 96px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(to right,rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.03) 1px,transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        {/* Ambient glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)',
          }}
        />
        {/* Bottom-left glow */}
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            position: 'absolute',
            top: 72,
            left: 96,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ color: '#fff', fontSize: 28, fontWeight: 900, lineHeight: 1 }}>A</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            
            {/* FIXED: Satori Text Trap (Converted to Flex) */}
            <div
              style={{
                display: 'flex',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                fontFamily: 'Arial, sans-serif',
              }}
            >
              <div style={{ marginRight: 8 }}>AURA</div>
              <div style={{ color: '#60a5fa', fontWeight: 300 }}>ANALYTICS</div>
            </div>

            <div
              style={{
                color: '#475569',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
              }}
            >
              ISO 9001 · EUROCODE 8 CERTIFIED
            </div>
          </div>
        </div>

        {/* Main headline - FIXED: Removed zIndex */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
          <div
            style={{
              color: '#94a3b8',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Certified Structural Analysis · Aegean Region, Turkey
          </div>
          
          {/* FIXED: Satori Text Trap (Converted to Flex) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              color: '#ffffff',
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-2px',
            }}
          >
            <div style={{ marginRight: 16 }}>Know Your Building.</div>
            <div
              style={{
                color: 'transparent',
                backgroundImage: 'linear-gradient(90deg, #60a5fa, #818cf8, #a78bfa)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                fontStyle: 'italic',
              }}
            >
              Certified.
            </div>
          </div>

          <div
            style={{
              color: '#64748b',
              fontSize: 20,
              fontWeight: 300,
              lineHeight: 1.5,
              maxWidth: 700,
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Independent, lab-verified structural analysis. Eurocode 8 seismic simulation.
            AES-256 encrypted reports delivered in 14 days.
          </div>
        </div>

        {/* Trust badges bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: 72,
            right: 96,
            display: 'flex',
            gap: 12,
          }}
        >
          {['ISO 9001', 'EC8 / EN 1998', 'TBDY 2018', 'TMMOB'].map(badge => (
            <div
              key={badge}
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20,
                color: '#94a3b8',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
              }}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}