# Pre-Deployment Checklist for Portfolio Asset Optimization

## 🚀 Before Deploying to Production

### Local Testing
- [ ] Run `npm install` to install all dependencies
- [ ] Run `npm run build` to generate optimized assets
- [ ] Run `npm run serve` to start local server
- [ ] Open `http://localhost:8000` in browser
- [ ] Test all pages load correctly
- [ ] Test all images display properly
- [ ] Check CSS styling is applied correctly
- [ ] Test interactive features (navigation, forms, animations)
- [ ] Check console for any errors or warnings
- [ ] Test on mobile devices (responsive design)
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)

### Performance Validation
- [ ] Check `dist/` folder exists with all optimized files
- [ ] Verify CSS was minified: `dist/css/style.min.css` should exist
- [ ] Verify JS was minified: `dist/js/main.min.js` should exist
- [ ] Verify images are optimized in `dist/assets/images/`
- [ ] Check file sizes have decreased significantly
- [ ] Run Lighthouse audit (DevTools > Lighthouse)
  - [ ] Performance score > 90
  - [ ] First Contentful Paint < 1.5s
  - [ ] Largest Contentful Paint < 2.5s

### Asset Path Verification
- [ ] Open DevTools Network tab
- [ ] All CSS loads from `/css/style.min.css`
- [ ] All JS loads from `/js/main.min.js`
- [ ] All images load from `/assets/images/`
- [ ] All fonts load from `/assets/fonts/` (if using custom fonts)
- [ ] Verify `assets-manifest.json` was generated
- [ ] Check manifest has correct asset paths

### Font Configuration
- [ ] If using self-hosted fonts:
  - [ ] Font files are in `dist/assets/fonts/`
  - [ ] CSS has correct `@font-face` rules
  - [ ] Fonts load without 404 errors
  - [ ] Using WOFF2 format for modern browsers
  - [ ] Fallback fonts configured
- [ ] OR if using Google Fonts:
  - [ ] Font link includes `subset=latin` parameter
  - [ ] Font performance is acceptable

### Security Checks
- [ ] Run security audit: `npm audit`
- [ ] Fix any high-severity vulnerabilities
- [ ] No console errors or warnings in DevTools
- [ ] No XSS vulnerabilities
- [ ] Forms properly validate input
- [ ] No sensitive data in source maps or code

### Server Configuration
- [ ] Web server configured with proper cache headers
- [ ] Gzip compression enabled
- [ ] Security headers configured
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-Frame-Options: DENY
  - [ ] X-XSS-Protection enabled
  - [ ] Referrer-Policy configured
- [ ] HTTPS/SSL certificate configured
- [ ] CORS configured if needed
- [ ] API endpoints configured

### SEO & Meta Tags
- [ ] Meta title is descriptive and under 60 chars
- [ ] Meta description is present and under 160 chars
- [ ] Open Graph tags present for social sharing
- [ ] Favicon configured and loading
- [ ] Schema markup included (optional but recommended)
- [ ] Sitemap.xml generated if possible
- [ ] robots.txt configured

### Accessibility
- [ ] Page is keyboard navigable
- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Forms are properly labeled

### Final Checks
- [ ] All 404 links fixed
- [ ] Contact form working correctly
- [ ] Download links (CV/Resume) working
- [ ] Social media links correct
- [ ] No broken images
- [ ] No missing assets
- [ ] Mobile viewport configured correctly
- [ ] Touch-friendly buttons and links

### Deployment
- [ ] Upload `dist/` folder to production server
- [ ] Test site loads on production domain
- [ ] Verify all assets load correctly
- [ ] Check cache headers in DevTools
- [ ] Run Lighthouse audit on production URL
- [ ] Test contact form sends emails
- [ ] Monitor for errors (check server logs)

### Post-Deployment
- [ ] Monitor Core Web Vitals (Google Search Console)
- [ ] Check analytics tracking works
- [ ] Set up monitoring/alerting
- [ ] Create backup of production
- [ ] Test analytics data collection
- [ ] Monitor error tracking service
- [ ] Schedule regular audits (weekly/monthly)

---

## 📊 Performance Benchmarks to Hit

After optimization, you should see:

```
✓ Lighthouse Performance Score: > 90
✓ First Contentful Paint: < 1.5s
✓ Largest Contentful Paint: < 2.5s
✓ Cumulative Layout Shift: < 0.1
✓ First Input Delay: < 100ms
✓ Total Bundle Size: < 250 KB (before gzip)
✓ Gzipped Bundle: < 50 KB
```

---

## 🔄 Continuous Deployment

For automated deployments:

1. **Setup Git hooks** (if using)
   ```bash
   npm run build    # Auto-run before git push
   ```

2. **CI/CD Pipeline** (GitHub Actions example)
   ```yml
   - Run: npm install
   - Run: npm run build
   - Deploy: dist/ folder
   ```

3. **Monitoring**
   - Set up error tracking (e.g., Sentry)
   - Enable performance monitoring
   - Setup uptime monitoring

---

## ⚠️ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Assets 404 | Check `assets-manifest.json` paths |
| CSS not loading | Verify `/css/style.min.css` exists |
| Images not showing | Check `/assets/images/` permissions |
| Fonts not loading | Verify font files in `/assets/fonts/` |
| Slow performance | Check if gzip compression enabled |
| Cache not working | Verify cache headers on server |

---

## 📞 Support

For issues or questions:
1. Check `OPTIMIZATION-GUIDE.md`
2. Review `server-config.js` for header settings
3. Check browser DevTools Network tab
4. Review build logs: `npm run build`
5. Test with `npm run serve`

---

**Date Checked**: ________________
**Checked By**: ________________
**Environment**: [ ] Local [ ] Staging [ ] Production
**Status**: [ ] ✅ Ready [ ] ⚠️ Issues Found

