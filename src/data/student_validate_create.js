const appRoot  = require('app-root-path');
const path     = require('node:path')  
const rootPath = appRoot.path;

const studentProcsPath        = path.join(rootPath, 'src', 'data', 'student_data_procs.js');
const studentProcsPathObj     = require(studentProcsPath);

//---------------------------------------------------------------
function validateStudentDataCreate(studentData) { 
  searchData = {
    'lastName' : studentData.lastName,
    'firstName' : studentData.firstName
  }
  studentCount = studentProcsPathObj.countStudentsByName(searchData);
  if (studentCount > 0) {
    return {'status': 'err', 'msg' : 'Student data found for first and last name!'};
  }


  initValidation = {
    'validationStatus' : {},
    'badgeNumber': isBadgeNumberValid(studentData.badgeNumber),
    'firstName'  : isNameFieldValid(studentData.firstName, "First name"),
    'lastName'   : isNameFieldValid(studentData.lastName,  "Last name"),
    'birthDate'  : isBirthDateValid(studentData.birthDate,  "Birth date"),
  };
  if (initValidation.firstName.status === 'err') {
    initValidation.validationStatus = {'status': 'err', 'msg' : initValidation.firstName.msg, 'fieldName' : 'firstName'};
  }
  else if (initValidation.lastName.status === 'err') {
    initValidation.validationStatus = {'status': 'err', 'msg' : initValidation.lastName.msg, 'fieldName' : 'lastName'};
  }
  else if (initValidation.birthDate.status === 'err') {
    initValidation.validationStatus = {'status': 'err', 'msg' : initValidation.birthDate.msg, 'fieldName' : 'birthDate'};
  }
  else {
    initValidation.validationStatus = {'status': 'ok', 'msg' : "Student Data was ok"};
  }
  return initValidation;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// possible error conditions:
//   Is empty or undefined
//   Is not numeric
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function isBadgeNumberValid(badgeNumber) {
  if (badgeNumber == null || (typeof badgeNumber === 'string' && badgeNumber.trim().length === 0)) {
    return {'status': 'err', 'msg' : 'Badge number is required'};
  }  
  else if (!isInteger(badgeNumber)) {
    return {'status': 'err', 'msg' : 'Badge number must be an integer'};
  }
  else {
    return {'status': 'ok', 'msg' : ''};
  }
}

function isInteger(value) {
  return /^\d+$/.test(value);
}

function isNameFieldValid(inpField, fieldName) {
  if (inpField == null || (typeof inpField === 'string' && inpField.trim().length === 0)) {
    return {'status': 'err', 'msg' : `${fieldName} is required`};
  }  
  else {
    return {'status': 'ok', 'msg' : ''};
  }
}

function isBirthDateValid(inpField, fieldName) {
  if (inpField == null || (typeof inpField === 'string' && inpField.trim().length === 0)) {
    return {'status': 'err', 'msg' : `${fieldName} is required`};
  }  
  else {
    return {'status': 'ok', 'msg' : ''};
  }
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// any field error will prevent updating the database 
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function isOkToUpdate(result) {
  for (const [key, value] of Object.entries(result)) {
    console.log(`Key: ${key}, Value: ${value.status}`);
    if (value.status === 'err') { return false; }
  }
  return true;
}

module.exports = {
  validateStudentDataCreate, 
  validateStudentDataCreate,
  isBadgeNumberValid,
  isOkToUpdate
};