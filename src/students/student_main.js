const {WebContentsView, ipcMain, dialog } = require('electron/main') 
const appRoot  = require('app-root-path');
const path     = require('node:path')  
const rootPath = appRoot.path;

//const fs       = require('fs');
const root_dir = process.cwd();

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  global.shared = {selectedBadgeNumber: 'test'};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function createStudentsWindow(show_devTools = false) {  
  const studentView = new WebContentsView({
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'student_preload.js')
    }     
  });
  studentView.setBounds({ x: 10, y: 110, width: 1400, height: 960 });
  const studentViewPath = appRoot + '/src/students/student_main.html';
  studentView.webContents.loadFile(studentViewPath);
  studentView.setVisible(true);

  studentView.webContents.openDevTools();

  return studentView;
}  

module.exports = {createStudentsWindow};