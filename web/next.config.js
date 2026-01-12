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
    // Resolve path aliases
    const path = require('path');
    const webpack = require('webpack');
    const webSrcPath = path.resolve(__dirname, 'src');
    const uiSrcPath = path.resolve(__dirname, '../ui/src');
    
    // Override the resolve to handle @/ imports based on context
    // This needs to run before SWC processes the files
    const originalResolve = config.resolve || {};
    const originalAlias = originalResolve.alias || {};
    
    // Don't set a global @ alias - let the plugin handle it contextually
    config.resolve = {
      ...originalResolve,
      alias: {
        ...originalAlias,
        // Remove any existing @ alias
      },
    };
    
    // Use NormalModuleReplacementPlugin to intercept @/ imports
    // This runs during webpack's module resolution phase
    config.plugins = config.plugins || [];
    
    // Add plugin early in the chain
    const replacementPlugin = new webpack.NormalModuleReplacementPlugin(
      /^@\/(.*)$/,
      (resource) => {
        const requestPath = resource.request.replace('@/', '');
        const contextPath = resource.context || '';
        const issuerPath = resource.context || '';
        
        // Normalize paths for comparison
        const normalizedContext = path.normalize(contextPath).replace(/\\/g, '/');
        const normalizedIssuer = path.normalize(issuerPath).replace(/\\/g, '/');
        
        // Check multiple patterns to detect UI library files
        const uiPatterns = [
          '/ui/src/',
          '/ui\\src\\',
          '@voli/ui',
          'node_modules/@voli/ui',
          path.join('ui', 'src'),
        ];
        
        const isFromUiLibrary = uiPatterns.some(pattern => 
          normalizedContext.includes(pattern) || normalizedIssuer.includes(pattern)
        );
        
        if (isFromUiLibrary) {
          const resolved = path.resolve(uiSrcPath, requestPath);
          resource.request = resolved;
          if (dev) {
            console.log(`[Webpack] Resolved UI @/ import: ${resource.request}`);
          }
        } else {
          const resolved = path.resolve(webSrcPath, requestPath);
          resource.request = resolved;
        }
      }
    );
    
    // Insert at the beginning to run before other plugins
    config.plugins.unshift(replacementPlugin);

    // Add both web src and UI src to module resolution paths
    if (!config.resolve.modules) {
      config.resolve.modules = ['node_modules'];
    }
    if (Array.isArray(config.resolve.modules)) {
      config.resolve.modules.push(webSrcPath);
      config.resolve.modules.push(uiSrcPath);
    }

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
