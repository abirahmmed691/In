const fs = require('fs');
const path = require('path');

const directories = ['src/pages', 'src/components'];

const replacements = [
  { match: /bg-white/g, replace: 'bg-theme-surface' },
  { match: /border-gray-100/g, replace: 'border-theme-border' },
  { match: /border-gray-200/g, replace: 'border-theme-border' },
  { match: /text-gray-900/g, replace: 'text-theme-text' },
  { match: /text-gray-800/g, replace: 'text-theme-text' },
  { match: /text-gray-700/g, replace: 'text-theme-text' },
  { match: /text-gray-600/g, replace: 'text-theme-text-muted' },
  { match: /text-gray-500/g, replace: 'text-theme-text-muted' },
  { match: /text-gray-400/g, replace: 'text-theme-text-muted opacity-60' },
  { match: /text-gray-300/g, replace: 'text-theme-text-muted opacity-30' },
  { match: /bg-gray-50/g, replace: 'bg-theme-bg' },
  { match: /bg-gray-100/g, replace: 'bg-theme-surface-hover' },
  { match: /bg-gray-900/g, replace: 'bg-theme-text' },
  { match: /bg-gray-200/g, replace: 'bg-theme-border' },
  { match: /text-black/g, replace: 'text-theme-text' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      // Exclude Admin files for this replacement just in case
      if (fullPath.includes('Admin')) continue;

      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { match, replace } of replacements) {
        content = content.replace(match, replace);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

for (const dir of directories) {
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  }
}
