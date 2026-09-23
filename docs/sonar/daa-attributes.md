# Adobe tracking attributes in Sonar

Ticket: [MWPW-208480](https://jira.corp.adobe.com/browse/MWPW-208480).

## Status and purpose

This is a reviewable **server configuration proposal**, not an automatically
applied scanner setting. Merging this PR alone does not clear findings.
The Sonar server was unreachable while preparing it. Apply the change below
in the CaaS JavaScript Quality Profile and run a fresh analysis before closing
the associated ticket.

The export contains 41 `javascript:S6747` findings across 30 files:
20 `daa-lh`, 15 `daa-ll`, 4 `daa-im`, and 2 `daa-state`.
These names are intentional Adobe tracking attributes. The existing
`.eslintrc` already permits all four through `react/no-unknown-property.ignore`.
Sonar does not inherit that ESLint configuration.

Keep the rendered names and values intact. Renaming to `data-daa-*`, removing
attributes, hiding them inside object spreads, disabling S6747, or excluding
whole JSX files would not be an appropriate fix.

## Exact change

`daa-attributes.json` records the intended project, rule, parameter, and four
values to append. It is review data, not a file the scanner reads automatically.
`daa-findings.csv` records the 41 issue keys from the supplied export.

1. Open the CaaS project in Sonar and identify its active JavaScript Quality
   Profile and installed S6747 rule version. Record the current profile and
   existing rule parameters on the ticket before changing them.
2. Confirm the profile is editable and scoped to CaaS. If it is built-in or
   shared, have the profile administrator create an appropriate CaaS profile
   retaining the current rules and inheritance, then associate only CaaS.
   Do not alter the global default or other projects' profiles.
3. Keep `javascript:S6747` active. Append these exact names to its `whitelist`
   parameter, retaining existing values and other rule settings:

   ```text
   daa-ll,daa-lh,daa-im,daa-state
   ```

   The current SonarJS source calls the server parameter `whitelist` and maps
   it to the underlying ESLint rule's `ignore` option. Verify the installed
   rule exposes that parameter; stop if its interface differs. Do not add an
   invented `sonar.javascript.*` scanner property.
4. Run the normal Sonar analysis when the repository's `SONAR_ENABLED` switch
   is enabled and the service is reachable. Preserve existing CI controls.
5. Confirm all 41 recorded issue keys clear and unrelated unknown attributes
   are still reported. Record profile, analysis URL, revision, and results.

## Validation and rollback

No application source, dependency, or build configuration changes are required.
The advisory build workflow also runs for `docs/sonar/**` changes so this PR
receives a measured build comparison. Before PR creation, clean Node 16.13.1
baseline/head builds against `fb6b1338` produced identical `main.js`,
`main.min.js`, and `app.css` after removing the build banner. Normalized hashes
are in `daa-build.json`. Node 18.20.4 unit/coverage checks pass all 73 suites
and 921 tests, with all thresholds satisfied. Lint has zero errors and three
existing CardContent warnings.

Local validation of the underlying `react/no-unknown-property` rule confirms
all four names are accepted with the allowlist and a misspelled attribute is
still rejected. This is not a substitute for the server scan.

For rollback, restore the saved S6747 parameter value. If a separate profile
was created, reassociate CaaS with its recorded original profile. There is no
application deployment or analytics markup to roll back.

## References

- [Sonar staff guidance on the S6747 allowlist](https://community.sonarsource.com/t/jsx-typescript-unknown-property-fetchpriority-found/118786)
- [SonarJS S6747 parameter definition](https://github.com/SonarSource/SonarJS/blob/master/packages/analysis/src/jsts/rules/S6747/config.ts)
- [Current local ESLint configuration](../../.eslintrc)
