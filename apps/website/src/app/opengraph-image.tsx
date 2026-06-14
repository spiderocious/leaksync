import { ImageResponse } from 'next/og';

// The share card shown when a LeakSync link is posted (1200×630). Rendered at
// build time by Next's ImageResponse — paper background, the brand mark, the
// wordmark + tagline, in the e-ink palette.
export const runtime = 'nodejs';
export const alt = 'LeakSync — your phone to your Mac, in one tap';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The "stack" glyph (three bars) drawn inline so there's no asset dependency.
function StackMark({ size: s }: { size: number }) {
  const bar = (w: number, mt: number) => (
    <div
      style={{
        width: w,
        height: s * 0.16,
        marginTop: mt,
        background: '#e8e6e1',
        borderRadius: s * 0.05,
      }}
    />
  );
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: s,
        height: s,
        background: '#23211c',
        borderRadius: s * 0.22,
        border: `${s * 0.04}px solid #7e9466`,
      }}
    >
      {bar(s * 0.46, 0)}
      {bar(s * 0.46, s * 0.1)}
      {bar(s * 0.34, s * 0.1)}
    </div>
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#e8e6e1',
          fontFamily: 'serif',
        }}
      >
        <StackMark size={150} />
        <div
          style={{
            marginTop: 44,
            fontSize: 92,
            fontWeight: 600,
            color: '#23211c',
            letterSpacing: -2,
          }}
        >
          LeakSync
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 34,
            color: '#55524a',
            fontStyle: 'italic',
          }}
        >
          your phone to your Mac, in one tap
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 22,
            color: '#83806f',
            letterSpacing: 4,
          }}
        >
          ONE PHONE · ONE MAC · ZERO ACCOUNTS
        </div>
      </div>
    ),
    { ...size },
  );
}
