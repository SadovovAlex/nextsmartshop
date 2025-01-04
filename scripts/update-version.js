const fs = require('fs');
const path = require('path');

// Путь к файлу package.json
const packageJsonPath = path.join(__dirname, '../package.json');

// Читаем содержимое package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Увеличиваем версию
const [major, minor, patch] = packageJson.version.split('.');
packageJson.version = `${major}.${minor}.${parseInt(patch) + 1}`;

// Записываем обновленную версию в package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`Версия обновлена до ${packageJson.version}`);
