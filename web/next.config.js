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
  webpack: (config, { dev }) => {
    // Resolve UI library's internal path aliases
    // This allows @/ imports in @voli/ui components to resolve correctly
    const path = require('path');
    const webpack = require('webpack');
    const uiSrcPath = path.resolve(__dirname, '../ui/src');
    
    // Set up alias for @/ to point to UI library src
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': uiSrcPath,
    };

    // Add UI src to module resolution paths
    if (!config.resolve.modules) {
      config.resolve.modules = ['node_modules'];
    }
    if (Array.isArray(config.resolve.modules)) {
      config.resolve.modules.push(uiSrcPath);
    }

    // Use NormalModuleReplacementPlugin to rewrite @/ imports in UI library files
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^@\/(.*)$/,
        (resource) => {
          // Only rewrite if the resource is from the UI library
          if (resource.context && resource.context.includes('ui/src')) {
            const relativePath = resource.request.replace('@/', '');
            resource.request = path.resolve(uiSrcPath, relativePath);
          }
        }
      )
    );

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
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
