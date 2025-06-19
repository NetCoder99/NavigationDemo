const { app, BaseWindow, ipcMain } = require('electron')
const env = process.env.NODE_ENV || 'development';
const appRoot = require('app-root-path');
const path = require('path')

// ----------------------------------------------------------------------
const {createStudentsWindow}    = require(appRoot + '/src/students/student_main');

// // ----------------------------------------------------------------------
// global.sharedObject = {
//   someProperty: 'default value'
// };

// // ----------------------------------------------------------------------
// if (env === 'development') {
//   require('electron-reload')(__dirname, {
//       electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
//       hardResetMethod: 'exit'
//   });
// }

// ----------------------------------------------------------------------
app.whenReady().then( () => {
  const winBase = new BaseWindow(
    {x: 100, y:100, width: 1400, height: 1024, kiosk: false}
  );  

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  var studentsView   = createStudentsWindow();
  winBase.contentView.addChildView(studentsView);

  const { width, height } = winBase.getBounds();
  nav_bounds   = {x: 0,  y: 0,   width: width - 15, height: height - 15}
  child_bounds = {x: 10, y: 110, width: width - 45, height: height - 15}
  studentsView.setBounds(child_bounds);
  //studentView.setVisible(true);

  // ----------------------------------------------------------------------
  winBase.on('resize', () => {
    const { width, height } = winBase.getBounds();
    nav_bounds   = {x: 0,  y: 0,   width: width - 15, height: height - 15}
    child_bounds = {x: 10, y: 110, width: width - 45, height: height - 15}
    studentsView.setBounds(child_bounds);
  });

});

// ----------------------------------------------------------------------
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        //createWindow()
    }
}

)