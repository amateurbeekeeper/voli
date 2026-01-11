//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  transpilePackages: ['@voli/ui'],
  // Disable TypeScript checking during Next.js build
  // Nx handles TypeScript checking separately, and Next.js can't resolve
  // tsconfig.base.json paths correctly in monorepo builds on Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  // Explicitly set output to help Vercel detect App Router structure
  output: undefined, // Use default (not standalone) for Vercel
  // Optimize file watching for monorepo
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Optimize watch options for large monorepos
      config.watchOptions = {
        ignored: [
          '**/node_modules/**',
          '**/.next/**',
          '**/dist/**',
          '**/.nx/**',
          '**/ui/**', // Ignore entire UI library during watch
        ],
        aggregateTimeout: 500,
        poll: false,
      };
      // Disable webpack's performance hints in dev
      config.performance = {
        hints: false,
      };
    }
    return config;
  },
  // Ensure experimental features that might help with detection
  experimental: {
    // Enable server actions if needed (already enabled by default in Next.js 15)
  },
  // Disable Turbopack in dev mode to avoid SST cache errors
  // Use Webpack instead for better stability in monorepo
  turbo: undefined, // Disable Turbopack, use Webpack
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
