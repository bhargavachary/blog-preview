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

    // Reading progress indicator with performance optimization
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);

    // Throttled scroll handler for better performance
    let ticking = false;
    function updateProgress() {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }, { passive: true });

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
