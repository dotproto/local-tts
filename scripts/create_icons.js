const fs = require('fs');

// Create a simple speaker icon in SVG format
function createIcon(size) {
  const svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#4285f4"/>
  <g fill="white">
    <!-- Speaker body -->
    <path d="M${size*0.3} ${size*0.2} h${size*0.12} v${size*0.6} h-${size*0.12} z"/>
    <!-- Speaker cone -->
    <path d="M${size*0.42} ${size*0.2} h${size*0.28} v${size*0.6} h-${size*0.28} z"/>
  </g>
  <!-- Sound waves -->
  <g stroke="white" stroke-width="${size*0.05}" fill="none">
    <path d="M${size*0.7} ${size*0.5} A${size*0.15} ${size*0.15} 0 0 1 ${size*0.7} ${size*0.5} A${size*0.15} ${size*0.15} 0 0 0 ${size*0.7} ${size*0.5}"/>
    <path d="M${size*0.7} ${size*0.5} A${size*0.3} ${size*0.3} 0 0 1 ${size*0.7} ${size*0.5} A${size*0.3} ${size*0.3} 0 0 0 ${size*0.7} ${size*0.5}"/>
  </g>
</svg>`;

  return svg;
}

// Create icons directory if it doesn't exist
if (!fs.existsSync('icons')) {
  fs.mkdirSync('icons');
}

// Generate icons of different sizes
const sizes = [16, 48, 128];
sizes.forEach(size => {
  const icon = createIcon(size);
  fs.writeFileSync(`icons/icon${size}.svg`, icon);
}); 