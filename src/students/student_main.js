const {WebContentsView, ipcMain, dialog } = require('electron/main') 
const appRoot  = require('app-root-path');
const path     = require('node:path')  
const rootPath = appRoot.path;

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

  const studentSearchPath       = path.join(rootPath, 'src', 'students', 'functions', 'student_data_search.js');
  const {searchByNameFunction}  = require(studentSearchPath);
  const {searchByBadgeFunction} = require(studentSearchPath);


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  ipcMain.on('searchByName', (event, searchData) => {
    console.log(`searchByName was clicked: ${JSON.stringify(searchData)}`);
    studentData = searchByNameFunction(studentView, searchData);
  })  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  ipcMain.on('studentSelected', (event, badgeData) => {
    console.log(`studentSelected was clicked: ${JSON.stringify(badgeData)}`);
    searchByBadgeFunction(studentView, badgeData);
  })  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const studentSavePath       = path.join(rootPath, 'src', 'students', 'functions', 'student_data_save.js');
  const {saveStudentData}     = require(studentSavePath);
  ipcMain.on('saveStudentData', (event, studentDate) => {
    console.log(`saveStudentData was clicked: ${JSON.stringify(studentDate)}`);
    saveStudentData(studentView, studentDate);
  })  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const createNewStudentPath  = path.join(rootPath, 'src', 'students', 'functions', 'student_data_create.js');
  const {createNewStudent}    = require(createNewStudentPath);
  ipcMain.on('createNewStudent', (event, studentDate) => {
    console.log(`createNewStudent was clicked`);
    createNewStudent(studentView, studentDate);
  })  

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  


  return studentView;
}  

module.exports = {createStudentsWindow};