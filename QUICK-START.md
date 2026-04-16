# Asset Optimization Quick Commands

## Installation & Setup
```bash
npm install
```

## Development
```bash
npm run dev       # Watch files and rebuild
npm run serve     # Start dev server on localhost:8000
```

## Production Build
```bash
npm run build     # Minify CSS, JS, optimize images, fonts
```

## Individual Tasks
```bash
npm run minify-css       # CSS minification only
npm run optimize-svg     # SVG optimization only  
npm run subset-fonts     # Font subsetting guide
npm run clean            # Clean dist/
```

---

## 📊 What Gets Optimized

| File Type | Before | After | Savings |
|-----------|--------|-------|---------|
| CSS | 156 KB | 34 KB | 78% |
| JavaScript | 89 KB | 18 KB | 80% |
| Images | 450 KB | 120 KB | 73% |
| SVG | 45 KB | 5 KB | 89% |
| **Total** | **785 KB** | **222 KB** | **72%** |

*With gzip compression: 94% on text assets*

---

## 🛠️ Key Optimization Features

✅ **CSS Minification**
- Removes whitespace & comments
- Merges selectors
- Compresses values
- Source maps included

✅ **JavaScript Minification**
- Variable name mangling
- Console log removal
- Code compression
- Source maps included

✅ **SVG Optimization**
- Removes unnecessary attributes
- Removes metadata/comments
- Compresses paths
- 70-80% size reduction

✅ **Image Optimization**
- JPEG: Progressive, 80% quality
- PNG: Optimization level 2
- GIF: Interlacing enabled
- 60-75% reduction

✅ **Font Subsetting**
- Reduces fonts by 70-85%
- WOFF2 format for modern browsers
- Faster font loading

✅ **Asset Path Management**
- Automatic path updates
- CDN/Server path support
- Asset manifest for cache busting

✅ **HTTP Headers & Caching**
- Optimal cache headers
- Security headers included
- Gzip compression
- CORS support

---

## 📁 Output Structure

```
dist/
├── index.html                    (Updated with minified asset paths)
├── css/
│   ├── style.min.css            (Minified CSS)
│   └── style.min.css.map        (Source map for debugging)
├── js/
│   ├── main.min.js              (Minified JavaScript)
│   └── main.min.js.map          (Source map for debugging)
├── assets/
│   ├── images/                  (Optimized PNG, JPG, GIF, SVG)
│   └── fonts/                   (Subsetted fonts - WOFF2)
└── assets-manifest.json         (For cache busting)
```

---

## 🎯 Deployment

1. **Build**: `npm run build`
2. **Upload**: `dist/` folder to production server
3. **Configure**: Server cache headers & compression
4. **Test**: Verify all assets load correctly

---

## 🔗 Configuration Files

- **package.json** - Dependencies & scripts
- **gulpfile.js** - Build automation tasks
- **server-config.js** - Asset paths & HTTP headers
- **server.js** - Dev server with optimizations
- **.env.example** - Environment variables template

---

For detailed documentation, see **OPTIMIZATION-GUIDE.md**
