import fs from 'fs';
import path from 'path';

// Папки для исключения
const excludeDirs: string[] = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'coverage',
  '.vscode',
  '.idea',
  '.cache'
];

// Расширения файлов для исключения
const excludeExtensions: string[] = [
  '.log',
  '.cache'
];

interface TreeOptions {
  maxDepth?: number;
  showHidden?: boolean;
  includeIcons?: boolean;
}

function getDirectoryTree(
  dirPath: string, 
  level: number = 0, 
  prefix: string = '',
  options: TreeOptions = { maxDepth: 5, includeIcons: true }
): string {
  if (level > (options.maxDepth || 5)) return '';
  
  let result = '';
  
  try {
    const files = fs.readdirSync(dirPath);
    
    // Сортируем: папки в начале, затем файлы
    const sortedFiles = files.sort((a, b) => {
      const aIsDir = fs.statSync(path.join(dirPath, a)).isDirectory();
      const bIsDir = fs.statSync(path.join(dirPath, b)).isDirectory();
      
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });
    
    sortedFiles.forEach((file, index) => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      const isLast = index === sortedFiles.length - 1;
      
      // Проверяем исключения
      if (excludeDirs.includes(file)) return;
      if (excludeExtensions.includes(path.extname(file))) return;
      
      // Проверяем скрытые файлы
      if (!options.showHidden && file.startsWith('.')) return;
      
      // Формируем префикс для текущего уровня
      const currentPrefix = prefix + (isLast ? '└── ' : '├── ');
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');
      
      // Получаем иконку для файла/папки
      const icon = getIcon(file, stats.isDirectory(), options.includeIcons);
      
      // Добавляем в результат
      if (stats.isDirectory()) {
        result += `${currentPrefix}${icon}${file}/\n`;
        result += getDirectoryTree(filePath, level + 1, nextPrefix, options);
      } else {
        result += `${currentPrefix}${icon}${file}\n`;
      }
    });
  } catch (error) {
    console.error(`Ошибка при чтении директории ${dirPath}:`, error);
  }
  
  return result;
}

function getIcon(fileName: string, isDirectory: boolean, includeIcons: boolean = true): string {
  if (!includeIcons) return '';
  
  if (isDirectory) {
    return '📁 ';
  }
  
  // Иконки для разных типов файлов
  if (fileName.match(/\.(js|jsx|mjs)$/)) return '⚛️ ';
  if (fileName.match(/\.(ts|tsx)$/)) return '🔷 ';
  if (fileName.match(/\.(css|scss|sass|less)$/)) return '🎨 ';
  if (fileName.match(/\.(json)$/)) return '📋 ';
  if (fileName.match(/\.(md|markdown|txt)$/)) return '📝 ';
  if (fileName.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return '🖼️ ';
  if (fileName.match(/\.(woff|woff2|ttf|eot)$/)) return '🔤 ';
  if (fileName.match(/\.(mp4|webm|avi|mov)$/)) return '🎬 ';
  if (fileName.match(/\.(mp3|wav|ogg)$/)) return '🎵 ';
  if (fileName.match(/\.(pdf)$/)) return '📕 ';
  if (fileName === 'package.json') return '📦 ';
  if (fileName === 'README.md') return '📖 ';
  if (fileName === '.gitignore') return '🔒 ';
  if (fileName === 'next.config.js' || fileName === 'next.config.ts') return '⚡ ';
  
  return '📄 ';
}

// Основная функция
function generateProjectStructure() {
  try {
    const projectPath = process.cwd();
    const projectName = path.basename(projectPath);
    
    console.log('\n' + '='.repeat(60));
    console.log(`📁 СТРУКТУРА ПРОЕКТА: ${projectName}`);
    console.log('='.repeat(60) + '\n');
    
    const structure = getDirectoryTree(projectPath, 0, '', {
      maxDepth: 5,
      showHidden: true,
      includeIcons: true
    });
    
    console.log(structure);
    
    // Сохраняем в файл (опционально)
    const outputFile = path.join(projectPath, 'project-structure.txt');
    fs.writeFileSync(
      outputFile, 
      `Project Structure: ${projectName}\n${'='.repeat(50)}\n\n${structure}`
    );
    
    console.log(`\n✅ Структура сохранена в файл: ${outputFile}`);
    
  } catch (error) {
    console.error('❌ Ошибка при генерации структуры:', error);
  }
}

// Запускаем
generateProjectStructure();