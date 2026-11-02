/**
 * Local Development Server with Live-Reload
 * Zero-dependency, fast, and lightweight
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT_DIR = __dirname;

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Connected live-reload clients (SSE)
let sseClients = [];

// Live-reload injection script
const LIVE_RELOAD_SCRIPT = `
<!-- Dev Live Reload -->
<script>
(() => {
  if (window.location.protocol === 'file:') return;
  const es = new EventSource('/__livereload');
  es.onmessage = (e) => {
    if (e.data === 'reload') {
      console.log('[live-reload] File changed, reloading...');
      window.location.reload();
    }
  };
  es.onerror = () => {
    setTimeout(() => {
      // Reconnect handled automatically by EventSource
    }, 2000);
  };
})();
</script>
`;

// Create HTTP server
const server = http.createServer((req, res) => {
  // SSE endpoint for live reload
  if (req.url === '/__livereload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write('retry: 1500\n\n');
    sseClients.push(res);
    req.on('close', () => {
      sseClients = sseClients.filter(c => c !== res);
    });
    return;
  }

  // Parse path
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(ROOT_DIR, reqPath);

  // Security check: ensure path is within ROOT_DIR
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>404 Not Found</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1>404 - Not Found</h1>
          <p>The requested file <code>${reqPath}</code> was not found.</p>
          <a href="/" style="color: #c86d5b;">Back to Portfolio Home</a>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }

      // If HTML, inject live-reload script
      if (ext === '.html') {
        let htmlStr = content.toString('utf-8');
        if (htmlStr.includes('</body>')) {
          htmlStr = htmlStr.replace('</body>', `${LIVE_RELOAD_SCRIPT}</body>`);
        } else {
          htmlStr += LIVE_RELOAD_SCRIPT;
        }
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(htmlStr);
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });
        res.end(content);
      }
    });
  });
});

// Watch files for live-reload
let debounceTimer = null;
const watchDirs = [ROOT_DIR, path.join(ROOT_DIR, 'assets')];

watchDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.watch(dir, { recursive: false }, (eventType, filename) => {
      if (!filename) return;
      // Ignore git and temp files
      if (filename.startsWith('.') || filename.endsWith('.tmp') || filename === 'server.js') return;

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        console.log(`[live-reload] Detected change in ${filename}, notifying ${sseClients.length} clients...`);
        sseClients.forEach(client => {
          try {
            client.write('data: reload\n\n');
          } catch (e) {
            // client disconnected
          }
        });
      }, 150);
    });
  }
});

// Function to start server with fallback ports
function startServer(port) {
  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`\n======================================================`);
    console.log(`  MAY PEARL J. IMPAS - PERSONAL PORTFOLIO DEV SERVER`);
    console.log(`======================================================`);
    console.log(`  Local URL:    ${url}`);
    console.log(`  Live Reload:  Active (SSE)`);
    console.log(`  Watching:     index.html, styles.css, script.js, assets/`);
    console.log(`======================================================\n`);

    // Auto-open browser in dev mode
    const startCmd = process.platform === 'win32' ? `start "" "${url}"` :
                     process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
    exec(startCmd, (err) => {
      if (err) {
        // Silently continue if open fails in headless/container environments
      }
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(DEFAULT_PORT);

