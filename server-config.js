/**
 * Server Configuration for Asset Management
 * Handles proper serving of optimized assets with correct paths and headers
 */

module.exports = {
  // Asset paths configuration
  assetPaths: {
    css: '/css/',
    js: '/js/',
    images: '/assets/images/',
    fonts: '/assets/fonts/',
  },

  // MIME types for proper asset delivery
  mimeTypes: {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.html': 'text/html',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
  },

  // HTTP headers for optimal asset delivery
  headers: {
    // CSS and JS - Cache for 1 year with versioning
    css: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'text/css',
      'Vary': 'Accept-Encoding',
    },
    js: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'text/javascript',
      'Vary': 'Accept-Encoding',
    },
    // Images - Cache for 1 year
    images: {
      'Cache-Control': 'public, max-age=31536000',
      'Vary': 'Accept-Encoding',
    },
    // SVG - Cache for 1 month
    svg: {
      'Cache-Control': 'public, max-age=2592000',
      'Content-Type': 'image/svg+xml',
      'Content-Encoding': 'gzip',
      'Vary': 'Accept-Encoding',
    },
    // Fonts - Cache for 1 year
    fonts: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Vary': 'Accept-Encoding',
    },
    // HTML - No cache, always revalidate
    html: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Content-Type': 'text/html; charset=utf-8',
      'Vary': 'Accept-Encoding',
    },
  },

  // Compression settings
  compression: {
    level: 9, // gzip compression level
    threshold: 1024, // Only compress assets larger than 1KB
    types: [
      'text/html',
      'text/css',
      'text/javascript',
      'application/json',
      'image/svg+xml',
      'font/woff',
      'font/woff2',
    ],
  },

  // CORS configuration
  cors: {
    origins: ['https://naseemakhtar.dev', 'http://localhost:3000'],
    methods: ['GET', 'HEAD'],
    headers: ['Content-Type', 'Accept-Encoding'],
  },

  // Security headers
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  },

  // Environment-specific settings
  production: {
    assetUrl: 'https://cdn.example.com/assets/',
    enableCompression: true,
    enableCaching: true,
    enableMinification: true,
  },

  development: {
    assetUrl: 'http://localhost:8000/dist/',
    enableCompression: false,
    enableCaching: false,
    enableMinification: false,
    sourceMap: true,
  },
};
