// purgecss.config.js
module.exports = {
  // 1. Files to SCAN for class usage (Jekyll's output)
  content: [
    '_site/**/*.html', 
    '_site/**/*.js' // Include JavaScript if you dynamically inject classes
  ],
  // 2. The CSS file to PROCESS (must be the path *after* Jekyll builds it)
  css: [
    '_site/css/bootstrap.min.css' // **Verify this path and filename!**
  ],
  // 3. The path and filename for the final PURGED output
  output: '_site/css/purged-bootstrap.min.css'
  // You can add 'safelist', 'blocklist', etc. here later.
}