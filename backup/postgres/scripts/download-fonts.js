const fs = require('fs');
const path = require('path');
const https = require('https');

// Create fonts directory if it doesn't exist
const fontsDir = path.join(__dirname, '..', 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Arial font URL - using a common CDN for fonts
const fontUrl = 'https://github.com/matomo-org/travis-scripts/raw/master/fonts/Arial.ttf';
const outputPath = path.join(fontsDir, 'Arial.ttf');

console.log(`Downloading Arial font to ${outputPath}...`);

// Download the font file
https.get(fontUrl, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download font: ${response.statusCode} ${response.statusMessage}`);
    return;
  }

  const fileStream = fs.createWriteStream(outputPath);
  response.pipe(fileStream);

  fileStream.on('finish', () => {
    console.log('Font downloaded successfully!');
    fileStream.close();
  });

  fileStream.on('error', (err) => {
    console.error('Error writing font file:', err);
    fs.unlinkSync(outputPath); // Clean up partial file
  });
}).on('error', (err) => {
  console.error('Error downloading font:', err);
});
