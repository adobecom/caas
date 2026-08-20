const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

async function collectMetrics() {
    // Check for both PR merge and direct push to main
    const isMergeContext = (
        // If we have PR_NUMBER, treat it as a PR merge
        process.env.PR_NUMBER ||
        // Otherwise use the original conditions
        (process.env.GITHUB_EVENT_NAME === 'pull_request' &&
            process.env.GITHUB_EVENT_ACTION === 'closed' &&
            process.env.GITHUB_PULL_REQUEST_MERGED === 'true') ||
        (process.env.GITHUB_EVENT_NAME === 'push' &&
            process.env.GITHUB_REF === 'refs/heads/main')
    );

    // Always use PR information if available
    const prInfo = process.env.PR_NUMBER ? {
        number: process.env.PR_NUMBER,
        title: process.env.PR_TITLE
    } : {
        number: process.env.GITHUB_SHA?.substring(0, 7) || 'unknown',
        title: 'Direct push to main'
    };

    console.log('Environment variables:', {
        GITHUB_EVENT_NAME: process.env.GITHUB_EVENT_NAME,
        GITHUB_EVENT_ACTION: process.env.GITHUB_EVENT_ACTION,
        GITHUB_PULL_REQUEST_MERGED: process.env.GITHUB_PULL_REQUEST_MERGED,
        GITHUB_REF: process.env.GITHUB_REF,
        PR_NUMBER: process.env.PR_NUMBER,
        PR_TITLE: process.env.PR_TITLE
    });
    console.log('Is merge context?', isMergeContext);

    let metricsOutput;
    try {
        // Run web-vitals-check.js
        const url = 'https://adobecom.github.io/caas/';
        const command = `node ${path.join(process.cwd(), 'scripts', 'web-vitals-check.js')} "${url}" --mobile`;

        try {
            console.log('Running web-vitals-check.js...');
            const { stdout, stderr } = await execPromise(command);
            console.log('Web Vitals Check Output:', stdout);
            if (stderr) console.log('Stderr:', stderr);
            metricsOutput = stdout;
        } catch (error) {
            // Still capture output even when check fails
            console.log('Web Vitals Check Output:', error.stdout);
            if (error.stderr) console.log('Stderr:', error.stderr);
            metricsOutput = error.stdout;

            // Only exit for failures in non-merge context
            if (!isMergeContext) {
                console.log('Exiting due to poor metrics in non-merge context');
                process.exit(1);
            }
        }

        // Process metrics for history in merge context
        if (isMergeContext) {
            console.log('Processing metrics in merge context...');
            const currentMetricsPath = path.join(process.cwd(), '.github', 'current-metrics.json');
            console.log('Looking for current metrics at:', currentMetricsPath);

            if (fs.existsSync(currentMetricsPath)) {
                console.log('Found current metrics file');
                const currentMetrics = JSON.parse(fs.readFileSync(currentMetricsPath, 'utf8'));

                const record = {
                    date: new Date().toISOString(),
                    pr: prInfo,
                    metrics: currentMetrics.metrics
                };

                // Ensure .github directory exists
                const githubDir = path.join(process.cwd(), '.github');
                if (!fs.existsSync(githubDir)) {
                    console.log('Creating .github directory');
                    fs.mkdirSync(githubDir, { recursive: true });
                }

                // Update history file
                const historyPath = path.join(process.cwd(), 'web-vitals-history.json');
                console.log('Updating history at:', historyPath);
                let history = [];

                if (fs.existsSync(historyPath)) {
                    try {
                        const content = fs.readFileSync(historyPath, 'utf8');
                        history = JSON.parse(content);
                        console.log('Loaded existing history with', history.length, 'entries');
                    } catch (error) {
                        console.warn('Error reading history file, starting fresh:', error.message);
                    }
                } else {
                    console.log('No existing history file, creating new one');
                }

                if (!Array.isArray(history)) {
                    console.log('History was not an array, resetting');
                    history = [];
                }

                history.push(record);
                fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
                console.log('Successfully updated metrics history file');
            } else {
                console.warn('No current metrics file found at:', currentMetricsPath);
            }
        }

    } catch (error) {
        console.error('Fatal error in collectMetrics:', error);
        // Don't exit with error - let GitHub action continue
        process.exit(0);
    }
}

collectMetrics();
