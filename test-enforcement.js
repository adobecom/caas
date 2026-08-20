const enforceTestRequirements = async ({ github, context, core }) => {
    try {
        const { data: files } = await github.rest.pulls.listFiles({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: context.issue.number,
        });

        const prTitle = context.payload.pull_request.title;
        // Strip the scope so 'feat(mwpw-123): x' parses as 'feat'.
        // Previously 'feat(mwpw-123)' !== 'feat' meant every scoped title
        // (which check-pr-title requires) bypassed enforcement entirely.
        const commitType = prTitle.split(':')[0].split('(')[0].trim().toLowerCase();

        // Add debug logs
        core.info(`PR Title: ${prTitle}`);
        core.info(`Commit Type: ${commitType}`);
        core.info(`Files changed: ${JSON.stringify(files.map(f => f.filename))}`);

        const hasNewComponent = files.some(f => {
            const isComponent = f.filename.includes('/components/');
            const isNew = f.status === 'added';
            // Add debug logs
            core.info(`Checking file: ${f.filename}`);
            core.info(`Is component? ${isComponent}`);
            core.info(`Is new? ${isNew}`);
            return isComponent && isNew;
        });

        const hasIntegrationTest = files.some(f =>
            f.filename.includes('.e2e.js'),
        );

        const hasUnitTest = files.some(f =>
            f.filename.includes('.spec.js'),
        );

        // Add debug logs
        core.info(`Has new component? ${hasNewComponent}`);
        core.info(`Has integration test? ${hasIntegrationTest}`);
        core.info(`Has unit test? ${hasUnitTest}`);

        if (commitType === 'feat' && hasNewComponent && !hasIntegrationTest) {
            core.setFailed('New feature components require integration tests');
            return;
        }

        if (commitType === 'feat' && hasNewComponent && !hasUnitTest) {
            core.setFailed('New feature components require unit tests');
            return;
        }

        core.info('Test requirements check passed');
    } catch (error) {
        core.setFailed(error.message);
    }
};

module.exports = enforceTestRequirements;
