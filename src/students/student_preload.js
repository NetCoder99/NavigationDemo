const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  navEventInvoked       : (navEvent)    => ipcRenderer.send('navEventInvoked', navEvent),
  navEventInvokedResult : (callback)    => ipcRenderer.on('navEventInvokedResult', (_event, value) => callback(value)),
  searchByName          : (searchData)  => ipcRenderer.send('searchByName', searchData),
  searchByNameResult    : (callback)    => ipcRenderer.on('searchByNameResult', (_event, value) => callback(value)),
  saveStudentData       : (studentData) => ipcRenderer.send('saveStudentData', studentData),
  saveStudentDataResult : (callback)    => ipcRenderer.on('saveStudentDataResult', (_event, value) => callback(value)),
  getDefaultImage       : ()            => ipcRenderer.sendSync('getDefaultImage'),
  createNewStudent      : (studentData) => ipcRenderer.send('createNewStudent', studentData),
  createNewStudentResult: (callback)    => ipcRenderer.on('createNewStudentResult', (_event, value) => callback(value)),
  studentSelected       : (badgeNumber) => ipcRenderer.send('studentSelected', badgeNumber), 
  searchByBadgeResult   : (callback)    => ipcRenderer.on('searchByBadgeResult', (_event, value) => callback(value)),
  selectPicture         : (source)      => ipcRenderer.send('selectPicture',source),
  selectPictureResult   : (callback)    => ipcRenderer.on('selectPictureResult', (_event, value) => callback(value)),
  savePicture           : (badgeNumber) => ipcRenderer.send('savePicture', badgeNumber),
  savePictureResult     : (callback)    => ipcRenderer.on('savePictureResult', (_event, value) => callback(value)),
  createBadge           : (badgeNumber) => ipcRenderer.send('createBadge', badgeNumber),
  createBadgeResult     : (callback)    => ipcRenderer.on('createBadgeResult', (_event, value) => callback(value)),
})