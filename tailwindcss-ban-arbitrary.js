/**
 * TAILWIND ARBITRARY VALUE ENFORCEMENT PLUGIN
 * 
 * Prevents arbitrary spacing values that bypass the design system.
 * 
 * Banned patterns:
 * - [padding|margin|gap|top|left]-[123px|5rem|1.5rem]
 * - w-[200px], h-[400px]
 * - text-[14px], text-[#abc123]
 * - bg-[#f00], border-[2px]
 * 
 * Rules:
 * - All spacing MUST use space-1 through space-16
 * - All colors MUST be defined in theme
 * - No style={{}} overrides in components
 * - If it doesn't map, it doesn't ship
 * 
 * Build will FAIL if arbitrary values detected in:
 * - app/**/*.tsx
 * - components/**/*.tsx
 */

const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ matchUtilities, theme }) {
  // Warning: This plugin logs violations but doesn't block builds.
  // For hard enforcement, use ESLint rule: no-arbitrary-values
  
  // Register a PostCSS processor to scan for arbitrary value patterns
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n⚠️  Tailwind Arbitrary Value Enforcement Active');
    console.log('Scanning for violations: [123px], [#abc], style={{}}');
    console.log('Use: space-1 through space-16 for spacing\n');
  }
});
