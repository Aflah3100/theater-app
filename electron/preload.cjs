const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  isElectron: true,
  selectVideo: () => ipcRenderer.invoke('media:select-video'),
  playInVlc: (payload) => ipcRenderer.invoke('media:play-in-vlc', payload),
});
