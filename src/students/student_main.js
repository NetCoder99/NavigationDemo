const {WebContentsView, ipcMain, dialog } = require('electron/main') 
const PDFWindow = require('electron-pdf-window');
const appRoot   = require('app-root-path');
const path      = require('node:path')  
const rootPath  = appRoot.path;

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

  //studentView.webContents.openDevTools();

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const studentSearchPath       = path.join(rootPath, 'src', 'students', 'functions', 'student_data_search.js');
  const {searchByNameFunction}  = require(studentSearchPath);
  const {searchByBadgeFunction} = require(studentSearchPath);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const commonAssetsProcsPath   = path.join(rootPath, 'src', 'common', 'image_procs');
  const {SaveCommonAssets}      = require(commonAssetsProcsPath);
  SaveCommonAssets();

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const updTablesPath           = path.join(rootPath, 'src', 'data', 'alter_database');
  const {updAttendanceDatabase_20250623}      = require(updTablesPath);
  updAttendanceDatabase_20250623();

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
  ipcMain.on('selectPicture', (event, source) => {
    console.log(`selectPicture was clicked from: ${source}`);
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

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const badgeProcsSubPath      = path.join(rootPath, 'src', 'badge');
  const {generateBarcodeImage} = require(path.join(badgeProcsSubPath, 'barcode_generator'));
  const {createBadgePdf}       = require(path.join(badgeProcsSubPath, 'badge_generator'));
  const {getBadgeData}         = require(path.join(badgeProcsSubPath, 'badge_data'));
  ipcMain.on('createBadge', (event, badgeData) => {
    console.log(`createBadge was clicked: ${JSON.stringify(badgeData)}`);
    generateBarcodeImage(badgeData.badgeNumber);
    const genBadgeData = getBadgeData(badgeData.badgeNumber);
    //console.log(`genBadgeData: ${JSON.stringify(genBadgeData)}`);
    createBadgePdf(genBadgeData, badgeGenerateComplete);
  })  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function badgeGenerateComplete(pdfOutputPath) {
    console.log(`badgeGenerateComplete`);
    const pdfWindow = new PDFWindow({
      width: 1200,
      height: 800,
      webPreferences: { }
    });
    pdfWindow.loadFile(pdfOutputPath);
  }
// // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// function createAndDisplayBadgeWindow () {
//   const pdfWindow = new PDFWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: { }
//   });
//   pdfPath = appRoot + '/output/test_file2.pdf';
//   pdfWindow.loadFile(pdfPath);
// }

  return studentView;
}  

module.exports = {createStudentsWindow};