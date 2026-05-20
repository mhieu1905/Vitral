const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./app');
let fixedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('SafeAreaView')) return;
  
  // We need to parse import statements carefully
  // Find all import {...} from 'react-native'
  // Regex: import \s* \{ (anything except }) \} \s* from \s* ['"]react-native['"]
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]react-native['"]/g;
  
  let modified = false;
  let newContent = content;

  let match;
  while ((match = importRegex.exec(content)) !== null) {
      let importBlock = match[1];
      if (importBlock.includes('SafeAreaView')) {
          modified = true;
          
          // Remove SafeAreaView from the destructured block
          // It could be: SafeAreaView, or , SafeAreaView, or , SafeAreaView
          // Split by comma, trim, filter, join
          let imports = importBlock.split(',').map(s => s.trim()).filter(s => s !== '');
          let filteredImports = imports.filter(s => s !== 'SafeAreaView');
          
          let fullImport = match[0];
          let replacement = '';
          
          if (filteredImports.length > 0) {
              // Reconstruct the import block (try to maintain multiline roughly, but simple join is safer)
              replacement = `import {\n  ${filteredImports.join(', ')}\n} from 'react-native'`;
          }
          
          // Prepend the new import
          replacement = `import { SafeAreaView } from 'react-native-safe-area-context';\n` + replacement;
          
          newContent = newContent.replace(fullImport, replacement);
      }
  }

  if (modified) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Fixed: ' + file);
      fixedCount++;
  }
});

console.log('Total fixed: ' + fixedCount);
