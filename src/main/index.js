import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// IPC Handlers için kanalları tanımla
// Kullanıcı işlemleri
ipcMain.handle('user:register', async (event, userData) => {
  try {
    const user = await User.create(userData)
    // Parolayı göndermeden kullanıcı bilgilerini dön
    const safeUserData = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt
    }
    return { success: true, user: safeUserData }
  } catch (error) {
    console.error('Kullanıcı kaydı hatası:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('user:login', async (event, { username, password }) => {
  try {
    const user = await User.findOne({ where: { username } })
    if (!user) {
      return { success: false, error: 'Kullanıcı bulunamadı' }
    }

    const isPasswordValid = await user.validatePassword(password)
    if (!isPasswordValid) {
      return { success: false, error: 'Geçersiz parola' }
    }

    // Parolayı göndermeden kullanıcı bilgilerini dön
    const safeUserData = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt
    }
    return { success: true, user: safeUserData }
  } catch (error) {
    console.error('Giriş hatası:', error)
    return { success: false, error: error.message }
  }
})

// Görev işlemleri
ipcMain.handle('task:getAll', async (event, userId) => {
  try {
    const tasks = await Task.findAll({
      where: { UserId: userId },
      order: [['createdAt', 'DESC']]
    })
    return { success: true, tasks }
  } catch (error) {
    console.error('Görevleri alma hatası:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('task:add', async (event, taskData) => {
  try {
    const task = await Task.create(taskData)
    return { success: true, task }
  } catch (error) {
    console.error('Görev ekleme hatası:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('task:update', async (event, { id, ...taskData }) => {
  try {
    const [updated] = await Task.update(taskData, {
      where: { id }
    })
    if (updated) {
      const updatedTask = await Task.findByPk(id)
      return { success: true, task: updatedTask }
    }
    return { success: false, error: 'Görev güncellenemedi' }
  } catch (error) {
    console.error('Görev güncelleme hatası:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('task:delete', async (event, id) => {
  try {
    const deleted = await Task.destroy({
      where: { id }
    })
    return { success: true, deleted }
  } catch (error) {
    console.error('Görev silme hatası:', error)
    return { success: false, error: error.message }
  }
})
