/**
 * Development Server with Asset Optimization
 * Serves optimized assets with proper cache headers and paths
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const config = require('./server-config');

const PORT = process.env.PORT || 8000;
const DIST_DIR = path.join(__dirname, 'dist');

/**
 * Get appropriate cache headers based on file type
 */
function getCacheHeaders(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.js') return config.headers.js;
  if (ext === '.css') return config.headers.css;
  if (ext === '.svg') return config.headers.svg;
  if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
    return config.headers.images;
  }
  if (['.woff', '.woff2', '.ttf', '.eot'].includes(ext)) {
    return config.headers.fonts;
  }
  if (ext === '.html') return config.headers.html;

  return {};
}

/**
 * Get MIME type for file
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return config.mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Serve file with compression if applicable
 */
function serveFile(filePath, req, res) {
  fs.readFile(filePath, (err, buffer) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: File not found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500: Server error');
      }
      return;
    }

    const mimeType = getMimeType(filePath);
    const headers = getCacheHeaders(filePath);
    const acceptEncoding = req.headers['accept-encoding'] || '';

    // Add security headers
    Object.entries(config.securityHeaders).forEach(([key, value]) => {
      headers[key] = value;
    });

    // Compression logic
    if (config.compression.types.includes(mimeType)
        && buffer.length > config.compression.threshold
        && acceptEncoding.includes('gzip')) {
      res.writeHead(200, {
        ...headers,
        'Content-Encoding': 'gzip',
        'Content-Type': mimeType,
      });
      zlib.gzip(buffer, (err, compressed) => {
        if (err) {
          res.end(buffer);
        } else {
          res.end(compressed);
        }
      });
    } else {
      headers['Content-Type'] = mimeType;
      headers['Content-Length'] = buffer.length;
      res.writeHead(200, headers);
      res.end(buffer);
    }
  });
}

/**
 * HTTP Server
 */
const server = http.createServer((req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);

  // Prevent directory traversal attacks
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(path.resolve(DIST_DIR))) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403: Forbidden');
    return;
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err) {
      // Try to serve index.html for directory
      if (req.url.endsWith('/')) {
        filePath = path.join(filePath, 'index.html');
        fs.stat(filePath, (err) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404: File not found');
          } else {
            serveFile(filePath, req, res);
          }
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: File not found');
      }
    } else if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      serveFile(filePath, req, res);
    } else {
      serveFile(filePath, req, res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  Development Server Started            ║
╠════════════════════════════════════════╣
║  🌐 http://localhost:${PORT}             ║
║  📁 Serving from: ${DIST_DIR}  ║
║  ⚙️  Compression: Enabled               ║
║  🔒 Security Headers: Enabled           ║
║  💾 Cache Headers: Optimized            ║
╚════════════════════════════════════════╝
  `);
});

module.exports = server;
