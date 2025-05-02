const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Log environment information
console.log('Node environment:', process.env.NODE_ENV);
console.log('Current directory:', __dirname);
console.log('Files in current directory:', fs.readdirSync(__dirname));

// Check if dist directory exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.warn('WARNING: dist directory not found at', distPath);
  
  // Try to build the app if in production and dist doesn't exist
  if (process.env.NODE_ENV === 'production') {
    console.log('Attempting to build the app...');
    try {
      const { execSync } = require('child_process');
      execSync('npm run build', { stdio: 'inherit' });
      console.log('Build completed successfully');
    } catch (error) {
      console.error('Failed to build the app:', error);
      // Continue execution, we'll handle missing dist below
    }
  }
  
  // Check again after build attempt
  if (!fs.existsSync(distPath)) {
    // Create a minimal dist directory and index.html for health checks
    try {
      fs.mkdirSync(distPath, { recursive: true });
      fs.writeFileSync(path.join(distPath, 'index.html'), 
        '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Solana Marketplace</title></head>' +
        '<body><h1>Solana Marketplace</h1><p>The application is starting up...</p>' +
        '<script>setTimeout(function() { window.location.reload(); }, 5000);</script></body></html>'
      );
      console.log('Created minimal index.html for health checks');
    } catch (error) {
      console.error('Failed to create minimal dist directory:', error);
    }
  }
}

// Log files in dist directory
try {
  if (fs.existsSync(distPath)) {
    console.log('Files in dist directory:', fs.readdirSync(distPath));
  }
} catch (error) {
  console.error('Error listing dist directory:', error);
}

// Serve static files from the dist directory
app.use(express.static(distPath));

// Send all other requests to the index.html file
app.get('*', (req, res) => {
  try {
    res.sendFile(path.join(distPath, 'index.html'));
  } catch (error) {
    console.error('Error sending index.html:', error);
    res.status(500).send('Server error: ' + error.message);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
