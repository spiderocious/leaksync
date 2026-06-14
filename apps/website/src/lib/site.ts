// Single source of truth for site-wide SEO/metadata values.
export const SITE = {
  name: 'LeakSync',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leaksync.app').replace(/\/$/, ''),
  title: 'LeakSync — your phone to your Mac, in one tap',
  description:
    'Send a tweet, a photo or a link from any Android app to your Mac menu bar within a second. Pair once with a 6-digit code. No accounts, no cloud sign-ups.',
  // Short tagline reused across OG/Twitter and structured data.
  tagline: 'One phone · One Mac · Zero accounts',
  keywords: [
    'LeakSync',
    'share Android to Mac',
    'phone to Mac',
    'Android share to Mac',
    'send links to Mac',
    'share sheet to Mac',
    'menu bar app',
    'clipboard sync',
    'cross-device sharing',
    'no account file sharing',
  ],
  locale: 'en_US',
} as const;
