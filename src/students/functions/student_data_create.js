// ----------------------------------------------------------
const appRoot  = require('app-root-path');
const path     = require('node:path')  
const rootPath = appRoot.path;

// ----------------------------------------------------------
const validate_path           = path.join(rootPath, 'src', 'data', 'student_validate_create.js');
const validateStudentObj      = require(validate_path);

const studentProcsPath        = path.join(rootPath, 'src', 'data', 'student_data_procs.js');
const {getNewBadgeNumber}     = require(studentProcsPath);
const {insertStudent}         = require(studentProcsPath);

//---------------------------------------------------------------
function createNewStudent(studentView, studentData) {
  try {
    createValidResults = validateStudentObj.validateStudentDataCreate(studentData);
    if (createValidResults.status == 'err') {
      studentView.webContents.send('saveStudentDataResult', createValidResults);
      return;
    }

    inputValidResults = validateStudentObj.validateStudentData(studentData);
    if (inputValidResults.validationStatus.status === 'err') {
      studentView.webContents.send('saveStudentDataResult', inputValidResults.validationStatus);
      return;
    }
    //badgeNumber = getNewBadgeNumber();
    studentData.badgeNumber = getNewBadgeNumber().badgeNumber;
    insertStudent(studentData);

    result = {'status': 'ok', 'msg' : 'Student record has been added', 'studentData': studentData}
    studentView.webContents.send('saveStudentDataResult', result);
  } catch(err) {
    console.log(`searchStudentData failed: ${JSON.stringify(studentData)}`);
    result = {'status': 'err', 'msg' : err.toString()}
    studentView.webContents.send('saveStudentDataResult', result);
    return;
  }
}

module.exports = {createNewStudent}
