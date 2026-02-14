import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'af', 'pt'],
    defaultLocale: 'en',
    localeDetection: false, // We'll handle language selection manually
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oocoishshggetvtloilw.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
