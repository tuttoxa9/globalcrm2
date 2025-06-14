const fs = require('fs');
const path = require('path');

// Создаем простую SVG иконку
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#gradient)"/>
  <circle cx="${size * 0.3}" cy="${size * 0.3}" r="${size * 0.08}" fill="white" opacity="0.9"/>
  <circle cx="${size * 0.7}" cy="${size * 0.3}" r="${size * 0.08}" fill="white" opacity="0.9"/>
  <circle cx="${size * 0.5}" cy="${size * 0.7}" r="${size * 0.08}" fill="white" opacity="0.9"/>
  <text x="${size * 0.5}" y="${size * 0.55}" font-family="Arial, sans-serif" font-size="${size * 0.12}" font-weight="bold" text-anchor="middle" fill="white">CRM</text>
</svg>`;

// Создаем Canvas для конвертации SVG в PNG (простая реализация)
const createPNGDataURL = (svgString, size) => {
  // Для упрощения, создадим простой base64 PNG
  // В реальном проекте лучше использовать canvas или sharp
  const canvas = `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
  return canvas;
};

// Размеры иконок для PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Создаем папку для иконок
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Генерируем иконки
iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);

  fs.writeFileSync(filepath, svgContent);
  console.log(`Создана иконка: ${filename}`);
});

console.log('Все иконки созданы!');
