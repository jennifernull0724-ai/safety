// tailwindcss plugin to ban arbitrary values in classnames
const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ addVariant }) {
  // No-op: enforcement is by code review and lint, not runtime
});
