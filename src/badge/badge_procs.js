const PDFWindow = require('electron-pdf-window');
const appRoot   = require('app-root-path');
const path      = require('node:path');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const {generateBarcodeImage}   = require(appRoot + '/src/barcode_printer/barcode_generator.js');
const {createBadgePdf}         = require(appRoot + '/src/barcode_printer/badge_generator.js');
const {getTestStudentData}     = require(appRoot + '/src/barcode_printer/test_data.js');
const {getBadgeData}           = require(appRoot + '/src/data/badge_data.js');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function createAndDisplayBadgeWindow () {
  const pdfWindow = new PDFWindow({
    width: 1200,
    height: 800,
    webPreferences: { }
  });
  pdfPath = appRoot + '/output/test_file2.pdf';
  pdfWindow.loadFile(pdfPath);
}

// ------------------------------------------------------------
async function generateStudentBadge(studentData, studentsView) {
  console.log(`generateBadge was clicked: ${JSON.stringify(studentData)}`);
  if (!studentData.badgeNumber) {
    const result = {'error' : 'Badge number is required.'}
    studentsView.webContents.send('generateBadgeResult', result);
  }
  else {
    generateBarcodeImage(studentData.badgeNumber);
    studentBadgeData  = getTestStudentData();
    studentBadgeData2 = await getBadgeData(studentData.badgeNumber);
    updateBadgeDataForApp(studentBadgeData2);
    createBadgePdf(studentBadgeData2, doneWritingPdf)
    setTimeout(() => {
      console.log(`generateBadge is processing`);
      const result = {'error': ''};
      studentsView.webContents.send('generateBadgeResult', result);
    }, 1000);    
  }
}

// ------------------------------------------------------------
function doneWritingPdf() {
  console.log(`doneWritingPdf is creating pdf window`);
  createAndDisplayBadgeWindow();
}

// ------------------------------------------------------------
function updateBadgeDataForApp(studentBadgeData) {
  if (!studentBadgeData.subField1) {
    studentBadgeData.subField1 = "Birthday: 01/01/1753";
  }
  if (!studentBadgeData.subField2) {
    sinceDate = formatDispayDate(new Date());
    studentBadgeData.subField1 = "Since: " + sinceDate;
  }
  app_path = appRoot.path;
  studentBadgeData.schoolLogoPath    = path.join(app_path, studentBadgeData.schoolLogoPath);
  studentBadgeData.studentImagePath  = path.join(app_path, studentBadgeData.studentImagePath);
  //studentBadgeData.barcodeImagePath  = path.join(app_path, studentBadgeData.barcodeImagePath);
  studentBadgeData.barcodeImagePath  = path.join(app_path, 'output', studentBadgeData.badgeNumber + '.png');
}

// ------------------------------------------------------------
function formatDispayDate(dateValue) {
  let day    = ("0" + dateValue.getDate()).slice(-2);
  let month  = ("0" + (dateValue.getMonth() + 1)).slice(-2);
  let year   = dateValue.getFullYear();
  return day + "/" + month + "/" + year;
}

module.exports = {generateStudentBadge}