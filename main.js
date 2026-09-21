const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const net = require('net');
const http = require('http');
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

// System Power IPC Handlers
ipcMain.handle('system-reboot', () => {
  exec('sudo reboot', (err) => {
    if (err) console.error('Reboot failed:', err);
  });
});

ipcMain.handle('system-shutdown', () => {
  exec('sudo shutdown -h now', (err) => {
    if (err) console.error('Shutdown failed:', err);
  });
});

// IPC Handlers for System & Network Operations
ipcMain.handle('get-system-info', () => {
  let ipAddress = '127.0.0.1';
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const netInfo of interfaces[name]) {
      if (netInfo.family === 'IPv4' && !netInfo.internal) {
        ipAddress = netInfo.address;
      }
    }
  }
  return { ip: ipAddress, port: 3000 };
});

// Highly reliable, slowed-down subnet scanner for Klipper instances (Port 7125)
ipcMain.handle('scan-subnet', async () => {
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
    const batchSize = 4; // Smaller batch size to prevent network buffer saturation
    let completedHosts = 0;

    const checkHost = (ip) => {
      return new Promise((res) => {
        const socket = new net.Socket();
        socket.setTimeout(800); // Generous timeout to catch slow responders

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
          if (mainWindow) {
            mainWindow.webContents.send('scan-progress', { ip, current: completedHosts, total: totalHosts, subnet: subnetBase });
          }
          res(); 
        });
        socket.on('error', () => { 
          socket.destroy(); 
          completedHosts++;
          if (mainWindow) {
            mainWindow.webContents.send('scan-progress', { ip, current: completedHosts, total: totalHosts, subnet: subnetBase });
          }
          res(); 
        });

        socket.connect(7125, ip);
      });
    };

    // Scan in controlled small batches with a brief pause between batches
    for (let i = 1; i <= totalHosts; i += batchSize) {
      const batchPromises = [];
      for (let j = i; j < i + batchSize && j <= totalHosts; j++) {
        batchPromises.push(checkHost(`${subnetBase}.${j}`));
      }
      await Promise.all(batchPromises);
      await new Promise(r => setTimeout(r, 60)); // Inter-batch delay for absolute reliability
    }

    resolve(discovered);
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