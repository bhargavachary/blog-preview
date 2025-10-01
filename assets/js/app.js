// Performance optimizations for BhargavAchary.in
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced performance monitoring
    const performanceMonitor = {
        metrics: {},
        
        // Track Core Web Vitals
        trackCoreWebVitals() {
            if ('PerformanceObserver' in window) {
                // Track Largest Contentful Paint (LCP)
                new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.lcp = lastEntry.startTime;
                    console.log('LCP:', lastEntry.startTime);
                    
                    // Send to analytics if available
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'web_vitals', {
                            'event_category': 'Web Vitals',
                            'event_label': 'LCP',
                            'value': Math.round(lastEntry.startTime)
                        });
                    }
                }).observe({ type: 'largest-contentful-paint', buffered: true });

                // Track First Input Delay (FID)
                new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    entries.forEach(entry => {
                        const fid = entry.processingStart - entry.startTime;
                        this.metrics.fid = fid;
                        console.log('FID:', fid);
                        
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'web_vitals', {
                                'event_category': 'Web Vitals',
                                'event_label': 'FID',
                                'value': Math.round(fid)
                            });
                        }
                    });
                }).observe({ type: 'first-input', buffered: true });

                // Track Cumulative Layout Shift (CLS)
                let clsValue = 0;
                new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    this.metrics.cls = clsValue;
                    console.log('CLS:', clsValue);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'web_vitals', {
                            'event_category': 'Web Vitals',
                            'event_label': 'CLS',
                            'value': Math.round(clsValue * 1000)
                        });
                    }
                }).observe({ type: 'layout-shift', buffered: true });
            }
        },
        
        // Track custom performance metrics
        trackCustomMetrics() {
            // Time to first byte
            if (window.performance && window.performance.timing) {
                const ttfb = window.performance.timing.responseStart - window.performance.timing.requestStart;
                this.metrics.ttfb = ttfb;
                console.log('TTFB:', ttfb);
            }
            
            // DOM content loaded time
            window.addEventListener('DOMContentLoaded', () => {
                const domTime = performance.now();
                this.metrics.domContentLoaded = domTime;
                console.log('DOM Content Loaded:', domTime);
            });
            
            // Window load time
            window.addEventListener('load', () => {
                const loadTime = performance.now();
                this.metrics.windowLoad = loadTime;
                console.log('Window Load:', loadTime);
            });
        }
    };
    
    // Initialize performance monitoring
    performanceMonitor.trackCoreWebVitals();
    performanceMonitor.trackCustomMetrics();

    // Advanced lazy loading with intersection observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        // Track image loading performance
                        const startTime = performance.now();
                        
                        // Preload image for smoother transition
                        const imageLoader = new Image();
                        imageLoader.onload = () => {
                            const loadTime = performance.now() - startTime;
                            console.log(`Image loaded in ${loadTime}ms:`, img.dataset.src);
                            
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            img.classList.remove('lazy-image');
                            
                            // Track successful image loads
                            if (typeof gtag !== 'undefined') {
                                gtag('event', 'image_load', {
                                    'event_category': 'Performance',
                                    'event_label': 'Lazy Load Success',
                                    'value': Math.round(loadTime)
                                });
                            }
                        };
                        imageLoader.onerror = () => {
                            console.error('Failed to load image:', img.dataset.src);
                            // Track failed image loads
                            if (typeof gtag !== 'undefined') {
                                gtag('event', 'image_error', {
                                    'event_category': 'Performance',
                                    'event_label': 'Lazy Load Error'
                                });
                            }
                        };
                        imageLoader.src = img.dataset.src;
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            // Load images 50px before they come into view
            rootMargin: '50px',
            threshold: 0.01
        });

        // Observe all lazy images
        document.querySelectorAll('img[data-src], .lazy-image').forEach(img => {
            imageObserver.observe(img);
        });

        // Prefetch links on hover for faster navigation
        const linkObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = entry.target;
                    link.addEventListener('mouseenter', prefetchLink, { once: true });
                    linkObserver.unobserve(link);
                }
            });
        });

        document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]').forEach(link => {
            linkObserver.observe(link);
        });
    }

    // Prefetch link on hover with performance tracking
    function prefetchLink(e) {
        const startTime = performance.now();
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = e.target.href;
        link.onload = () => {
            const prefetchTime = performance.now() - startTime;
            console.log(`Link prefetched in ${prefetchTime}ms:`, e.target.href);
        };
        document.head.appendChild(link);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Track anchor link usage
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'anchor_click', {
                        'event_category': 'Navigation',
                        'event_label': this.getAttribute('href')
                    });
                }
            }
        });
    });

    // ===================================
    // MODERN ANIMATION ENGINE
    // ===================================

    // Scroll-driven animations with IntersectionObserver
    const scrollReveal = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add visible class with stagger delay
                setTimeout(() => {
                    entry.target.classList.add('scroll-reveal-visible');
                }, index * 50); // Stagger by 50ms

                scrollReveal.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe all elements with scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        scrollReveal.observe(el);
    });

    // Auto-add scroll-reveal to cards and sections
    document.querySelectorAll('.card, .section').forEach((el, index) => {
        el.classList.add('scroll-reveal', 'reveal-fade-up', 'stagger-item');
    });

    // Staggered card entrance animations
    document.querySelectorAll('.card').forEach((card, index) => {
        card.style.animationDelay = `${index * 100}ms`;
        card.classList.add('animate-in');
    });

    // Reading progress indicator with performance optimization
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);

    // Navbar scroll effect (frosted glass)
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    // Throttled scroll handler for better performance
    let ticking = false;
    function updateProgress() {
        const scrollY = window.scrollY;
        const scrollPercent = (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';

        // Add scrolled class to navbar
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }, { passive: true });

    // Parallax effect for hero sections
    const parallaxHero = document.querySelector('.hero.parallax-enabled');
    if (parallaxHero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroBody = parallaxHero.querySelector('.hero-body');
            if (heroBody) {
                heroBody.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        }, { passive: true });
    }

    // Material Design ripple effect on buttons and cards
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            top: ${y}px;
            left: ${x}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        `;

        // Add ripple animation
        const style = document.createElement('style');
        if (!document.querySelector('#ripple-animation-style')) {
            style.id = 'ripple-animation-style';
            style.textContent = `
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // Add ripple to buttons and cards
    document.querySelectorAll('.button, .card, .navbar-item').forEach(el => {
        el.addEventListener('click', createRipple);
    });

    // Touch gesture support for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleGesture();
    }, { passive: true });

    function handleGesture() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped up
                console.log('Swipe up detected');
            } else {
                // Swiped down
                console.log('Swipe down detected');

                // Pull to refresh effect (when at top of page)
                if (window.scrollY === 0) {
                    showPullToRefresh();
                }
            }
        }
    }

    // Pull to refresh visual feedback
    function showPullToRefresh() {
        const pullIndicator = document.createElement('div');
        pullIndicator.className = 'pull-refresh pull-refresh-active';
        pullIndicator.innerHTML = '↻';
        pullIndicator.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #3273dc;
        `;
        document.body.appendChild(pullIndicator);

        setTimeout(() => {
            pullIndicator.classList.remove('pull-refresh-active');
            setTimeout(() => pullIndicator.remove(), 300);
        }, 1000);
    }

    // Hover effect enhancement for cards with 3D tilt
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-8px)
                scale(1.02)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Keyboard navigation enhancements
    let focusableElements = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    let firstFocusable = document.querySelectorAll(focusableElements)[0];
    let lastFocusable = document.querySelectorAll(focusableElements)[document.querySelectorAll(focusableElements).length - 1];

    // Add focus visible styles dynamically
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Enhance form accessibility and track interactions
    document.querySelectorAll('input, textarea, select').forEach(field => {
        if (!field.hasAttribute('aria-label') && !field.hasAttribute('aria-labelledby')) {
            const label = document.querySelector(`label[for="${field.id}"]`);
            if (label) {
                field.setAttribute('aria-labelledby', label.id || (label.id = 'label_' + field.id));
            }
        }
        
        // Track form interactions
        field.addEventListener('focus', () => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_interaction', {
                    'event_category': 'Form',
                    'event_label': field.type || 'field'
                });
            }
        });
    });

    // Network information API for adaptive loading
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            console.log('Connection type:', connection.effectiveType);
            console.log('Downlink speed:', connection.downlink, 'Mbps');
            
            // Adapt loading strategy based on connection
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                // Disable some animations for slow connections
                document.documentElement.style.setProperty('--animation-duration', '0s');
                console.log('Animations disabled for slow connection');
            }
        }
    }

    // Error tracking
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
        if (typeof gtag !== 'undefined') {
            gtag('event', 'javascript_error', {
                'event_category': 'Error',
                'event_label': e.error.message,
                'value': 1
            });
        }
    });

    // Track page engagement
    let startTime = Date.now();
    let isVisible = true;
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page became hidden
            const engagementTime = Date.now() - startTime;
            if (typeof gtag !== 'undefined' && isVisible) {
                gtag('event', 'page_engagement', {
                    'event_category': 'Engagement',
                    'event_label': 'Time on Page',
                    'value': Math.round(engagementTime / 1000)
                });
            }
            isVisible = false;
        } else {
            // Page became visible
            startTime = Date.now();
            isVisible = true;
        }
    });
});

// Service Worker registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
                
                // Track SW registration success
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'sw_registered', {
                        'event_category': 'PWA',
                        'event_label': 'Service Worker'
                    });
                }
            })
            .catch(error => {
                console.log('SW registration failed:', error);
                
                // Track SW registration failure
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'sw_error', {
                        'event_category': 'PWA',
                        'event_label': 'Service Worker Error'
                    });
                }
            });
    });
}
