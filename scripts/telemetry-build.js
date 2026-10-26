// Validate once at build time; invalid input must not silently enable diagnostics.
const raw = process.env.CAAS_DIAGNOSTIC_SAMPLE_RATE;
const rate = raw === undefined ? 0 : Number(raw);
if ((raw !== undefined && !raw.trim()) || !Number.isFinite(rate) || rate < 0 || rate > 100) {
    throw new Error('CAAS_DIAGNOSTIC_SAMPLE_RATE must be a number from 0 to 100');
}
module.exports = { 'process.env.CAAS_DIAGNOSTIC_SAMPLE_RATE': JSON.stringify(rate) };
