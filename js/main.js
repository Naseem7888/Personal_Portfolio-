/*
=================================================
PORTFOLIO WEBSITE - ENHANCED JAVASCRIPT
=================================================
Author: Naseem Akhtar
Version: 2.0
Description: Interactive functionality for portfolio website
=================================================
*/

// Global Configuration
const CONFIG = {
    // Animation durations
    ANIMATION_DURATION: {
        FAST: 200,
        NORMAL: 300,
        SLOW: 500
    },
    
    // Typing effect configuration
    TYPING: {
        SPEED: 100,
        DELAY: 1000,
        PHRASES: [
            'Full Stack Python Developer',
            'Django · FastAPI · Flask',
            'React · Node.js',
            'PostgreSQL · MongoDB',
            'PyQt6 · OCR'
        ]
    },
    
    // Intersection Observer thresholds
    OBSERVER_THRESHOLD: 0.1,
    
    // Counter animation configuration
    COUNTER: {
        DURATION: 2000,
        STEP: 50
    }
};

// Main Application Class
class PortfolioApp {
    constructor() {
        this.isLoaded = false;
        this.activeSection = 'home';
        this.theme = localStorage.getItem('theme') || 'light';
        this.githubUser = 'naseem7888';
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        console.log('🚀 Initializing Portfolio App...');
        
        // Initialize all modules
        this.initTheme();
        this.initNavigation();
        this.initScrollEffects();
        this.initTypingEffect();
        this.initCounters();
        this.initSkillsAnimation();
        this.initProjectsFilter();
        this.initGitHubProjects();
        this.initGitHubSkills();
        this.initContactForm();
        this.initIntersectionObserver();
        this.initBackToTop();
        this.initSmoothScrolling();
        this.initOfflineSupport();
        
        // Auto-calc hero stats (initial for technologies; projects updated after GitHub load)
        this.updateTechCounter();
        
        // Mark as loaded
        this.isLoaded = true;
        document.body.classList.add('loaded');
        
        console.log('✅ Portfolio App initialized successfully');
    }
    
    // Theme Management
    initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        
        // Apply saved theme
        body.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();
        
        // Theme toggle functionality
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
    
    // GitHub Projects (dynamic)
    async initGitHubProjects() {
        const grid = document.getElementById('github-projects-grid');
        if (!grid) return;
        try {
            const resp = await fetch(`https://api.github.com/users/${this.githubUser}/repos?per_page=100&sort=updated`, {
                headers: {
                    'Accept': 'application/vnd.github+json'
                }
            });
            if (!resp.ok) throw new Error(`GitHub API error: ${resp.status}`);
            const repos = await resp.json();
            const username = this.githubUser?.toLowerCase?.() || '';
            const filtered = repos
                .filter(r => !r.fork && !r.archived && r.name?.toLowerCase() !== username && r.description && r.description.trim().length > 0)
                .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)))
                .slice(0, 6);

            if (filtered.length === 0) {
                grid.innerHTML = '<p style="text-align:center;color:var(--text-muted)">No public repositories found.</p>';
                return;
            }

            const frag = document.createDocumentFragment();
            filtered.forEach(repo => {
                const card = this.createRepoCard(repo);
                frag.appendChild(card);
            });
            grid.appendChild(frag);

            // Update hero projects counter after rendering GitHub repos
            this.updateProjectCounter();
        } catch (err) {
            console.error('Failed to load GitHub repos', err);
            grid.innerHTML = '<p style="text-align:center;color:var(--text-muted)">Offline mode is active. Curated projects are still available above, and GitHub-powered content will refresh when you reconnect.</p>';
            // Still update counter with curated-only if API fails
            this.updateProjectCounter();
        }
    }

    createRepoCard(repo) {
        const card = document.createElement('div');
        card.className = 'project-card';
        const homepage = repo.homepage && repo.homepage.startsWith('http') ? repo.homepage : null;
        const updated = new Date(repo.pushed_at).getFullYear();
        const lang = repo.language || 'Repo';
        const stars = repo.stargazers_count || 0;

        card.innerHTML = `
            <div class="project-image">
                <div class="project-placeholder visible">
                    <i class="fas fa-code-branch"></i>
                </div>
                <div class="project-overlay">
                    <div class="project-actions">
                        ${homepage ? `<a href="${homepage}" class="action-btn" target="_blank" rel="noopener" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        <a href="${repo.html_url}" class="action-btn" target="_blank" rel="noopener" title="Source Code"><i class="fab fa-github"></i></a>
                    </div>
                </div>
            </div>
            <div class="project-content">
                <div class="project-meta">
                    <span class="project-type">${lang}</span>
                    <span class="project-date">${updated}</span>
                </div>
                <h3>${this.escapeHtml(repo.name)}</h3>
                <p>${this.escapeHtml(repo.description || 'No description provided.')}</p>
                <div class="project-tech">
                    ${lang ? `<span class="tech-tag">${this.escapeHtml(lang)}</span>` : ''}
                </div>
                <div class="project-stats">
                    <div class="stat"><i class="fas fa-star"></i><span>${stars}</span></div>
                    <div class="stat"><i class="fas fa-code-branch"></i><span>${repo.forks_count || 0}</span></div>
                </div>
            </div>
        `;
        return card;
    }

    escapeHtml(str) {
        return String(str).replace(/[&<>"]+/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
    }

    // GitHub Skills (top languages)
    async initGitHubSkills() {
        const skillsList = document.getElementById('github-skills-list');
        if (!skillsList) return;
        try {
            const resp = await fetch(`https://api.github.com/users/${this.githubUser}/repos?per_page=100&sort=updated`, {
                headers: { 'Accept': 'application/vnd.github+json' }
            });
            if (!resp.ok) throw new Error(`GitHub API error: ${resp.status}`);
            const repos = await resp.json();
            const tally = {};
            repos.filter(r => !r.fork && !r.archived && r.language).forEach(r => {
                tally[r.language] = (tally[r.language] || 0) + 1;
            });
            const total = Object.values(tally).reduce((a, b) => a + b, 0) || 1;
            const top = Object.entries(tally)
                .sort((a,b) => b[1]-a[1])
                .slice(0, 6)
                .map(([lang, count]) => ({ lang, percent: Math.round((count/total)*100) }));

            if (top.length === 0) {
                skillsList.innerHTML = '<p style="color:var(--text-muted)">No language data available.</p>';
                return;
            }

            top.forEach(({lang, percent}) => {
                const item = document.createElement('div');
                item.className = 'skill-item';
                item.innerHTML = `
                    <div class="skill-info">
                        <i class="fas fa-code"></i>
                        <span>${this.escapeHtml(lang)}</span>
                    </div>
                    <div class="skill-progress">
                        <div class="progress-bar" data-progress="${percent}"></div>
                    </div>
                `;
                skillsList.appendChild(item);
            });

            // Trigger animation for this category
            const githubCard = document.getElementById('github-skills');
            if (githubCard) {
                // Animate immediately after render
                githubCard.classList.add('animate');
                githubCard.querySelectorAll('.progress-bar').forEach((bar, idx) => {
                    const progress = bar.getAttribute('data-progress');
                    setTimeout(() => {
                        bar.style.setProperty('--progress-width', progress + '%');
                        bar.style.width = progress + '%';
                    }, idx * 80);
                });
            }
        } catch (err) {
            console.error('Failed to load GitHub languages', err);
        }
    }

    // ===== Hero counters auto-calculation =====
    updateProjectCounter() {
        try {
            const curatedGrid = document.querySelector('#projects .projects-grid:not([id])');
            const curatedCount = curatedGrid ? curatedGrid.querySelectorAll('.project-card').length : 0;
            const ghGrid = document.getElementById('github-projects-grid');
            const ghCount = ghGrid ? ghGrid.querySelectorAll('.project-card').length : 0;
            const total = curatedCount + ghCount;

            const items = document.querySelectorAll('.hero .stat-item');
            items.forEach(item => {
                const label = item.querySelector('.stat-label')?.textContent?.toLowerCase?.() || '';
                if (label.includes('project')) {
                    const numEl = item.querySelector('.stat-number');
                    if (numEl) {
                        numEl.setAttribute('data-count', total);
                        numEl.textContent = total;
                    }
                }
            });
        } catch (e) {
            console.warn('Unable to update project counter', e);
        }
    }

    updateTechCounter() {
        try {
            // Count static skills across categories, excluding GitHub dynamic languages
            const staticSkills = document.querySelectorAll('.skills .skill-category:not(#github-skills) .skills-list .skill-item');
            const total = staticSkills.length;
            const items = document.querySelectorAll('.hero .stat-item');
            items.forEach(item => {
                const label = item.querySelector('.stat-label')?.textContent?.toLowerCase?.() || '';
                if (label.includes('technolog')) {
                    const numEl = item.querySelector('.stat-number');
                    if (numEl) {
                        numEl.setAttribute('data-count', total);
                        numEl.textContent = total;
                    }
                }
            });
        } catch (e) {
            console.warn('Unable to update technologies counter', e);
        }
    }
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.updateThemeIcon();
        
        // Animate theme transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    updateThemeIcon() {
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle?.querySelector('i');
        
        if (icon) {
            icon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
    
    // Navigation Management
    initNavigation() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                if (navMenu.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Navigation link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Close mobile menu
                    navMenu?.classList.remove('active');
                    navToggle?.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    // Smooth scroll to section
                    this.scrollToSection(targetSection);
                    
                    // Update active section
                    this.setActiveSection(targetId.substring(1));
                }
            });
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        });
    }
    
    setActiveSection(sectionId) {
        // Update active navigation link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        this.activeSection = sectionId;
    }
    
    // Scroll Effects
    initScrollEffects() {
        // Scroll progress bar
        const scrollProgress = document.getElementById('scroll-progress');
        
        window.addEventListener('scroll', () => {
            if (scrollProgress) {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                scrollProgress.style.width = Math.min(scrollPercent, 100) + '%';
            }
            
            // Update active section based on scroll position
            this.updateActiveSection();
        });
    }
    
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                this.setActiveSection(sectionId);
            }
        });
    }
    
    // Typing Effect
    initTypingEffect() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeEffect = () => {
            const currentPhrase = CONFIG.TYPING.PHRASES[phraseIndex];
            const displayText = currentPhrase.substring(0, charIndex);
            
            typingElement.textContent = displayText;
            
            if (!isDeleting && charIndex < currentPhrase.length) {
                // Typing
                charIndex++;
                setTimeout(typeEffect, CONFIG.TYPING.SPEED);
            } else if (isDeleting && charIndex > 0) {
                // Deleting
                charIndex--;
                setTimeout(typeEffect, CONFIG.TYPING.SPEED / 2);
            } else if (!isDeleting && charIndex === currentPhrase.length) {
                // Pause before deleting
                setTimeout(() => {
                    isDeleting = true;
                    typeEffect();
                }, CONFIG.TYPING.DELAY);
            } else if (isDeleting && charIndex === 0) {
                // Move to next phrase
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % CONFIG.TYPING.PHRASES.length;
                setTimeout(typeEffect, CONFIG.TYPING.SPEED);
            }
        };
        
        // Start typing effect after initial delay
        setTimeout(() => {
            typeEffect();
        }, 1000);
    }
    
    // Counter Animation
    initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        const animatedCounters = new Set();
        
        const animateCounter = (counter) => {
            if (animatedCounters.has(counter)) return;
            animatedCounters.add(counter);
            
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = CONFIG.COUNTER.DURATION;
            const step = target / (duration / CONFIG.COUNTER.STEP);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    setTimeout(updateCounter, CONFIG.COUNTER.STEP);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        };
        
        // Animate counters when they come into view
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    // Skills Animation
    initSkillsAnimation() {
        const skillCategories = document.querySelectorAll('.skill-category');
        
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const category = entry.target;
                    const progressBars = category.querySelectorAll('.progress-bar');
                    
                    // Add animation class
                    category.classList.add('animate');
                    
                    // Animate progress bars
                    progressBars.forEach((bar, index) => {
                        const progress = bar.getAttribute('data-progress');
                        
                        setTimeout(() => {
                            bar.style.setProperty('--progress-width', progress + '%');
                            bar.style.width = progress + '%';
                        }, index * 100);
                    });
                    
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        skillCategories.forEach(category => {
            skillsObserver.observe(category);
        });
    }
    
    // Projects Filter
    initProjectsFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active filter button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category');
                    const shouldShow = filter === 'all' || categories.includes(filter);
                    
                    if (shouldShow) {
                        card.classList.remove('hidden');
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.classList.add('hidden');
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                    }
                });
                
                // Add animation delay for staggered effect
                let delay = 0;
                projectCards.forEach(card => {
                    if (!card.classList.contains('hidden')) {
                        setTimeout(() => {
                            card.style.transition = 'all 0.3s ease';
                        }, delay);
                        delay += 50;
                    }
                });
            });
        });
    }
    
    // Contact Form
    initContactForm() {
        const form = document.getElementById('contact-form');
        const messageTextarea = document.getElementById('message');
        const charCount = document.getElementById('char-count');
        
        if (!form) return;
        
        // Character counter for message textarea
        if (messageTextarea && charCount) {
            messageTextarea.addEventListener('input', () => {
                const currentLength = messageTextarea.value.length;
                const maxLength = 500;
                
                charCount.textContent = currentLength;
                
                if (currentLength > maxLength * 0.9) {
                    charCount.style.color = '#e74c3c';
                } else if (currentLength > maxLength * 0.7) {
                    charCount.style.color = '#f39c12';
                } else {
                    charCount.style.color = '#7f8c8d';
                }
            });
        }
        
        // Form validation and submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = form.querySelector('.btn-submit');
            const formData = new FormData(form);
            
            // Validate required fields
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    this.showFieldError(field, 'This field is required');
                    isValid = false;
                } else {
                    this.clearFieldError(field);
                }
            });
            
            // Email validation
            const emailField = form.querySelector('#email');
            if (emailField && emailField.value && !this.isValidEmail(emailField.value)) {
                this.showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
            
            if (!isValid) {
                this.showNotification('Please correct the errors in the form', 'error');
                return;
            }
            
            // Show loading state
            submitButton.classList.add('loading');
            
            try {
                // Simulate form submission (replace with actual API call)
                await this.submitContactForm(formData);
                
                // Success
                this.showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                form.reset();
                if (charCount) charCount.textContent = '0';
                
            } catch (error) {
                console.error('Form submission error:', error);
                this.showNotification('Something went wrong. Please try again later.', 'error');
            } finally {
                submitButton.classList.remove('loading');
            }
        });
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#e74c3c';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        `;
        
        field.parentNode.appendChild(errorElement);
    }
    
    clearFieldError(field) {
        field.style.borderColor = '';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    async submitContactForm(formData) {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form Data:', Object.fromEntries(formData));
                resolve();
            }, 1500);
        });
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Intersection Observer for animations
    initIntersectionObserver() {
        const animatedElements = document.querySelectorAll(
            '.about-text, .info-card, .timeline-item, .project-card, .contact-method'
        );
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.OBSERVER_THRESHOLD,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Back to Top Button
    initBackToTop() {
        const backToTopButton = document.getElementById('back-to-top');
        
        if (!backToTopButton) return;
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top
        backToTopButton.addEventListener('click', () => {
            this.scrollToTop();
        });
    }
    
    // Smooth Scrolling
    initSmoothScrolling() {
        // Handle scroll indicator in hero section
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    this.scrollToSection(aboutSection);
                }
            });
        }
    }

    initOfflineSupport() {
        const connectionStatus = document.getElementById('connection-status');
        if (!connectionStatus) return;
        this.wasOffline = !navigator.onLine;

        const updateConnectionStatus = () => {
            const isOnline = navigator.onLine;

            connectionStatus.classList.remove('online', 'offline', 'visible');

            if (!isOnline) {
                connectionStatus.classList.add('offline', 'visible');
                connectionStatus.innerHTML = '<i class="fas fa-cloud-download-alt" aria-hidden="true"></i><span>You are offline. Showing cached portfolio content.</span>';
                this.wasOffline = true;
            } else {
                if (this.wasOffline) {
                    connectionStatus.classList.add('online', 'visible');
                    connectionStatus.innerHTML = '<i class="fas fa-wifi" aria-hidden="true"></i><span>You are back online.</span>';
                    window.setTimeout(() => {
                        connectionStatus.classList.remove('visible');
                    }, 2500);
                }
                this.wasOffline = false;
            }
        };

        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);
        updateConnectionStatus();

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then((registration) => {
                        console.log('✅ Service worker registered:', registration.scope);
                    })
                    .catch((error) => {
                        console.warn('Service worker registration failed:', error);
                    });
            });
        }
    }
    
    scrollToSection(targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Notification System
    showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Notification content
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
            font-family: var(--font-primary);
            font-size: 0.9rem;
        `;
        
        // Notification content styles
        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        // Close button styles
        const closeButton = notification.querySelector('.notification-close');
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        `;
        
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.opacity = '1';
        });
        
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.opacity = '0.8';
        });
        
        // Add to document
        document.body.appendChild(notification);
        
        // Close button functionality
        closeButton.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                this.removeNotification(notification);
            }
        }, duration);
    }
    
    removeNotification(notification) {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || colors.info;
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }
    
    static generateId(prefix = 'id') {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    static isMobile() {
        return window.innerWidth <= 768;
    }
    
    static isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }
    
    static isDesktop() {
        return window.innerWidth > 1024;
    }
}

// Performance Monitor
class PerformanceMonitor {
    static init() {
        if ('web-vital' in window) {
            // Monitor Core Web Vitals if library is loaded
            this.monitorWebVitals();
        }
        
        // Monitor basic performance metrics
        window.addEventListener('load', () => {
            this.logPerformanceMetrics();
        });
    }
    
    static logPerformanceMetrics() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            
            console.group('📊 Performance Metrics');
            console.log(`DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
            console.log(`Page Load Complete: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
            console.log(`Total Load Time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
            console.groupEnd();
        }
    }
    
    static monitorWebVitals() {
        // Placeholder for Web Vitals monitoring
        // Implement when web-vitals library is included
        console.log('🔍 Web Vitals monitoring ready');
    }
}

// Error Handler
class ErrorHandler {
    static init() {
        window.addEventListener('error', this.handleError);
        window.addEventListener('unhandledrejection', this.handlePromiseRejection);
    }
    
    static handleError(event) {
        console.error('🚨 JavaScript Error:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });
        
        // In production, you might want to send this to an error reporting service
        if (window.location.hostname !== 'localhost') {
            // Example: Send to error reporting service
            // this.reportError(event);
        }
    }
    
    static handlePromiseRejection(event) {
        console.error('🚨 Unhandled Promise Rejection:', event.reason);
        
        // Prevent the default browser behavior
        event.preventDefault();
    }
    
    static reportError(error) {
        // Implement error reporting to service like Sentry, LogRocket, etc.
        console.log('📡 Reporting error to service...', error);
    }
}

// Modern Interaction Enhancements
class ModernEnhancements {
    constructor() {
        this.initParallaxEffect();
        this.initMouseTracker();
        this.initModernAnimations();
        this.initPerformanceOptimizations();
        this.initStarfield();
        this.initTiltCards();
    }

    // Subtle parallax effect for hero section
    initParallaxEffect() {
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroContent) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                
                if (scrolled < window.innerHeight) {
                    heroContent.style.transform = `translateY(${rate}px)`;
                }
            });
        }
    }

    // Modern mouse tracking for floating elements
    initMouseTracker() {
        const floatingIcons = document.querySelectorAll('.floating-icon');
        
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            floatingIcons.forEach((icon, index) => {
                const speed = (index + 1) * 0.02;
                const x = (mouseX * speed) - (window.innerWidth / 2) * speed;
                const y = (mouseY * speed) - (window.innerHeight / 2) * speed;
                
                icon.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // Enhanced animations with Intersection Observer
    initModernAnimations() {
        const animatedElements = document.querySelectorAll(
            '.skill-category, .project-card, .contact-method, .info-card'
        );

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                }
            });
        }, observerOptions);

        animatedElements.forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px) scale(0.9)';
            el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(el);
        });
    }

    // Performance optimizations
    initPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
    }

    preloadCriticalResources() {
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
        ];

        criticalFonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = font;
            document.head.appendChild(link);
        });
    }

        // Futuristic starfield background (canvas)
        initStarfield() {
            const canvas = document.getElementById('bg-stars');
            if (!canvas) return;

            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) return;

            const ctx = canvas.getContext('2d');
            let stars = [];
            let rafId = null;
            let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

            function resize() {
                width = canvas.clientWidth;
                height = canvas.clientHeight;
                canvas.width = Math.floor(width * dpr);
                canvas.height = Math.floor(height * dpr);
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                // Re-seed stars based on area
                const density = Math.min(0.12, Math.max(0.06, (width * height) / (1200 * 800) * 0.08));
                const count = Math.floor((width * height) * density / 1200);
                stars = new Array(count).fill(0).map(() => ({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    r: Math.random() * 1.8 + 0.2,
                    s: Math.random() * 0.6 + 0.1, // speed
                    a: Math.random() * 0.6 + 0.4 // alpha
                }));
            }

            function draw() {
                ctx.clearRect(0, 0, width, height);
                // subtle gradient tint
                const grad = ctx.createLinearGradient(0, 0, width, height);
                grad.addColorStop(0, 'rgba(99,102,241,0.08)');
                grad.addColorStop(1, 'rgba(236,72,153,0.06)');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, height);

                // stars
                for (let i = 0; i < stars.length; i++) {
                    const p = stars[i];
                    p.y += p.s; // drift down
                    if (p.y > height) { p.y = -2; p.x = Math.random() * width; }
                    ctx.globalAlpha = p.a;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = '#ffffff';
                    ctx.fill();
                    // tiny twinkle
                    if ((i % 20) === 0) {
                        ctx.globalAlpha = Math.min(0.35, p.a);
                        ctx.fillStyle = 'rgba(99,102,241,0.35)';
                        ctx.fillRect(p.x - 0.5, p.y - 0.5, 1, 1);
                    }
                }
                ctx.globalAlpha = 1;
                rafId = requestAnimationFrame(draw);
            }

            const onVisibility = () => {
                if (document.hidden) {
                    if (rafId) cancelAnimationFrame(rafId);
                    rafId = null;
                } else if (!rafId) {
                    rafId = requestAnimationFrame(draw);
                }
            };

            window.addEventListener('resize', resize);
            document.addEventListener('visibilitychange', onVisibility);
            resize();
            rafId = requestAnimationFrame(draw);
        }

        // 3D tilt for cards
        initTiltCards() {
            const cards = document.querySelectorAll('.project-card, .skill-category');
            const maxTilt = 8; // degrees
            const perspective = 700;
            cards.forEach(card => {
                card.style.transformStyle = 'preserve-3d';
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const cx = rect.width / 2;
                    const cy = rect.height / 2;
                    const rx = ((y - cy) / cy) * -maxTilt;
                    const ry = ((x - cx) / cx) * maxTilt;
                    card.style.transition = 'transform 120ms ease-out';
                    card.style.transform = `perspective(${perspective}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transition = 'transform 300ms ease';
                    card.style.transform = 'perspective(1px) translateZ(0)';
                });
            });
        }
}

// Initialize everything when script loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize error handling
    ErrorHandler.init();
    
    // Initialize performance monitoring
    PerformanceMonitor.init();
    
    // Initialize main application
    window.portfolioApp = new PortfolioApp();
    
    // Initialize modern enhancements
    const modernEnhancements = new ModernEnhancements();
    
    // Make utilities globally available
    window.Utils = Utils;
    
    // Add CSS animation styles if not already present
    if (!document.querySelector('#dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .field-error {
                animation: fadeInUp 0.3s ease-out;
            }
            
            .notification {
                font-weight: 500;
                border-left: 4px solid rgba(255,255,255,0.3);
            }
            
            .notification-content i {
                font-size: 1.1rem;
            }
            
            .notification-close:hover {
                background: rgba(255,255,255,0.1) !important;
            }
        `;
        document.head.appendChild(style);
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, Utils, PerformanceMonitor, ErrorHandler };
}

// Console welcome message
console.log(`
%c
🚀 Welcome to Naseem Akhtar's Portfolio!
%c
Built with modern web technologies:
• Vanilla JavaScript (ES6+)
• CSS Grid & Flexbox
• Intersection Observer API
• Local Storage API
• Performance Monitoring

Feel free to explore the code!
GitHub: https://github.com/naseem7888

%c`, 
'color: #667eea; font-size: 16px; font-weight: bold;',
'color: #333; font-size: 12px;',
'color: #999; font-size: 10px;'
);