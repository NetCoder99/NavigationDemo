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
    return {'status': 'err', 'msg' : 'Student data was found for first and last name!'};
  }

  firstNameValid = isNameFieldValid(studentData.firstName, "First name");
  lastNameValid  = isNameFieldValid(studentData.lastName, "Last name");
  birthDateValid = isBirthDateValid(studentData.birthDate, "Birth date");

  if (firstNameValid.status == 'err')  {return {'status': 'err', 'msg' : 'First name is required!'};}
  if (lastNameValid.status  == 'err')  {return {'status': 'err', 'msg' : 'Last name is required!'};}
  if (birthDateValid.status == 'err')  {return {'status': 'err', 'msg' : 'Birth date is required!'};}

  return {'status': 'ok', 'msg' : ''};

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