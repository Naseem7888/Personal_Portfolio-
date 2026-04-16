# 🚀 Professional Portfolio Website - Naseem Akhtar

[![Deploy to GitHub Pages](https://github.com/Naseem7888/Personal-Portfolio/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Naseem7888/Personal-Portfolio/actions/workflows/deploy-pages.yml)

Live site (after Pages is enabled):

- <https://naseem7888.github.io/Personal-Portfolio/>

A modern, responsive, and feature-rich portfolio website showcasing professional skills, experience, and projects. Built with cutting-edge web technologies and best practices.

![Portfolio Preview](assets/images/portfolio-preview.jpg)

## ✨ Features

### 🎨 **Design & UX**
- **Modern & Professional Design** - Clean, elegant interface with smooth animations
- **Fully Responsive** - Optimized for all devices (mobile, tablet, desktop)
- **Dark/Light Theme Toggle** - User preference with localStorage persistence
- **Smooth Animations** - Intersection Observer API for performance-optimized animations
- **Interactive Elements** - Hover effects, transitions, and micro-interactions

### 🛠️ **Technical Features**
- **Pure Vanilla JavaScript** - No dependencies, lightning-fast performance
- **CSS Grid & Flexbox** - Modern layout techniques
- **CSS Custom Properties** - Easy theming and maintenance
- **Intersection Observer API** - Efficient scroll-based animations
- **Local Storage Integration** - Theme and user preferences persistence
- **Performance Optimized** - Lazy loading, efficient animations, optimized assets

### 📱 **Sections & Functionality**
- **Dynamic Hero Section** - Typing animation with rotating job titles
- **About Me** - Comprehensive personal and professional information
- **Skills & Technologies** - Animated progress bars and categorized skills
- **Professional Experience** - Interactive timeline with detailed work history
- **Projects Portfolio** - Filterable project showcase with live demos and source code
- **Contact Form** - Functional contact form with validation and animations
- **Social Integration** - Links to GitHub, LinkedIn, and other platforms

### 🎯 **Interactive Components**
- **Project Filtering** - Filter projects by technology/category
- **Animated Counters** - Count-up animations for statistics
- **Progress Bars** - Skill level visualization with smooth animations
- **Form Validation** - Real-time validation with user-friendly error messages
- **Notification System** - Toast notifications for user feedback
- **Back to Top Button** - Smooth scroll navigation
- **Mobile Navigation** - Responsive hamburger menu

## 🏗️ **Project Structure**

```
portfolio/
├── 📄 index.html              # Main HTML file
├── 📁 css/
│   └── 📄 style.css           # Complete stylesheet with CSS Grid & Flexbox
├── 📁 js/
│   └── 📄 main.js             # Enhanced JavaScript functionality
├── 📁 assets/
│   ├── 📁 images/             # Profile photos, project screenshots
│   └── 📄 Naseem_Akhtar_CV.pdf # Downloadable CV
├── 📁 projects/               # Individual project pages (future expansion)
├── 📁 .github/
│   └── 📄 copilot-instructions.md # Development guidelines
└── 📄 README.md               # This file
```

## 🚀 **Getting Started**

### Prerequisites
- A modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Local web server (optional, for development)

### Quick Start

1. **Clone or Download**
   ```bash
   git clone https://github.com/naseemakhtar/portfolio.git
   cd portfolio
   ```

2. **Open in Browser**
   - Double-click `index.html`, or
   - Use a local development server:

   ```bash
   # Using Python
   python -m http.server 3000
   
   # Using Node.js
   npx serve -p 3000
   
   # Using PHP
   php -S localhost:3000
   ```

3. **View in Browser**
   ```
   http://localhost:3000
   ```

## 🎨 **Customization Guide**

### 1. **Personal Information**
Edit the following in `index.html`:

```html
<!-- Update your name and title -->
<h1 class="hero-title">
    <span class="title-main">Your Name</span>
</h1>

<!-- Update contact information -->
<div class="method-info">
    <h4>Email</h4>
    <p>your.email@example.com</p>
</div>
```

### 2. **Color Scheme**
Modify CSS custom properties in `css/style.css`:

```css
:root {
    --primary-color: #667eea;      /* Change primary brand color */
    --secondary-color: #764ba2;    /* Change secondary color */
    --accent-color: #f093fb;       /* Change accent color */
    /* ... other color variables */
}
```

### 3. **Skills & Technologies**
Update the skills section in `index.html`:

```html
<div class="skill-item" data-skill="95">
    <div class="skill-info">
        <i class="fab fa-html5"></i>
        <span>HTML5</span>
    </div>
    <div class="skill-progress">
        <div class="progress-bar" data-progress="95"></div>
    </div>
</div>
```

### 4. **Projects**
Add your projects in the projects section:

```html
<div class="project-card" data-category="web fullstack">
    <div class="project-image">
        <img src="assets/images/your-project.jpg" alt="Project Name">
    </div>
    <div class="project-content">
        <h3>Your Project Name</h3>
        <p>Project description...</p>
        <!-- ... -->
    </div>
</div>
```

### 5. **Professional Experience**
Update the timeline in the experience section:

```html
<div class="timeline-item" data-date="2023 - Present">
    <div class="timeline-content">
        <h3>Your Job Title</h3>
        <h4>Company Name</h4>
        <p class="duration">Start Date - End Date</p>
        <!-- ... -->
    </div>
</div>
```

## 📱 **Responsive Breakpoints**

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px
- **Large Desktop**: > 1200px

## 🎯 **Browser Support**

- ✅ **Chrome** 90+
- ✅ **Firefox** 88+
- ✅ **Safari** 14+
- ✅ **Edge** 90+
- ⚠️ **Internet Explorer** - Not supported (uses modern CSS features)

## 📦 **Dependencies**

### External Libraries (CDN):
- **Font Awesome 6.4.0** - Icons
- **Google Fonts (Inter & JetBrains Mono)** - Typography

### No JavaScript Dependencies:
- Pure Vanilla JavaScript ES6+
- No jQuery, React, or other frameworks
- Lightweight and fast-loading

## 🔧 **Development**

### Local Development Setup:

1. **Install VS Code Extensions** (recommended):
   - Live Server
   - Prettier
   - Auto Rename Tag
   - CSS Peek

2. **Start Development Server**:
   ```bash
   # Using VS Code Live Server
   Right-click index.html → "Open with Live Server"
   
   # Or use Python
   python -m http.server 3000
   ```

3. **Watch for Changes**:
   The website will auto-reload when files are modified.

### Code Organization:

- **HTML**: Semantic structure with accessibility features
- **CSS**: Mobile-first responsive design with CSS Grid/Flexbox
- **JavaScript**: Modular ES6+ code with error handling

## 🚀 **Deployment Options**

### 1. **GitHub Pages** (Free)
```bash
git add .
git commit -m "Initial portfolio commit"
git push origin main
# Enable GitHub Pages in repository settings
```

### 2. **Netlify** (Free tier available)
```bash
# Drag and drop the folder to Netlify
# Or connect your GitHub repository
```

### 3. **Vercel** (Free tier available)
```bash
npx vercel
# Follow the prompts
```

### 4. **Traditional Web Hosting**
Upload all files to your web hosting provider's public folder.

## 📈 **Performance Features**

- **Optimized Images** - WebP format with fallbacks
- **Minified Assets** - Compressed CSS and JavaScript  
- **Lazy Loading** - Images load as they come into view
- **Efficient Animations** - GPU-accelerated CSS animations
- **Minimal Dependencies** - Only essential external resources
- **Preconnect Links** - Faster font loading
- **Performance Monitoring** - Built-in performance tracking

## 🌐 **Offline Support**

- A service worker precaches the app shell (`index.html`, `css/style.css`, `js/main.js`) plus the main local assets used by the portfolio.
- The first visit should happen while online so the cache can be populated.
- After that, the site can load the previously cached content when the network is unavailable.
- A connection banner appears while offline so the cached mode is visible during testing.

## 🔧 **Advanced Features**

### Theme System:
- Automatic theme detection based on system preference
- Manual theme toggle with smooth transitions
- localStorage persistence across sessions

### Form Handling:
- Client-side validation with real-time feedback
- Character counting for text areas
- Professional error messaging
- Loading states and success notifications

### Analytics Ready:
- Google Analytics integration ready
- Performance monitoring hooks
- Error tracking capabilities

## 📝 **Customization Checklist**

- [ ] Update personal information (name, title, description)
- [ ] Replace placeholder profile photo
- [ ] Add your real projects with screenshots
- [ ] Update skills and proficiency levels
- [ ] Modify color scheme to match your brand
- [ ] Add your actual work experience
- [ ] Update contact information
- [ ] Replace social media links
- [ ] Add your CV/resume file
- [ ] Configure contact form backend (if needed)
- [ ] Set up analytics tracking
- [ ] Optimize images for web
- [ ] Test on multiple devices and browsers

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 📞 **Support & Contact**

**Naseem Akhtar**
- 📧 Email: naseem.akhtar.yq@gmail.com
- 💼 LinkedIn: [linkedin.com/in/naseemakhtar](https://www.linkedin.com/in/naseem7888/)
- 🐙 GitHub: [github.com/naseemakhtar](https://github.com/Naseem7888)

---

## 🙏 **Acknowledgments**

- **Font Awesome** - For the beautiful icons
- **Google Fonts** - For the typography
- **Unsplash** - For placeholder images (replace with your own)
- **CSS Grid & Flexbox** - For modern layout capabilities
- **Intersection Observer API** - For performance-optimized animations

---

<div align="center">

**⭐ If you found this helpful, please give it a star!**

Made with ❤️ by [Naseem Akhtar](https://github.com/Naseem7888)

**Built with Modern Web Technologies • Fully Responsive • Performance Optimized**

</div>
