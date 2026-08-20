const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Device settings matching Google's testing parameters
const DEVICES = {
    mobile: {
        name: 'Moto G4',
        userAgent: 'Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Mobile Safari/537.36',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    desktop: {
        name: 'Desktop Chrome',
        viewport: {
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: false,
            isLandscape: true,
        },
    },
};

// Network presets with fallbacks
const NETWORK_PRESETS = {
    ideal: {
        downloadThroughput: 4 * 1024 * 1024 / 8, // 4 Mbps
        uploadThroughput: 2 * 1024 * 1024 / 8, // 2 Mbps
        latency: 100, // 100ms
    },
    target: {
        downloadThroughput: 1.6 * 1024 * 1024 / 8, // Google's target 1.6 Mbps
        uploadThroughput: 750 * 1024 / 8, // 750 Kbps
        latency: 150, // 150ms
    },
};

// Thresholds for metrics (based on Google's standards)
const THRESHOLDS = {
    lcp: { good: 2500, poor: 4000 },
    fid: { good: 100, poor: 300 },
    cls: { good: 0.1, poor: 0.25 },
};

async function simulateUserInteractions(page) {
    console.log('Simulating user interactions...');
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    try {
        // Simulate scrolling behavior
        await page.evaluate(async () => {
            const scroll = async () => {
                const totalHeight = document.body.scrollHeight;
                const viewHeight = window.innerHeight;
                for (let i = 0; i <= totalHeight; i += viewHeight / 2) {
                    window.scrollTo(0, i);
                    await new Promise(r => setTimeout(r, 100));
                }
                window.scrollTo(0, 0);
            };
            await scroll();
        });

        await wait(1000);

        // Find and click interactive elements
        const clickableElements = await page.evaluate(() => {
            const elements = document.querySelectorAll('button, a, input[type="button"], [role="button"], [role="link"]');
            return Array.from(elements, el => ({
                tagName: el.tagName,
                x: el.getBoundingClientRect().x,
                y: el.getBoundingClientRect().y,
                visible: el.offsetParent !== null,
            })).filter(el => el.visible);
        });

        // Click first 3 visible interactive elements
        for (const element of clickableElements.slice(0, 3)) {
            try {
                await page.mouse.click(element.x + 5, element.y + 5);
                await wait(500);
            } catch (e) {
                console.log(`Couldn't click element: ${element.tagName}`);
            }
        }
    } catch (error) {
        console.log('Error during interactions:', error.message);
    }
}
async function measureWebVitals(url, options = {}) {
    const {
        device = 'desktop',
        network = NETWORK_PRESETS.ideal,
    } = options;

    const isCI = process.env.CI === 'true';

    const browserOptions = {
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--enable-precise-memory-info',
            ...(isCI ? [
                '--disable-software-rasterizer',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
            ] : []),
        ],
    };

    if (process.platform === 'darwin' && !isCI) {
        browserOptions.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }

    console.log(`Starting test with device: ${device}`);

    let browser;
    try {
        browser = await puppeteer.launch(browserOptions);
        const page = await browser.newPage();

        page.setDefaultNavigationTimeout(120000);
        page.setDefaultTimeout(120000);

        // Setup network conditions
        const client = await page.target().createCDPSession();
        await client.send('Network.enable');
        await client.send('Network.emulateNetworkConditions', {
            offline: false,
            ...network,
            connectionType: 'cellular4g',
        });

        // Setup device emulation
        const deviceSettings = DEVICES[device];
        await page.setUserAgent(deviceSettings.userAgent || '');
        await page.setViewport(deviceSettings.viewport);

        await page.setCacheEnabled(false);

        // Initialize web vitals data collection
        await page.evaluateOnNewDocument(() => {
            window.webVitalsData = {
                lcp: null,
                fid: null,
                cls: null,
            };

            window.logMetric = (name, value) => {
                window.webVitalsData[name] = value;
            };
        });

        console.log('Loading page...');
        await page.goto(url, {
            waitUntil: ['networkidle0', 'domcontentloaded', 'load'],
            timeout: 120000,
        });

        // Load web-vitals library with retries
        let retries = 3;
        while (retries > 0) {
            try {
                await page.addScriptTag({
                    url: 'https://unpkg.com/web-vitals',
                    timeout: 30000,
                });
                break;
            } catch (error) {
                console.log(`Failed to load web-vitals library, retries left: ${retries - 1}`);
                retries--;
                if (retries === 0) throw error;
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        // Setup metrics collection
        await page.evaluate(() => {
            webVitals.onLCP((lcp) => { window.logMetric('lcp', lcp.value); });
            webVitals.onFID((fid) => { window.logMetric('fid', fid.value); });
            webVitals.onCLS((cls) => { window.logMetric('cls', cls.value); });
        });

        await simulateUserInteractions(page);

        // Wait for metrics to stabilize
        const waitTime = isCI ? 15000 : 10000;
        console.log(`Waiting ${waitTime}ms for metrics to stabilize...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));

        const metrics = await page.evaluate(() => window.webVitalsData);
        return metrics;

    } catch (error) {
        if (error.name === 'TimeoutError') {
            console.error('Page load timed out. Consider adjusting network conditions or timeout values.');
            throw new Error(`Timeout loading ${url}: ${error.message}`);
        }
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function measureWithFallback(url, options) {
    try {
        console.log('Attempting measurement with target network conditions...');
        return await measureWebVitals(url, { ...options, network: NETWORK_PRESETS.target });
    } catch (error) {
        if (error.message.includes('Timeout')) {
            console.log('Timeout with target conditions, falling back to ideal conditions...');
            return await measureWebVitals(url, { ...options, network: NETWORK_PRESETS.ideal });
        }
        throw error;
    }
}
async function main() {
    const args = process.argv.slice(2);
    const url = args[0];

    if (!url) {
        console.error('Please provide a URL to test');
        console.error('Usage: node web-vitals-check.js <url> [--desktop-only]');
        process.exit(1);
    }

    try {
        console.log(`Starting Web Vitals check for ${url}`);

        // Run measurements
        const metrics = await measureWithFallback(url, {
            device: args.includes('--mobile') ? 'mobile' : 'desktop'
        });

        // Create .github directory if it doesn't exist
        const githubDir = path.join(process.cwd(), '.github');
        if (!fs.existsSync(githubDir)) {
            fs.mkdirSync(githubDir, { recursive: true });
        }

        // Save metrics
        const record = {
            date: new Date().toISOString(),
            metrics,
        };

        fs.writeFileSync(
            path.join(githubDir, 'current-metrics.json'),
            JSON.stringify(record, null, 2)
        );

        // Output results
        console.log('\nResults:');
        console.log('-'.repeat(50));
        Object.entries(metrics).forEach(([metric, value]) => {
            if (value !== null) {
                const threshold = THRESHOLDS[metric];
                let status = '➖';
                if (threshold) {
                    if (value <= threshold.good) status = '✅';
                    else if (value >= threshold.poor) status = '❌';
                }
                console.log(`${metric.toUpperCase()}: ${value.toFixed(2)} ${status}`);
            } else {
                console.log(`${metric.toUpperCase()}: Not available ⚠️`);
            }
        });

        // Exit based on success
        const hasFailures = Object.entries(metrics).some(([metric, value]) => {
            if (value === null) return false;
            const threshold = THRESHOLDS[metric];
            return threshold && value >= threshold.poor;
        });

        if (hasFailures) {
            console.error('\n❌ Some Core Web Vitals metrics are poor');
            process.exit(1);
        } else {
            console.log('\n✅ Core Web Vitals check completed');
            process.exit(0);
        }

    } catch (error) {
        console.error('Error running Web Vitals check:', error);
        if (error.message.includes('Timeout')) {
            console.log('\nSuggestions:');
            console.log('1. Check if the URL is accessible');
            console.log('2. Consider increasing timeout values');
            console.log('3. Verify network connectivity');
        }
        process.exit(1);
    }
}

main();
