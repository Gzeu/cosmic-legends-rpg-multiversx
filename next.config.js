/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: [
      '@multiversx/sdk-core',
      '@multiversx/sdk-dapp',
      '@google/generative-ai',
      '@huggingface/inference'
    ]
  },
  
  // Enable WebAssembly for client-side AI processing
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true
    }
    
    // Add WASM support for MultiversX and AI processing
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource'
    })
    
    // Optimize for blockchain and AI libraries
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer')
      }
    }
    
    return config
  },
  
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Image optimization for NFT assets
  images: {
    domains: [
      'ipfs.io',
      'gateway.pinata.cloud',
      'arweave.net',
      'cloudflare-ipfs.com',
      'multiversx.com'
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 // 24 hours cache for NFT images
  },
  
  // Headers for security and CORS
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://cosmic-legends-rpg.vercel.app' 
              : '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          }
        ]
      }
    ]
  },
  
  // Redirects for SEO and user experience
  async redirects() {
    return [
      {
        source: '/game',
        destination: '/dashboard',
        permanent: false
      }
    ]
  },
  
  // PWA and performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Output configuration for deployment
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // Bundle analyzer for optimization
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
          })
        )
      }
      return config
    }
  })
}

module.exports = nextConfig