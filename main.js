const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron/main')
const path = require('node:path')

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: false,
    backgroundColor: '#394047',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('renderer/index.html');

  win.on('maximize', () => {
    win.webContents.send('window-state-changed', 'maximized');
  });

  win.on('unmaximize', () => {
    win.webContents.send('window-state-changed', 'unmaximized');
  });
}

ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
});

ipcMain.on('minimize-window', () => {
  win.minimize();
});

ipcMain.on('maximize-window', () => {
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
});

ipcMain.on('close-window', () => {
  win.close();
});

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})