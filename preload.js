const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  scanSubnet: () => ipcRenderer.invoke('scan-subnet'),
  getWifiList: () => ipcRenderer.invoke('wifi-list'),
  connectWifi: (data) => ipcRenderer.invoke('wifi-connect', data)
});