import * as fs from 'fs';
import * as path from 'path';

const PREFIX = 'tw-';

// Function to add the prefix to the last segment of class names
function addPrefixToTailwindClasses(classContent: string): string {
  const classList = classContent.split(' ');
  const updatedClassList = classList.map((className) => {
    // Skip if class name already starts with the prefix or negative sign followed by the prefix
    const alreadyPrefixed = (className: string): boolean => className.startsWith(PREFIX) || className.startsWith(`-${PREFIX}`);

    const splitSkippingBrackets = (value: string): string[] => {
      // Split by colon but not within brackets
      const regex = /:(?![^\[\]]*\])/g;
      return value.split(regex);
    };

    if (alreadyPrefixed(className)) return className;

    // Skip 'has-error' class name
    if (className === 'has-error') return className;

    // Skip { CLASSNAME } variable
    if (className === '{' || className === 'CLASSNAME' || className === '}') return className;

    // Add the prefix to the class name after the negative sign
    if (className.startsWith('-')) return `-${PREFIX}${className.slice(1)}`;
    if (!className.includes(':')) return `${PREFIX}${className}`;

    const classSegments = splitSkippingBrackets(className);
    const lastSegment = classSegments[classSegments.length - 1];
    if (alreadyPrefixed(lastSegment)) return className;

    classSegments[classSegments.length - 1] = lastSegment.startsWith('-') ? `-${PREFIX}${lastSegment.slice(1)}` : `${PREFIX}${lastSegment}`;
    return classSegments.join(':');
  });
  return updatedClassList.join(' ');
}

// Function to process HTML content and update class attributes
function updateHtmlContent(htmlContent: string): string {
  return htmlContent.replace(/class="([^"]+)"/g, (match, classContent) => {
    const updatedClassContent = addPrefixToTailwindClasses(classContent);
    return `class="${updatedClassContent}"`;
  });
}

// Function to process JS/TS/JSX/TSX content and update class/className attributes
function updateJsTsxContent(fileContent: string): string {
  const attributeStringRegex = /(class|className|enter|enterFrom|enterTo|leave|leaveFrom|leaveTo)=["]([^"]+)["]/g;
  const attributeObjectRegex = /(class|className|enter|enterFrom|enterTo|leave|leaveFrom|leaveTo)=[{]([^}]+)[}]/g;

  // Update class or className string attributes and class names in Headless UI Transition attributes
  const updateStringAttributes = (fileContent: string) =>
    fileContent.replace(attributeStringRegex, (match, attr, classContent) => {
      console.log('attributeStringRegex', { match, classContent });
      const updatedClassContent = addPrefixToTailwindClasses(classContent);
      return `${attr}="${updatedClassContent}"`;
    });

  // Update class or className object attributes and class names in Headless UI Transition attributes
  const updateObjectAttributes = (fileContent: string) =>
    fileContent.replace(attributeObjectRegex, (match, attr, classContent) => {
      if (!classContent || classContent.startsWith('(')) return match;

      console.log('attributeObjectRegex', { match, classContent });
      // Update each set of classes in the function that are surrounded by quotes
      const updatedClassContent = classContent.replace(/['"]([^'"]*)['"]/g, (match, classContent) => {
        if (!classContent) return match;

        const index = fileContent.indexOf(classContent);
        const char = index > 2 ? fileContent.slice(index - 3, index - 2) : '';
        if (char === '=' || char === '|') return match;

        return `'${addPrefixToTailwindClasses(classContent)}'`;
      });
      return `${attr}={${updatedClassContent}}`;
    });

  fileContent = updateStringAttributes(fileContent);
  fileContent = updateObjectAttributes(fileContent);

  return fileContent;
}

// Function to process stylesheet content and update class names in @apply directives
function updateStylesheetContent(fileContent: string): string {
  const applyRegex = /@apply\s+([^;]+);/g;
  return fileContent.replace(applyRegex, (match, classContent) => {
    const updatedClassContent = addPrefixToTailwindClasses(classContent);
    return `@apply ${updatedClassContent};`;
  });
}

function processFile(filePath: string) {
  if (path.extname(filePath) === '.html') {
    // Process HTML files
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file ${filePath}: ${err.message}`);
        return;
      }

      const updatedContent = updateHtmlContent(data);

      fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing file ${filePath}: ${err.message}`);
        } else {
          console.log(`Processed file: ${filePath}`);
        }
      });
    });
  } else if (['.js', '.ts', '.jsx', '.tsx'].includes(path.extname(filePath))) {
    // Process JS/TS/JSX/TSX files
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file ${filePath}: ${err.message}`);
        return;
      }

      const updatedContent = updateJsTsxContent(data);

      fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing file ${filePath}: ${err.message}`);
        } else {
          console.log(`Processed file: ${filePath}`);
        }
      });
    });
  } else if (['.css', '.scss', '.sass', '.less'].includes(path.extname(filePath))) {
    // Process stylesheet files
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file ${filePath}: ${err.message}`);
        return;
      }

      const updatedContent = updateStylesheetContent(data);

      fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing file ${filePath}: ${err.message}`);
        } else {
          console.log(`Processed file: ${filePath}`);
        }
      });
    });
  }
}

// Function to process files in a directory and its subdirectories
function processFiles(directory: string) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${directory}: ${err.message}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.stat(filePath, (err, stat) => {
        if (err) {
          console.error(`Error stating file ${filePath}: ${err.message}`);
          return;
        }

        if (stat.isDirectory()) {
          // Recursively process subdirectories
          processFiles(filePath);
        } else {
          processFile(filePath);
        }
      });
    });
  });
}

// Read directory from command line arguments
const fileOrDirectoryToProcess = process.argv[2];

if (!fileOrDirectoryToProcess || !fs.existsSync(fileOrDirectoryToProcess)) {
  console.error('Please provide a file or directory to process.');
  process.exit(1);
}

// Check if fileOrDirectoryToProcess is a file or directory
const stats = fs.statSync(fileOrDirectoryToProcess);
if (stats.isDirectory()) {
  processFiles(fileOrDirectoryToProcess);
} else {
  processFile(fileOrDirectoryToProcess);
}
