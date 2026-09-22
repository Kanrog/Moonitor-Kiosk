const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const net = require('net');
const http = require('http');
const { exec } = require('child_process');

let mainWindow;
const configPath = path.join(app.getPath('userData'), 'printers.json');
const PORT = 3000;

// Helper to get prioritized local network IP
function getLocalIP() {
  let ipAddress = '127.0.0.1';
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const netInfo of interfaces[name]) {
      if (netInfo.family === 'IPv4' && !netInfo.internal) {
        if (netInfo.address.startsWith('192.168.') || netInfo.address.startsWith('10.') || netInfo.address.startsWith('172.')) {
          ipAddress = netInfo.address;
          break;
        }
      }
    }
  }
  return ipAddress;
}

// HTTP Server for Dual-Mode (Local Kiosk + Network Browser Access)
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Routes
  if (url.pathname === '/api/printers') {
    if (req.method === 'GET') {
      try {
        const printers = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : [];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(printers));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          fs.writeFileSync(configPath, body);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
    }
  } else if (url.pathname === '/api/system-info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ip: getLocalIP(), port: PORT }));
  } else if (url.pathname === '/api/wifi-list') {
    exec('nmcli -t -f SSID,SIGNAL,ACTIVE device wifi', (err, stdout) => {
      if (err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([
          { ssid: 'MakerSpace_IoT', signal: '90', active: true },
          { ssid: 'Workshop_5G', signal: '75', active: false },
          { ssid: 'Guest_Network', signal: '50', active: false }
        ]));
        return;
      }
      const networks = stdout.split('\n').filter(Boolean).map(line => {
        const parts = line.split(':');
        return { ssid: parts[0], signal: parts[1], active: parts[2] === 'yes' || parts[2] === 'Active' };
      });
      networks.sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(networks));
    });
  } else if (url.pathname === '/api/wifi-connect' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { ssid, password } = JSON.parse(body);
        exec(`nmcli device wifi connect "${ssid}" password "${password}"`, (err, stdout) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          if (err) {
            res.end(JSON.stringify({ success: false, error: err.message }));
          } else {
            res.end(JSON.stringify({ success: true, output: stdout }));
          }
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid request' }));
      }
    });
  } else if (url.pathname === '/api/system-update' && req.method === 'POST') {
    exec('cd /opt/moonitor-kiosk && git pull && npm install', (err, stdout, stderr) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      if (err) {
        res.end(JSON.stringify({ success: false, error: stderr || err.message }));
      } else {
        res.end(JSON.stringify({ success: true, output: stdout }));
      }
    });
  } else if (url.pathname === '/api/system-reboot' && req.method === 'POST') {
    exec('sudo systemctl reboot', (err) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: !err }));
    });
  } else if (url.pathname === '/api/system-shutdown' && req.method === 'POST') {
    exec('sudo systemctl poweroff', (err) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: !err }));
    });
  } else if (url.pathname === '/api/scan-subnet') {
    runSubnetScanAsync().then(discovered => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(discovered));
    });
  } else {
    let filePath = path.join(__dirname, url.pathname === '/' ? 'index.html' : url.pathname);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
      } else {
        const ext = path.extname(filePath);
        let contentType = 'text/html';
        if (ext === '.js') contentType = 'text/javascript';
        if (ext === '.css') contentType = 'text/css';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Moonitor server running on http://0.0.0.0:${PORT}`);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    fullscreen: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    }
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('get-printers', () => {
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
  } catch (e) {
    console.error('Failed to load printers.json:', e);
  }
  return [];
});

ipcMain.handle('save-printers', (event, printers) => {
  try {
    fs.writeFileSync(configPath, JSON.stringify(printers, null, 2));
    return true;
  } catch (e) {
    console.error('Failed to save printers.json:', e);
    return false;
  }
});

ipcMain.handle('system-update', () => {
  return new Promise((resolve) => {
    exec('cd /opt/moonitor-kiosk && git pull && npm install', (err, stdout, stderr) => {
      if (err) {
        resolve({ success: false, error: stderr || err.message });
      } else {
        resolve({ success: true, output: stdout });
      }
    });
  });
});

ipcMain.handle('system-reboot', () => {
  exec('sudo systemctl reboot', (err) => {
    if (err) console.error('Reboot failed:', err);
  });
});

ipcMain.handle('system-shutdown', () => {
  exec('sudo systemctl poweroff', (err) => {
    if (err) console.error('Shutdown failed:', err);
  });
});

ipcMain.handle('get-system-info', () => {
  return { ip: getLocalIP(), port: PORT };
});

async function runSubnetScanAsync() {
  return new Promise(async (resolve) => {
    let subnetBase = '192.168.0';
    const interfaces = os.networkInterfaces();
    
    for (const name of Object.keys(interfaces)) {
      for (const netInfo of interfaces[name]) {
        if (netInfo.family === 'IPv4' && !netInfo.internal) {
          const parts = netInfo.address.split('.');
          if (parts.length === 4) {
            subnetBase = `${parts[0]}.${parts[1]}.${parts[2]}`;
          }
        }
      }
    }

    const discovered = [];
    const totalHosts = 254;
    const batchSize = 4;
    let completedHosts = 0;

    const checkHost = (ip) => {
      return new Promise((res) => {
        const socket = new net.Socket();
        socket.setTimeout(800);

        socket.on('connect', () => {
          socket.destroy();
          http.get(`http://${ip}:7125/server/info`, { timeout: 1000 }, (resp) => {
            let data = '';
            resp.on('data', chunk => { data += chunk; });
            resp.on('end', () => {
              let printerName = `Klipper Printer (${ip})`;
              try {
                const json = JSON.parse(data);
                if (json && json.result && json.result.hostname) {
                  printerName = json.result.hostname;
                }
              } catch (e) {}
              discovered.push({ ip: ip, name: printerName });
              completedHosts++;
              if (mainWindow) {
                mainWindow.webContents.send('scan-progress', { ip, current: completedHosts, total: totalHosts, subnet: subnetBase });
              }
              res();
            });
          }).on('error', () => {
            discovered.push({ ip: ip, name: `Klipper (${ip})` });
            completedHosts++;
            if (mainWindow) {
              mainWindow.webContents.send('scan-progress', { ip, current: completedHosts, total: totalHosts, subnet: subnetBase });
            }
            res();
          });
        });

        socket.on('timeout', () => { 
          socket.destroy(); 
          completedHosts++;
          res(); 
        });
        socket.on('error', () => { 
          socket.destroy(); 
          completedHosts++;
          res(); 
        });

        socket.connect(7125, ip);
      });
    };

    for (let i = 1; i <= totalHosts; i += batchSize) {
      const batchPromises = [];
      for (let j = i; j < i + batchSize && j <= totalHosts; j++) {
        batchPromises.push(checkHost(`${subnetBase}.${j}`));
      }
      await Promise.all(batchPromises);
      await new Promise(r => setTimeout(r, 60));
    }

    resolve(discovered);
  });
}

ipcMain.handle('scan-subnet', async () => {
  return await runSubnetScanAsync();
});

ipcMain.handle('wifi-list', async () => {
  return new Promise((resolve) => {
    exec('nmcli -t -f SSID,SIGNAL,ACTIVE device wifi', (err, stdout) => {
      if (err) {
        resolve([
          { ssid: 'MakerSpace_IoT', signal: '90', active: true },
          { ssid: 'Workshop_5G', signal: '75', active: false },
          { ssid: 'Guest_Network', signal: '50', active: false }
        ]);
        return;
      }
      const networks = stdout.split('\n').filter(Boolean).map(line => {
        const parts = line.split(':');
        return { ssid: parts[0], signal: parts[1], active: parts[2] === 'yes' || parts[2] === 'Active' };
      });
      networks.sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0));
      resolve(networks);
    });
  });
});

ipcMain.handle('wifi-connect', async (event, { ssid, password }) => {
  return new Promise((resolve) => {
    exec(`nmcli device wifi connect "${ssid}" password "${password}"`, (err, stdout) => {
      if (err) {
        resolve({ success: false, error: err.message });
      } else {
        resolve({ success: true, output: stdout });
      }
    });
  });
});