const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const del = require('del');
const Fontmin = require('fontmin');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

// ============================================
// CONFIGURATION
// ============================================
const config = {
  source: {
    css: 'css/**/*.css',
    js: 'js/**/*.js',
    images: 'assets/images/**/*.{png,jpg,jpeg,gif}',
    svg: 'assets/images/**/*.svg',
    html: '*.html',
  },
  dist: {
    root: 'dist',
    css: 'dist/css',
    js: 'dist/js',
    images: 'dist/assets/images',
    fonts: 'dist/assets/fonts',
    html: 'dist',
  },
};

// Asset paths configuration - prefixes for server/CDN
const assetPaths = {
  cssPath: '/css/',
  jsPath: '/js/',
  imagePath: '/assets/images/',
  fontPath: '/assets/fonts/',
};

// ============================================
// TASK 1: MINIFY CSS
// ============================================
gulp.task('minify-css', () => {
  return gulp.src(config.source.css)
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({
      compatibility: 'ie8',
      level: {
        1: {
          specialComments: 0,
        },
        2: {
          restructureRules: true,
          removeUnusedAtRules: true,
        },
      },
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dist.css))
    .pipe(notify({
      title: 'CSS Minified',
      message: 'CSS files have been minified successfully',
      icon: path.join(__dirname, 'assets/images/favicon.ico'),
    }));
});

// ============================================
// TASK 2: MINIFY JAVASCRIPT
// ============================================
gulp.task('minify-js', () => {
  return gulp.src(config.source.js)
    .pipe(sourcemaps.init())
    .pipe(terser({
      mangle: true,
      compress: {
        drop_console: true,
      },
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dist.js))
    .pipe(notify({
      title: 'JavaScript Minified',
      message: 'JavaScript files have been minified successfully',
    }));
});

// ============================================
// TASK 3: OPTIMIZE SVG IMAGES
// ============================================
gulp.task('optimize-svg', () => {
  return gulp.src(config.source.svg)
    .pipe(svgmin({
      js2svg: {
        pretty: true,
      },
      plugins: [
        'preset-default',
        'removeViewBox',
        'removeEmptyAttrs',
        'removeHiddenElems',
        'removeUselessStrokeAndFill',
        'removeStyleElement',
        'removeScriptElement',
        'removeComments',
        'removeMetadata',
        'removeDesc',
        'removeEmptyContainers',
        'convertEllipseToCircle',
        'convertTransform',
        'convertColors',
        {
          name: 'removeAttrs',
          params: {
            attrs: ['fill', 'stroke', 'data-*'],
          },
        },
      ],
    }))
    .pipe(gulp.dest(config.dist.images))
    .pipe(notify({
      title: 'SVG Optimized',
      message: 'SVG files have been optimized successfully',
    }));
});

// ============================================
// TASK 4: OPTIMIZE RASTER IMAGES
// ============================================
gulp.task('optimize-images', () => {
  return gulp.src(config.source.images)
    .pipe(imagemin([
      imagemin.mozjpeg({ quality: 80, progressive: true }),
      imagemin.optipng({ optimizationLevel: 2 }),
      imagemin.gifsicle({ interlaced: true }),
    ], {
      verbose: true,
    }))
    .pipe(gulp.dest(config.dist.images))
    .pipe(notify({
      title: 'Images Optimized',
      message: 'Image files have been further optimized',
    }));
});

// ============================================
// TASK 5: SUBSET GOOGLE FONTS
// ============================================
gulp.task('subset-fonts', (done) => {
  // Characters used in the portfolio (customize based on your content)
  const subsetChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,;:!?-\'"/()@#$%&*+-=[]{}|<>';

  // Create fonts directory if it doesn't exist
  mkdirp.sync(config.dist.fonts);

  // Font configurations: Download these from Google Fonts API
  // Inter: wght 300,400,500,600,700,800
  // JetBrains Mono: wght 400,500,600

  const fontUrls = [
    {
      name: 'inter',
      weights: [300, 400, 500, 600, 700, 800],
      url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KSvyrQAhW4YLTM4.woff2',
    },
    {
      name: 'jetbrainsmono',
      weights: [400, 500, 600],
      url: 'https://fonts.gstatic.com/s/jetbrainsmono/v18/BBW63p-DQCqFDVyH9QAC8HPHaHWFvDji65_8jxrtV2A.woff2',
    },
  ];

  // Instructions for manual subsetting
  console.log('\n========================================');
  console.log('FONT SUBSETTING GUIDE');
  console.log('========================================');
  console.log('Install fontmin globally: npm install -g fontmin');
  console.log('\nUse these commands for each font:');
  console.log('fontmin --text="' + subsetChars + '" input.ttf --output=' + config.dist.fonts);
  console.log('\nOr use online tools:');
  console.log('- Google Fonts: Add ?display=swap&subset=latin...');
  console.log('- Font squirrel: https://www.fontsquirrel.com/tools/webfont-generator');
  console.log('- Transfonter: https://transfonter.org/');
  console.log('========================================\n');

  // Alternative: Create a simple subsetting script
  const subsetCommand = `
    # Install fontmin if not already installed
    npm install fontmin --save-dev

    # Subset Inter font
    npx fontmin --text="${subsetChars}" assets/fonts/inter.ttf --output=${config.dist.fonts}

    # Subset JetBrains Mono font
    npx fontmin --text="${subsetChars}" assets/fonts/jetbrainsmono.ttf --output=${config.dist.fonts}
  `;

  // Create a helper script
  fs.writeFileSync(
    path.join(__dirname, 'subset-fonts.sh'),
    subsetCommand,
    'utf8',
  );

  notify({
    title: 'Font Subsetting Guide Created',
    message: 'Check subset-fonts.sh for manual instructions',
  })();

  done();
});

// ============================================
// TASK 6: UPDATE HTML WITH MINIFIED ASSETS
// ============================================
gulp.task('update-html', () => {
  let htmlContent = fs.readFileSync('index.html', 'utf8');

  // Replace CSS path
  htmlContent = htmlContent.replace(
    /<link rel="stylesheet" href="css\/style\.css">/g,
    `<link rel="stylesheet" href="${assetPaths.cssPath}style.min.css">`,
  );

  // Replace JavaScript path
  htmlContent = htmlContent.replace(
    /<script src="js\/main\.js"><\/script>/g,
    `<script src="${assetPaths.jsPath}main.min.js"><\/script>`,
  );

  // Update image paths
  htmlContent = htmlContent.replace(
    /src="assets\/images\//g,
    `src="${assetPaths.imagePath}`,
  );
  htmlContent = htmlContent.replace(
    /href="assets\/images\//g,
    `href="${assetPaths.imagePath}`,
  );

  // Write updated HTML to dist
  mkdirp.sync(config.dist.html);
  fs.writeFileSync(
    path.join(config.dist.html, 'index.html'),
    htmlContent,
    'utf8',
  );

  notify({
    title: 'HTML Updated',
    message: 'Asset paths have been updated in distribution HTML',
  })();

  return Promise.resolve();
});

// ============================================
// TASK 7: CREATE A MANIFEST FILE (for cache busting)
// ============================================
gulp.task('create-manifest', (done) => {
  const manifest = {
    css: {
      main: `${assetPaths.cssPath}style.min.css`,
      sourcemap: `${assetPaths.cssPath}style.min.css.map`,
    },
    js: {
      main: `${assetPaths.jsPath}main.min.js`,
      sourcemap: `${assetPaths.jsPath}main.min.js.map`,
    },
    fonts: {
      inter: `${assetPaths.fontPath}inter-subset.woff2`,
      jetbrainsMono: `${assetPaths.fontPath}jetbrainsmono-subset.woff2`,
    },
    images: assetPaths.imagePath,
    buildTime: new Date().toISOString(),
    version: require('./package.json').version,
  };

  mkdirp.sync(config.dist.root);
  fs.writeFileSync(
    path.join(config.dist.root, 'assets-manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8',
  );

  notify({
    title: 'Manifest Created',
    message: 'Asset manifest created for cache busting',
  })();

  done();
});

// ============================================
// TASK 8: CLEAN DISTRIBUTION FOLDER
// ============================================
gulp.task('clean', () => {
  return del([config.dist.root], { force: true });
});

// ============================================
// COMPOSITE TASKS
// ============================================

// Build all assets
gulp.task('build', gulp.series(
  'clean',
  gulp.parallel(
    'minify-css',
    'minify-js',
    'optimize-svg',
    'optimize-images',
    'subset-fonts',
  ),
  'update-html',
  'create-manifest',
  (done) => {
    notify({
      title: 'Build Complete',
      message: 'All assets have been optimized and ready for deployment',
    })();
    done();
  },
));

// Watch for file changes during development
gulp.task('watch', () => {
  gulp.watch(config.source.css, gulp.series('minify-css'));
  gulp.watch(config.source.js, gulp.series('minify-js'));
  gulp.watch(config.source.svg, gulp.series('optimize-svg'));
  gulp.watch(config.source.images, gulp.series('optimize-images'));
  gulp.watch(config.source.html, gulp.series('update-html'));
  console.log('👀 Watching for file changes...');
});

// Default task
gulp.task('default', gulp.series('build'));
