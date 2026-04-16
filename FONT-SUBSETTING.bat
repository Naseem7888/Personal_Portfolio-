@echo off
REM Font Subsetting Helper Script (Windows)
REM This script helps with manual font subsetting

echo.
echo 🔤 Font Subsetting Guide for Windows
echo.
echo ====================================
echo.

echo 1️⃣  Using Google Fonts (Recommended - Easiest)
echo    Update your index.html link tag with subset parameter:
echo.
echo    https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800^&family=JetBrains+Mono:wght@400;500;600^&subset=latin^&display=swap
echo.

echo 2️⃣  Using Font Squirrel (For Custom Fonts)
echo    1. Go to: https://www.fontsquirrel.com/tools/webfont-generator
echo    2. Upload your .ttf or .otf font files
echo    3. Choose Basic Latin for subsetting
echo    4. Download the package
echo    5. Copy .woff2 files to: assets\fonts\
echo.

echo 3️⃣  Using Transfonter (Modern Approach)
echo    1. Go to: https://transfonter.org/
echo    2. Upload font files
echo    3. Select WOFF2 format (most efficient^)
echo    4. Enable subsetting
echo    5. Download and extract
echo    6. Copy fonts to: dist\assets\fonts\
echo.

echo 4️⃣  Using fontmin (Command Line^)
echo    Install: npm install -g fontmin
echo    Then run:
echo    fontmin --text="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 " input.ttf --output=dist\assets\fonts
echo.

echo 5️⃣  After Subsetting - Update CSS
echo    Add to css\style.css:
echo.
echo    @font-face {
echo      font-family: 'Inter-Subset';
echo      src: url('/assets/fonts/inter-subset.woff2') format('woff2');
echo      font-weight: 400;
echo      font-display: swap;
echo    }
echo.

echo 6️⃣  Run Build Command
echo    npm run build
echo.

echo ✅ Ready to optimize!
echo.
pause
