module.exports = {
  ci: {
    collect: {
      // URL to test - production GitHub Pages deployment
      url: ['https://adobecom.github.io/caas/index.html'],

      // Run 3 times and take median to reduce variance
      // Lighthouse scores naturally vary ±5 points between runs
      numberOfRuns: 3,

      settings: {
        // Performance preset optimized for speed metrics
        preset: 'perf',

        // Mobile testing (not desktop)
        // Mobile is slower and more representative of real users
        formFactor: 'mobile',

        // Simulated 4G throttling
        throttling: {
          rttMs: 40,               // Round-trip time
          throughputKbps: 10240,   // ~10 Mbps download
          cpuSlowdownMultiplier: 1 // No CPU throttling
        },

        // Mobile screen emulation (typical Android device)
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 823,
          deviceScaleFactor: 2.625,
          disabled: false
        }
      }
    },

    assert: {
      assertions: {
        // ============================================
        // OVERALL PERFORMANCE SCORE
        // ============================================
        // Weighted score of all performance metrics (0-100)
        'categories:performance': ['error', {minScore: 0.9}],

        // ============================================
        // CORE WEB VITALS (Google ranking factors)
        // ============================================

        // LCP - Largest Contentful Paint (Core Web Vital #1)
        // When main content becomes visible to user
        // Google "good": <2.5s, "poor": >4s
        // Gives 500 ms margin of error
        'largest-contentful-paint': ['error', {maxNumericValue: 3500}],

        // TBT - Total Blocking Time (Core Web Vital #2, FID proxy)
        // How long page is frozen/unresponsive during load
        // Lab measurement proxy for FID (First Input Delay)
        // Google "good": <200ms
        // Current: 0ms, keep strict threshold
        'total-blocking-time': ['error', {maxNumericValue: 200}],

        // CLS - Cumulative Layout Shift (Core Web Vital #3)
        // How much content jumps around during page load
        // Google "good": <0.1
        // Current: ~0.004, keep strict threshold
        // Prevents frustrating experiences (clicking wrong button)
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],

        // ============================================
        // BUNDLE SIZE BUDGETS (Prevent bloat)
        // ============================================

        // JavaScript bundle size limit: 600 KB (600000 bytes)
        // Current: ~130 KB, lots of headroom
        // Catches accidental addition of large libraries
        // Example: Adding full lodash would blow this budget
        'resource-summary:script:size': ['error', {maxNumericValue: 600000}],  // 600 KB

        // CSS bundle size limit: 150 KB (150000 bytes)
        // Current: ~68 KB, reasonable headroom
        // Prevents CSS bloat from unused styles
        'resource-summary:stylesheet:size': ['error', {maxNumericValue: 150000}],  // 150 KB

        // ============================================
        // ADDITIONAL METRICS (Warnings only)
        // ============================================

        // FCP - First Contentful Paint (not a Core Web Vital)
        // When ANY content first appears (text, image, anything)
        // Warning only - provides early signal before LCP
        // Google "good": <1.8s
        // Current: ~1.8s, threshold 2.0s for mobile variance
        'first-contentful-paint': ['warn', {maxNumericValue: 2000}]
      }
    },

    upload: {
      // Upload report to Google's temporary storage
      // Generates shareable link (expires after 30 days)
      // CI will post this link to PR comments
      target: 'temporary-public-storage'
    }
  }
};
