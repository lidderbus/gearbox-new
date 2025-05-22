// public/preload.js
const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script loaded successfully!');

// Example: Expose a safe subset of ipcRenderer if needed
// contextBridge.exposeInMainWorld('electronAPI', {
//   sendMessage: (channel, data) => ipcRenderer.send(channel, data),
//   receiveMessage: (channel, func) => {
//     // Deliberately strip event sender from ipcRenderer.on
//     ipcRenderer.on(channel, (event, ...args) => func(...args));
//   }
// });

// Or, for now, just confirm it's working:
contextBridge.exposeInMainWorld('electronPreload', {
  loaded: true,
  platform: process.platform // Example of exposing a simple Node.js API
});

// It's good practice to also log any potential issues during preload
try {
  // Any setup that might fail
} catch (error) {
  console.error("Error in preload script:", error);
}
