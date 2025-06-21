// ----------------------------------------------------------
const appRoot  = require('app-root-path');
const path     = require('node:path')  
const rootPath = appRoot.path;

// ----------------------------------------------------------
const validate_path           = path.join(rootPath, 'src', 'data', 'student_validate.js');
const validateStudentObj      = require(validate_path);

const studentProcsPath        = path.join(rootPath, 'src', 'data', 'student_data_procs.js');
const {searchStudentData}     = require(studentProcsPath);
const {updateStudentData}     = require(studentProcsPath);

//---------------------------------------------------------------
function saveStudentData(studentView, studentData) {
  try {
    badgeValidResults = validateStudentObj.isBadgeNumberValid(studentData.badgeNumber);
    if (badgeValidResults.status === 'err') {
      studentView.webContents.send('saveStudentDataResult', badgeValidResults);
      return;
    }

    studentDataTmp = searchStudentData(studentData.badgeNumber);
    if (!studentDataTmp) {
      result = {'status': 'err', 'msg' : 'No student data found for that badge number'}
      studentView.webContents.send('saveStudentDataResult', result);
      return;
    }

    inputValidResults = validateStudentObj.validateStudentData(studentData);
    if (inputValidResults.validationStatus.status === 'err') {
      studentView.webContents.send('saveStudentDataResult', inputValidResults.validationStatus);
      return;
    }

    updateStudentData(studentData);

    result = {'status': 'ok', 'msg' : 'Student data has been updated', 'studentData': studentData};
    setTimeout(() => {
      studentView.webContents.send('saveStudentDataResult', result);
    }, 1000);  

  } catch(err) {
    console.log(`searchStudentData failed: ${JSON.stringify(studentData)}`);
    if (err.message) {result = {'status': 'err', 'msg' : err.message}}
    else {result = {'status': 'err', 'msg' : err.toString()}}
    studentView.webContents.send('saveStudentDataResult', result);
    return;
  }
}

module.exports = {saveStudentData}
