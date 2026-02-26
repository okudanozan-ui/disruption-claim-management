import { contextBridge, ipcRenderer } from 'electron'
// const { contextBridge, ipcRenderer } = require('electron')

import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)

    // Renderer process için API'leri tanımla
    contextBridge.exposeInMainWorld('api', {
      // Kullanıcı işlemleri
      user: {
        register: (userData) => ipcRenderer.invoke('user:register', userData),
        login: (credentials) => ipcRenderer.invoke('user:login', credentials)
      },

      // Görev işlemleri
      tasks: {
        getAll: (userId) => ipcRenderer.invoke('task:getAll', userId),
        add: (taskData) => ipcRenderer.invoke('task:add', taskData),
        update: (taskData) => ipcRenderer.invoke('task:update', taskData),
        delete: (id) => ipcRenderer.invoke('task:delete', id)
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
