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
    if (createValidResults.overall.status == 'err') {
      studentView.webContents.send('createNewStudentResult', createValidResults);
      return;
    }

    const badgeNumber = getNewBadgeNumber().badgeNumber;
    studentData.badgeNumber = badgeNumber;
    insertStudent(studentData);
    
    results = {'status': 'ok', 'msg' : 'Student record has been added', 'studentData': studentData}
    setTimeout(() => {
      studentView.webContents.send('createNewStudentResult', results);
    }, 1000);  

  } catch(err) {
    console.log(`searchStudentData failed: ${JSON.stringify(studentData)}`);
    result = {'status': 'err', 'msg' : err.toString()}
    studentView.webContents.send('createNewStudentResult', result);
    return;
  }
}

module.exports = {createNewStudent}
