const fs = require('fs');

try {
    const html = fs.readFileSync('dist/bundle-report.html', 'utf8');

    // Try to extract the chart data
    const dataMatch = html.match(/window\.chartData\s*=\s*(\[.+?\]);/s);

    if (!dataMatch) {
        console.log('Could not find chart data in bundle report.');
        process.exit(1);
    }

    const data = JSON.parse(dataMatch[1]);

    function analyzeNode(node, results, depth = 0) {
        if (node.statSize) {
            const sizeKB = Math.round(node.statSize / 1024);
            if (sizeKB > 15 && depth < 3) {
                results.push({
                    label: node.label,
                    size: sizeKB,
                    depth: depth
                });
            }
        }

        if (node.groups) {
            node.groups.forEach(child => analyzeNode(child, results, depth + 1));
        }
    }

    const results = [];
    data.forEach(root => analyzeNode(root, results));

    // Sort by size
    results.sort((a, b) => b.size - a.size);

    console.log('\n📦 BUNDLE COMPOSITION ANALYSIS (modules > 15 KB):\n');
    console.log('='.repeat(80));

    results.slice(0, 20).forEach(item => {
        const indent = '  '.repeat(item.depth);
        console.log(`${indent}${item.label.padEnd(50 - indent.length)} ${item.size.toString().padStart(6)} KB`);
    });

    console.log('='.repeat(80));

    // Calculate total
    const totalSize = data[0].statSize;
    console.log(`\nTotal bundle size: ${Math.round(totalSize / 1024)} KB`);

} catch (e) {
    console.error('Error analyzing bundle:', e.message);
    process.exit(1);
}
