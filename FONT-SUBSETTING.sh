#!/bin/bash
# Font Subsetting Helper Script
# This script helps with manual font subsetting

echo "🔤 Font Subsetting Guide"
echo "======================="
echo ""

# Characters used in the portfolio
SUBSET_CHARS="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,;:!?-'\"/()"

echo "1️⃣  Using Google Fonts (Recommended - Easiest)"
echo "   Update your index.html link tag with subset parameter:"
echo ""
echo "   <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&subset=latin&display=swap\" rel=\"stylesheet\">"
echo ""

echo "2️⃣  Using Font Squirrel (For Custom Fonts)"
echo "   1. Go to: https://www.fontsquirrel.com/tools/webfont-generator"
echo "   2. Upload your .ttf or .otf font files"
echo "   3. Choose Basic Latin for subsetting"
echo "   4. Download the package"
echo "   5. Copy .woff2 files to: assets/fonts/"
echo ""

echo "3️⃣  Using Transfonter (Modern Approach)"
echo "   1. Go to: https://transfonter.org/"
echo "   2. Upload font files"
echo "   3. Select WOFF2 format (most efficient)"
echo "   4. Enable subsetting"
echo "   5. Download and extract"
echo "   6. Copy fonts to: dist/assets/fonts/"
echo ""

echo "4️⃣  Using fontmin (Command Line)"
echo "   Install: npm install -g fontmin"
echo "   Then run:"
echo "   fontmin --text=\"$SUBSET_CHARS\" input.ttf --output=dist/assets/fonts"
echo ""

echo "5️⃣  After Subsetting - Update CSS"
echo "   Add @font-face rules in css/style.css:"
echo ""
cat << 'EOF'
@font-face {
  font-family: 'Inter-Subset';
  src: url('/assets/fonts/inter-subset.woff2') format('woff2'),
       url('/assets/fonts/inter-subset.woff') format('woff');
  font-weight: 400;
  font-display: swap;
}
EOF
echo ""

echo "6️⃣  Update HTML to Use Subsetted Fonts"
echo "   In index.html, update the font link or add to css/style.css:"
echo ""
cat << 'EOF'
/* Use the subset fonts instead of Google Fonts CDN */
body {
  font-family: 'Inter-Subset', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
EOF
echo ""

echo "✅ Font subsetting typically reduces font files by 70-85%"
echo ""
