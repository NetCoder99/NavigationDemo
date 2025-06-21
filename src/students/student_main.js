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
  const resizeImagePath      = path.join(rootPath, 'src', 'data', 'scale_image.js');
  const {scaleImageToHeight} = require(resizeImagePath);
  ipcMain.on('selectPicture', (event) => {
    console.log(`selectPicture was clicked`);
    dialog.showOpenDialog({ properties: ['openFile'] })
    .then(result => selectPictureSelectionResult(result))
    .catch(err => console.log(err));
  });
  async function selectPictureSelectionResult(selectPictureResult) {
    console.log(`selectPictureSelectionResult: ${selectPictureResult.filePaths[0]}`)
    if (selectPictureResult.canceled) {
      return;
    }
    const resizedImage = await scaleImageToHeight(selectPictureResult.filePaths[0], null, 300) ;
    const base64String = Buffer.from(resizedImage).toString('base64');
    const parsedPath = path.parse(selectPictureResult.filePaths[0]);
    const imageDetails = {
      'image_name'   : parsedPath.base, 
      'image_path'   : selectPictureResult.filePaths[0], 
      'image_string' : base64String
    }
    studentView.webContents.send('selectPictureResult', imageDetails);
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const saveImagePath         = path.join(rootPath, 'src', 'data', 'save_picture.js');
  const {savePictureByBadge}  = require(saveImagePath);
  ipcMain.on('savePicture', (event, studentData) => {
    console.log(`savePicture was clicked: ${JSON.stringify(studentData)}`);
    savePictureByBadge(studentView, studentData);
  })  

  return studentView;
}  

module.exports = {createStudentsWindow};