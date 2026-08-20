// web-vitals-check.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SAMPLE_COUNT = 15;

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
            isLandscape: false
        }
    },
    desktop: {
        name: 'Desktop Chrome',
        viewport: {
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: false,
            isLandscape: true
        }
    }
};

// Network presets with fallbacks
const NETWORK_PRESETS = {
    ideal: {
        downloadThroughput: 4 * 1024 * 1024 / 8,    // 4 Mbps
        uploadThroughput: 2 * 1024 * 1024 / 8,      // 2 Mbps
        latency: 100                                 // 100ms
    },
    target: {
        downloadThroughput: 1.6 * 1024 * 1024 / 8,  // Google's target 1.6 Mbps
        uploadThroughput: 750 * 1024 / 8,           // 750 Kbps
        latency: 150                                 // 150ms
    }
};

// Statistics helper functions
function calculateMean(values) {
    if (!values.length) return null;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function calculateStdDev(values) {
    if (values.length < 2) return null;
    const mean = calculateMean(values);
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    const variance = calculateMean(squareDiffs);
    return Math.sqrt(variance);
}

function calculateTScore(value, mean, stdDev, n) {
    if (!mean || !stdDev) return null;
    return (value - mean) / (stdDev / Math.sqrt(n));
}

function checkBaselineExists(device) {
    const historyPath = path.join(process.cwd(), '.github', 'web-vitals-history.json');
    console.log('Looking for baseline at:', historyPath);
    try {
        if (!fs.existsSync(historyPath)) {
            console.log('File does not exist');
            return false;
        }
        const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
        console.log('Found history file, checking device:', device);
        console.log('Current history:', JSON.stringify(history, null, 2));

        // Check if we have at least one metric with enough samples
        return history[device] && (
            history[device].lcp.points.length === SAMPLE_COUNT ||
            history[device].fid.points.length === SAMPLE_COUNT ||
            history[device].cls.points.length === SAMPLE_COUNT
        );
    } catch (error) {
        console.log('Error reading baseline:', error);
        return false;
    }
}

async function handleMetricsHistory(metrics, device) {
    const historyPath = path.join(process.cwd(), '.github', 'web-vitals-history.json');
    let history = {};

    try {
        if (fs.existsSync(historyPath)) {
            history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
        }
    } catch (error) {
        console.log('No existing history found, creating new history file');
    }

    if (!history[device]) {
        history[device] = {
            lcp: { points: [], currentStats: { mean: null, stdDev: null, sampleSize: 0 } },
            fid: { points: [], currentStats: { mean: null, stdDev: null, sampleSize: 0 } },
            cls: { points: [], currentStats: { mean: null, stdDev: null, sampleSize: 0 } }
        };
    }

    const results = {
        metrics: {},
        changes: {}
    };

    for (const [metric, value] of Object.entries(metrics)) {
        if (value === null) continue;

        const metricHistory = history[device][metric];
        const currentStats = metricHistory.currentStats;

        let tScore = null;
        if (currentStats.mean !== null && currentStats.stdDev !== null) {
            tScore = calculateTScore(
                value,
                currentStats.mean,
                currentStats.stdDev,
                metricHistory.points.length
            );
        }

        let changeType = 'NO_CHANGE';
        if (tScore !== null) {
            if (value < currentStats.mean) {  // Better performance is lower value
                if (Math.abs(tScore) > 2.132) {  // 95% confidence for improvements (df=4)
                    changeType = 'IMPROVEMENT';
                }
            } else if (value > currentStats.mean) {
                if (Math.abs(tScore) > 1.533) {  // 90% confidence for regressions (df=4)
                    changeType = 'REGRESSION';
                }
            }
        }

        if (changeType === 'IMPROVEMENT' || metricHistory.points.length < SAMPLE_COUNT) {
            metricHistory.points.push({
                value,
                date: new Date().toISOString(),
                branch: process.env.GITHUB_HEAD_REF || 'main'
            });

            if (metricHistory.points.length > SAMPLE_COUNT) {
                metricHistory.points.shift();
            }

            const values = metricHistory.points.map(p => p.value);
            metricHistory.currentStats = {
                mean: calculateMean(values),
                stdDev: calculateStdDev(values),
                sampleSize: values.length,
                lastUpdated: new Date().toISOString()
            };
        }

        results.metrics[metric] = {
            value,
            mean: currentStats.mean,
            stdDev: currentStats.stdDev,
            tScore,
            changeType
        };

        results.changes[metric] = changeType;
    }

    const dir = path.dirname(historyPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

    return results;
}

async function simulateUserInteractions(page) {
    console.log('Simulating user interactions...');
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    try {
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

        const clickableElements = await page.evaluate(() => {
            const elements = document.querySelectorAll('button, a, input[type="button"], [role="button"], [role="link"]');
            return Array.from(elements, el => ({
                tagName: el.tagName,
                x: el.getBoundingClientRect().x,
                y: el.getBoundingClientRect().y,
                visible: el.offsetParent !== null
            })).filter(el => el.visible);
        });

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
        network = NETWORK_PRESETS.ideal
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
                '--disable-renderer-backgrounding'
            ] : [])
        ]
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

        const client = await page.target().createCDPSession();
        await client.send('Network.enable');
        await client.send('Network.emulateNetworkConditions', {
            offline: false,
            ...network,
            connectionType: 'cellular4g'
        });

        const deviceSettings = DEVICES[device];
        await page.setUserAgent(deviceSettings.userAgent || '');
        await page.setViewport(deviceSettings.viewport);

        await page.setCacheEnabled(false);

        await page.evaluateOnNewDocument(() => {
            window.webVitalsData = {
                lcp: null,
                fid: null,
                cls: null
            };

            window.logMetric = (name, value) => {
                window.webVitalsData[name] = value;
            };
        });

        console.log('Loading page...');
        await page.goto(url, {
            waitUntil: ['networkidle0', 'domcontentloaded', 'load'],
            timeout: 120000
        });

        let retries = 3;
        while (retries > 0) {
            try {
                await page.addScriptTag({
                    url: 'https://unpkg.com/web-vitals',
                    timeout: 30000
                });
                break;
            } catch (error) {
                console.log(`Failed to load web-vitals library, retries left: ${retries - 1}`);
                retries--;
                if (retries === 0) throw error;
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        await page.evaluate(() => {
            webVitals.onLCP(lcp => { window.logMetric('lcp', lcp.value); });
            webVitals.onFID(fid => { window.logMetric('fid', fid.value); });
            webVitals.onCLS(cls => { window.logMetric('cls', cls.value); });
        });

        await simulateUserInteractions(page);

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

const THRESHOLDS = {
    lcp: { good: 2500, poor: 4000 },
    fid: { good: 100, poor: 300 },
    cls: { good: 0.1, poor: 0.25 }
};
async function main() {
    const args = process.argv.slice(2);
    const url = args[0];

    const options = {
        initializeBaseline: args.includes('--init-baseline'),
        device: args.includes('--mobile-only') ? 'mobile' :
            args.includes('--desktop-only') ? 'desktop' : 'both'
    };

    if (!url) {
        console.error('Please provide a URL to test');
        console.error('Usage: node web-vitals-check.js <url> [--init-baseline] [--mobile-only|--desktop-only]');
        process.exit(1);
    }

    try {
        if (options.initializeBaseline) {
            const devicesToTest = options.device === 'both'
                ? ['desktop', 'mobile']
                : [options.device];

            for (const device of devicesToTest) {
                console.log(`\n${'-'.repeat(50)}`);
                console.log(`Initializing ${device} baseline with ${SAMPLE_COUNT} samples...`);
                console.log(`${'-'.repeat(50)}\n`);

                const samples = [];
                let sampleCount = 0;

                while (sampleCount < SAMPLE_COUNT) {
                    const currentSample = sampleCount + 1;
                    console.log(`\nCollecting ${device} sample ${currentSample} of ${SAMPLE_COUNT}...`);
                    try {
                        const metrics = await measureWithFallback(url, { device });
                        samples.push(metrics);
                        sampleCount++;
                        if (sampleCount < SAMPLE_COUNT) {
                            console.log('Waiting 5 seconds before next sample...');
                            await new Promise(resolve => setTimeout(resolve, 5000));
                        }
                    } catch (error) {
                        console.error(`Error collecting ${device} sample ${currentSample}:`, error);
                        continue;
                    }
                }

                console.log('\nProcessing samples...');
                for (const metrics of samples) {
                    await handleMetricsHistory(metrics, device);
                }

                console.log(`\n✅ ${device} baseline initialization complete!`);

                if (device === 'desktop' && devicesToTest.includes('mobile')) {
                    console.log('\nWaiting 10 seconds before starting mobile tests...');
                    await new Promise(resolve => setTimeout(resolve, 10000));
                }
            }

            console.log('\n🎉 All baseline initialization complete!');
            process.exit(0);
        }

        // Regular check mode
        const deviceToTest = args.includes('--mobile') ? 'mobile' : 'desktop';

        // Check if baseline exists
        if (!checkBaselineExists(deviceToTest)) {
            console.error('\n⚠️  No baseline found for', deviceToTest);
            console.error(`Please run: node web-vitals-check.js ${url} --init-baseline`);
            process.exit(1);
        }

        console.log(`Starting Web Vitals check for ${url}`);
        console.log('Test configuration:', { device: deviceToTest });

        const metrics = await measureWithFallback(url, { device: deviceToTest });
        const results = await handleMetricsHistory(metrics, deviceToTest);

        console.log('\nResults:');
        console.log('-'.repeat(50));

        let hasFailures = false;
        Object.entries(metrics).forEach(([metric, value]) => {
            if (value !== null) {
                const threshold = THRESHOLDS[metric];
                const stats = results.metrics[metric];
                const changeType = results.changes[metric];

                if (!threshold) return;

                console.log(`\n${metric.toUpperCase()}:`);
                console.log(`Current: ${value.toFixed(2)}`);
                console.log(`Baseline: μ=${stats.mean.toFixed(2)}, σ=${stats.stdDev.toFixed(2)}`);

                const icon = changeType === 'IMPROVEMENT' ? '✅' :
                    changeType === 'REGRESSION' ? '❌' : '➖';

                console.log(`T-Score: ${stats.tScore.toFixed(2)} ${icon}`);
                console.log(`Status: ${changeType}`);

                if (changeType === 'REGRESSION') {
                    hasFailures = true;
                    console.log('❌ Shows significant regression from baseline');
                }
            } else {
                console.log(`${metric.toUpperCase()}: Not available ⚠️`);
            }
        });

        console.log('\n' + '-'.repeat(50));

        if (hasFailures && process.env.CI === 'true') {
            console.error('\n❌ Core Web Vitals check failed due to significant regression');
            process.exit(1);
        } else {
            console.log('\n✅ Core Web Vitals check completed');
            if (Object.values(results.changes).includes('IMPROVEMENT')) {
                console.log('🎉 Improvements detected! Baseline updated.');
            }
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
