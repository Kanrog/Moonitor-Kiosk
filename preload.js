const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  scanSubnet: () => ipcRenderer.invoke('scan-subnet'),
  onScanProgress: (callback) => ipcRenderer.on('scan-progress', (event, data) => callback(data)),
  getWifiList: () => ipcRenderer.invoke('wifi-list'),
  connectWifi: (data) => ipcRenderer.invoke('wifi-connect', data),
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  savePrinters: (printers) => ipcRenderer.invoke('save-printers', printers),
  updateSystem: () => ipcRenderer.invoke('system-update'),
  rebootSystem: () => ipcRenderer.invoke('system-reboot'),
  shutdownSystem: () => ipcRenderer.invoke('system-shutdown')
});