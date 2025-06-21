const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  searchByName          : (searchData)  => ipcRenderer.send('searchByName', searchData),
  searchByNameResult    : (callback)    => ipcRenderer.on('searchByNameResult', (_event, value) => callback(value)),
  saveStudentData       : (studentData) => ipcRenderer.send('saveStudentData', studentData),
  saveStudentDataResult : (callback)    => ipcRenderer.on('saveStudentDataResult', (_event, value) => callback(value)),
  createNewStudent      : (studentData) => ipcRenderer.send('createNewStudent', studentData),
  createNewStudentResult: (callback)    => ipcRenderer.on('createNewStudentResult', (_event, value) => callback(value)),
  studentSelected       : (badgeNumber) => ipcRenderer.send('studentSelected', badgeNumber), 
  searchByBadgeResult   : (callback)    => ipcRenderer.on('searchByBadgeResult', (_event, value) => callback(value)),
})