import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Performance optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn'],
        } : false,
    },

    // Image optimization
    images: {
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 60,
    },

    // Experimental features for better performance
    experimental: {
        optimizePackageImports: ['lucide-react', 'date-fns'],
    },

    // SWC minification (faster than Terser)
    swcMinify: true,
};

export default withBundleAnalyzer(nextConfig);
