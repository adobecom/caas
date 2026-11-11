module.exports = {
    extends: ['@commitlint/config-conventional'],
    plugins: [
        {
            rules: {
                'jira-ticket-in-scope': ({scope}) => {
                    const pattern = /^mwpw-\d+$/i;
                    const hasValidTicket = pattern.test(scope || '');
                    return [
                        hasValidTicket,
                        'Scope must contain JIRA ticket (e.g., feat(MWPW-123): message; case-insensitive)',
                    ];
                },
            },
        },
    ],
    rules: {
        'scope-empty': [2, 'never'], // scope is required
        'jira-ticket-in-scope': [2, 'always'], // enforce our custom rule
    },
    defaultIgnores: false,
};
