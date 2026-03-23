import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { spawnSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;
const rendererUrl = process.env.ELECTRON_START_URL ?? 'http://127.0.0.1:8080';

if (process.platform === 'linux') {
  app.commandLine.appendSwitch('no-sandbox');
  app.commandLine.appendSwitch('disable-setuid-sandbox');
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: '#08070b',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL(rendererUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

function resolveVlcCommand() {
  const candidates = process.platform === 'win32'
    ? [
        'vlc.exe',
        'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe',
        'C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe',
      ]
    : process.platform === 'darwin'
      ? [
          '/Applications/VLC.app/Contents/MacOS/VLC',
          '/Applications/VLC Media Player.app/Contents/MacOS/VLC',
          'vlc',
        ]
      : [
          'vlc',
          '/usr/bin/vlc',
          '/snap/bin/vlc',
          '/usr/local/bin/vlc',
        ];

  for (const candidate of candidates) {
    if (candidate.includes(path.sep) && existsSync(candidate)) {
      return candidate;
    }

    if (!candidate.includes(path.sep)) {
      const result = spawnSync(process.platform === 'win32' ? 'where' : 'which', [candidate], { stdio: 'ignore' });
      if (result.status === 0) {
        return candidate;
      }
    }
  }

  return null;
}

ipcMain.handle('media:select-video', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {
        name: 'Videos',
        extensions: ['mp4', 'mkv', 'avi', 'mov', 'm4v', 'webm', 'mpeg', 'mpg'],
      },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const filePath = result.filePaths[0];
  const fileName = path.basename(filePath);

  return {
    path: filePath,
    name: fileName,
  };
});

ipcMain.handle('media:play-in-vlc', async (_event, payload) => {
  if (!payload?.path) {
    return { ok: false, error: 'No media file selected.' };
  }

  const vlcCommand = resolveVlcCommand();
  if (!vlcCommand) {
    return {
      ok: false,
      error: 'VLC could not be found. Please install VLC Media Player or add it to your PATH.',
    };
  }

  try {
    const args = ['--fullscreen', payload.path];
    const child = spawn(vlcCommand, args, {
      detached: true,
      stdio: 'ignore',
    });
    child.unref();

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to launch VLC.',
    };
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
