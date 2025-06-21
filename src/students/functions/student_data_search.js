// ----------------------------------------------------------
const appRoot  = require('app-root-path');
const path     = require('node:path')  
const rootPath = appRoot.path;

// ----------------------------------------------------------
const validate_path           = path.join(rootPath, 'src', 'data', 'student_validate.js');
const validateStudentObj      = require(validate_path);

const studentProcsPath          = path.join(rootPath, 'src', 'data', 'student_data_procs.js');
const {searchStudentData}       = require(studentProcsPath);
const {searchStudentDataByName} = require(studentProcsPath);

//---------------------------------------------------------------
function searchByBadgeFunction(studentView, badgeData) {
  try {
    badgeValidResults = validateStudentObj.isBadgeNumberValid(badgeData.badgeNumber);
    if (badgeValidResults.status === 'err') {
      studentView.webContents.send('searchByBadgeResult', badgeValidResults);
      return;
    }
    studentData = searchStudentData(badgeData.badgeNumber);
    if (!studentData) {
      result = {'status': 'err', 'msg' : 'No student data found for that badge number'}
      studentView.webContents.send('searchByBadgeResult', result);
      return;
    }
    console.log(`searchStudentData returned`);
    result = {'status': 'ok', 'msg' : 'Success', 'studentData': studentData}
    studentView.webContents.send('searchByBadgeResult', result);
  } catch(err) {
    console.log(`searchStudentData failed`);
    result = {'status': 'err', 'msg' : err}
    studentView.webContents.send('searchByBadgeResult', result);
    return;
  }

}

//---------------------------------------------------------------
function searchByNameFunction(studentView, searchData) {
  try {
    studentData = searchStudentDataByName(searchData);
    if (!studentData) {
      result = {'status': 'err', 'msg' : 'No student data found for that badge number'}
      studentView.webContents.send('searchByNameResult', result);
      return;
    }
    console.log(`searchStudentData returned`);
    result = {'status': 'ok', 'msg' : 'Success', 'studentData': studentData}
    studentView.webContents.send('searchByNameResult', result);
  } catch(err) {
    console.log(`searchStudentData failed`);
    result = {'status': 'err', 'msg' : err.message}
    studentView.webContents.send('searchByNameResult', result);
    return;
  }

}

module.exports = {searchByBadgeFunction, searchByNameFunction}
