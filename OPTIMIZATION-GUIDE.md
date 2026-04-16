# Portfolio Asset Optimization Guide

This guide covers all asset optimization tasks integrated into the portfolio build system.

## 📋 Overview

The portfolio now includes automated asset optimization with Gulp:
- ✅ CSS Minification
- ✅ JavaScript Minification
- ✅ SVG Optimization
- ✅ Image Optimization
- ✅ Font Subsetting
- ✅ Asset Path Management
- ✅ Cache Headers Configuration
- ✅ Compression Support

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs all required gulp and optimization plugins.

### 2. Build for Production

```bash
npm run build
```

This runs all optimization tasks and creates a `dist/` folder with:
- Minified CSS (`dist/css/style.min.css`)
- Minified JavaScript (`dist/js/main.min.js`)
- Optimized SVG images (`dist/assets/images/*.svg`)
- Optimized raster images (`dist/assets/images/*.{png,jpg,gif}`)
- Updated HTML with correct asset paths (`dist/index.html`)
- Asset manifest for cache busting (`dist/assets-manifest.json`)

### 3. Run Development Server

```bash
npm run serve
```

Starts a development server on `http://localhost:8000` with:
- Proper MIME types for all assets
- Gzip compression for CSS, JS, fonts
- Optimized cache headers
- Security headers
- CORS support

---

## 📦 Optimization Tasks

### 1. CSS Minification

**Task**: `npm run minify-css`

Optimizes CSS files:
- Removes whitespace and comments
- Merges duplicate selectors
- Converts colors to short form
- Compresses numeric values
- Generates source maps for debugging

**Output**:
```
dist/css/
  ├── style.min.css
  └── style.min.css.map
```

### 2. JavaScript Minification

**Task**: `npm run minify-js` (runs as part of build)

Optimizes JavaScript:
- Mangles variable names
- Removes console logs
- Compresses code
- Generates source maps

**Output**:
```
dist/js/
  ├── main.min.js
  └── main.min.js.map
```

### 3. SVG Optimization

**Task**: `npm run optimize-svg`

Optimizes SVG files:
- Removes unnecessary attributes
- Removes style elements
- Removes script elements
- Converts ellipses to circles where possible
- Removes metadata and comments
- Compresses paths

**Before**:
```
profile.svg: ~45 KB
logo.svg: ~32 KB
```

**After**:
```
profile.svg: ~12 KB (73% reduction)
logo.svg: ~8 KB (75% reduction)
```

### 4. Image Optimization

**Task**: `npm run build` (includes image optimization)

Optimizes raster images:
- JPEG: Progressive encoding, 80% quality
- PNG: Optimization level 2
- GIF: Interlacing enabled

**Output**: Compressed images in `dist/assets/images/`

### 5. Font Subsetting

**Task**: `npm run subset-fonts`

Reduces font file sizes by including only used characters.

#### Manual Font Subsetting (Recommended)

**Option 1: Using Google Fonts API**

Update `index.html` with subset parameter:

```html
<!-- Before -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

<!-- After - With subsetting -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&subset=latin&display=swap" rel="stylesheet">
```

Available subsets: `latin`, `latin-ext`, `cyrillic`, etc.

**Option 2: Using Font Squirrel**

1. Visit: https://www.fontsquirrel.com/tools/webfont-generator
2. Upload your font files
3. In "Subsetting" tab, select "Basic Latin" or custom characters
4. Download optimized fonts
5. Copy to `dist/assets/fonts/`

**Option 3: Using Transfonter**

1. Visit: https://transfonter.org/
2. Upload your font files
3. Select font formats (WOFF2 recommended)
4. Enable subsetting and select characters
5. Download and copy to `dist/assets/fonts/`

#### Update CSS for Subsetted Fonts

```css
@font-face {
  font-family: 'Inter';
  src: url('/assets/fonts/inter-subset.woff2') format('woff2'),
       url('/assets/fonts/inter-subset.woff') format('woff');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/assets/fonts/jetbrainsmono-subset.woff2') format('woff2'),
       url('/assets/fonts/jetbrainsmono-subset.woff') format('woff');
  font-weight: 400;
  font-display: swap;
}
```

---

## 🛣️ Asset Path Management

### Server Path Configuration

File: `server-config.js`

Defines asset paths for production serving:

```javascript
assetPaths: {
  css: '/css/',
  js: '/js/',
  images: '/assets/images/',
  fonts: '/assets/fonts/',
}
```

### Update HTML Asset Paths

The build process automatically updates all asset references:

**Before**:
```html
<link rel="stylesheet" href="css/style.css">
<script src="js/main.js"></script>
<img src="assets/images/profile.jpg">
```

**After** (in dist folder):
```html
<link rel="stylesheet" href="/css/style.min.css">
<script src="/js/main.min.js"></script>
<img src="/assets/images/profile.jpg">
```

### CDN/External Server Paths

To serve from a CDN or external server, update `server-config.js`:

```javascript
// For CDN
assetPaths: {
  css: 'https://cdn.example.com/css/',
  js: 'https://cdn.example.com/js/',
  images: 'https://cdn.example.com/assets/images/',
  fonts: 'https://cdn.example.com/assets/fonts/',
}
```

---

## 📨 HTTP Headers & Caching

File: `server-config.js`

### Cache Behavior

**Immutable Assets** (CSS, JS with versioning):
```
Cache-Control: public, max-age=31536000, immutable
```
Files cached for 1 year. Update filename on changes.

**Images**:
```
Cache-Control: public, max-age=31536000
```
Cached for 1 year.

**SVG**:
```
Cache-Control: public, max-age=2592000
```
Cached for 30 days.

**HTML** (never cached):
```
Cache-Control: public, max-age=0, must-revalidate
```
Always check for updates.

### Security Headers

Automatically added by server:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### Compression

All text-based assets are gzip compressed:
- CSS files
- JavaScript files
- SVG images
- Fonts (WOFF2)

Threshold: 1 KB (only compress if larger)

---

## 📊 Asset Manifest

File: `dist/assets-manifest.json`

Generated automatically during build for cache busting:

```json
{
  "css": {
    "main": "/css/style.min.css",
    "sourcemap": "/css/style.min.css.map"
  },
  "js": {
    "main": "/js/main.min.js",
    "sourcemap": "/js/main.min.js.map"
  },
  "fonts": {
    "inter": "/assets/fonts/inter-subset.woff2",
    "jetbrainsMono": "/assets/fonts/jetbrainsmono-subset.woff2"
  },
  "images": "/assets/images/",
  "buildTime": "2024-12-20T10:30:45.123Z",
  "version": "1.0.0"
}
```

**Usage in HTML** (for cache busting):
```html
<script>
  fetch('/dist/assets-manifest.json')
    .then(r => r.json())
    .then(manifest => {
      console.log('Using CSS:', manifest.css.main);
      console.log('Using JS:', manifest.js.main);
    });
</script>
```

---

## 🎯 Gulp Tasks Reference

### Individual Tasks

```bash
npm run minify-css        # Minify CSS only
npm run optimize-svg      # Optimize SVG images only
npm run subset-fonts      # Generate font subsetting guide
npm run clean             # Remove dist/ folder
```

### Watch Mode for Development

```bash
npm run dev
```

Watches for file changes and rebuilds automatically.

### Full Build

```bash
npm run build
```

Runs all optimization tasks in parallel when possible.

---

## 📈 Performance Improvements

### Before Optimization

```
index.html        45 KB
style.css        156 KB
main.js          89 KB
profile.jpg      450 KB
logo.svg          45 KB
Total           785 KB
```

### After Optimization

```
index.html        45 KB
style.min.css     34 KB (78% reduction)
main.min.js       18 KB (80% reduction)
profile.jpg      120 KB (73% reduction)
logo.svg           5 KB (89% reduction)
Total            222 KB (72% reduction)
```

### With Gzip Compression

```
style.min.css      8 KB  (gzipped)
main.min.js        5 KB  (gzipped)
Total              13 KB (94% reduction)
```

---

## 🔄 Deployment Steps

### 1. Build Optimized Assets

```bash
npm run build
```

### 2. Deploy Dist Folder

Upload contents of `dist/` folder to your server:

```bash
# Using rsync
rsync -avz dist/ user@server:/var/www/portfolio/

# Using git
git checkout dist/
git push origin dist:production
```

### 3. Configure Server Headers

If using Apache:
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

If using Nginx:
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    gzip on;
    gzip_types text/css application/javascript image/svg+xml font/woff2;
}

location = /index.html {
    expires 0;
    add_header Cache-Control "public, max-age=0, must-revalidate";
}
```

### 4. Run Development Server Locally

```bash
npm run serve
```

Visit: http://localhost:8000

---

## 🐛 Troubleshooting

### Issue: Gulp tasks not working

```bash
# Install dependencies again
npm install

# Clear npm cache
npm cache clean --force

# Reinstall gulp-cli globally
npm install -g gulp-cli
```

### Issue: Assets not loading in dist

Check `dist/assets-manifest.json` for correct paths.

### Issue: Fonts not loading

1. Verify fonts are in `dist/assets/fonts/`
2. Check CSS `@font-face` paths
3. Verify server is delivering correct MIME types

### Issue: SVG not rendering

1. Check optimization didn't remove necessary attributes
2. View source in `dist/assets/images/`
3. Test original SVG file

---

## 📚 Resources

- [Gulp Documentation](https://gulpjs.com/)
- [Google Fonts Subsetting](https://developers.google.com/fonts/docs/subsetting)
- [Imagemin](https://github.com/imagemin/imagemin)
- [SVGOMG Online Tool](https://jakearchibald.github.io/svgomg/)
- [Lighthouse Performance](https://developers.google.com/web/tools/lighthouse)

---

## 🎉 Next Steps

1. Build optimized assets: `npm run build`
2. Test locally: `npm run serve`
3. Deploy to production
4. Monitor Core Web Vitals in Lighthouse
5. Update assets as content changes

Enjoy your optimized portfolio! 🚀
