const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { exec } = require('child_process');

let mainWindow;
const configPath = path.join(app.getPath('userData'), 'printers.json');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    fullscreen: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');
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

// IPC Handlers for Printer Persistence & Fleet Management
ipcMain.handle('get-printers', () => {
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
  } catch (e) {
    console.error('Failed to load printers.json:', e);
  }
  return []; // Default to blank install
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

// IPC Handlers for System & Network Operations
ipcMain.handle('get-system-info', () => {
  let ipAddress = '127.0.0.1';
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        ipAddress = net.address;
      }
    }
  }
  return { ip: ipAddress, port: 3000 };
});

ipcMain.handle('scan-subnet', async () => {
  // Simulated subnet scanner discovering Moonraker API endpoints
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { ip: '192.168.1.101', name: 'Printer 01' },
        { ip: '192.168.1.102', name: 'Printer 02' },
        { ip: '192.168.1.103', name: 'Printer 03' }
      ]);
    }, 1200);
  });
});

ipcMain.handle('wifi-list', async () => {
  return new Promise((resolve) => {
    exec('nmcli -t -f SSID,SIGNAL device wifi', (err, stdout) => {
      if (err) {
        resolve([
          { ssid: 'MakerSpace_IoT', signal: '90' },
          { ssid: 'Workshop_5G', signal: '75' },
          { ssid: 'Guest_Network', signal: '50' }
        ]);
        return;
      }
      const networks = stdout.split('\n').filter(Boolean).map(line => {
        const [ssid, signal] = line.split(':');
        return { ssid, signal };
      });
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