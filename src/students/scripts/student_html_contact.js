//-------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function(event) {
  console.log(`DOMContentLoaded - Student Contact snippet was loaded`);
});

//-------------------------------------------------------------------
function initializeStudentContact(response, status, xhr) {
  console.log(`initializeStudentContact - invoked: ${JSON.stringify(status)}`);
  document.getElementById('saveButton').addEventListener('click',(event)=>{processSaveButton(event);});
  //document.getElementById('createButton').addEventListener('click',(event)=>{processCreateButton(event);});
};

clickCounter = 0;
//-------------------------------------------------------------------
function processSaveButton(event) {
  console.log(`processSaveButton: ${clickCounter++} times.`);
  saveResultsMessage = document.getElementById('saveResultsMessage');
  saveResultsMessage.innerHTML = "Updating student details ...";
  saveResultsMessage.className = '';
  saveResultsMessage.classList.add('ms-2');
  saveResultsMessage.classList.add('fw-bold');
  DisableInputForm(true);
  window.electronAPI.saveStudentData(GetAllFieldValues());
}
//-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
function DisableInputForm(enableFlag) {
  document.getElementById('saveButton').disabled = enableFlag;
  //document.getElementById('createButton').disabled = enableFlag;
  const allFields = GetAllFields();
  for (let key in allFields) {
      console.log(`${key}: ${allFields[key].id}`);
      if (allFields[key].id.startsWith('inp')) {
        allFields[key].disabled = enableFlag;
      }
  }
}
//-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
window.electronAPI.saveStudentDataResult((result) => {
  console.log(`saveStudentDataResult : ${JSON.stringify(result)}`);
  DisplaySaveResults(result);
})
function DisplaySaveResults(result) {
  DisableInputForm(false);
  saveResultsMessage = document.getElementById('saveResultsMessage');
  saveResultsMessage.innerHTML = result.msg;
  saveResultsMessage.className = '';
  saveResultsMessage.classList.add('ms-2');
  saveResultsMessage.classList.add('fw-bold');
  if (result.status == 'err') {
    saveResultsMessage.classList.add('text-danger');
  }
  else {
    saveResultsMessage.classList.add('text-success');
  }

}

//-------------------------------------------------------------------
function processCreateButton(event) {
  console.log(`processCreateButton: ${clickCounter++} times.`);
  const allFieldValues = GetAllFieldValues();
  window.electronAPI.createNewStudent(allFieldValues);
}

//-------------------------------------------------------------------
window.electronAPI.searchByBadgeResult((result) => {
  console.log(`searchByBadgeResult : StudentContact was activated`);
  document.getElementById('saveResultsMessage').innerHTML = "Waiting for input...";
  DisplayStudentData(result.studentData);
})

//-------------------------------------------------------------------
function DisplayStudentData(studentData) {
  const allFields = GetAllFields();
  allFields.badgeNumberLbl.innerHTML = studentData.badgeNumber;
  allFields.memberSinceLbl.innerHTML = studentData.memberSince;
  allFields.firstName.value = studentData.firstName;
  //allFields.middleName.value = studentData.middleName;
  allFields.lastName.value = studentData.lastName;
  allFields.address.value = studentData.address;
  allFields.address2.value = studentData.address2;
  allFields.city.value = studentData.city;
  allFields.state.value = studentData.state;
  allFields.zipCode.value = studentData.zipCode;
  allFields.birthDate.value = FormatDateDisplay(studentData.birthDate);
  allFields.phoneHome.value = studentData.phoneHome;
  allFields.email.value = studentData.email;
}
//-------------------------------------------------------------------
function GetAllFieldValues() {
  return {
    'badgeNumber' : document.getElementById('badgeNumberLbl').innerHTML,
    'memberSince' : document.getElementById('memberSinceLbl').innerHTML,
    'firstName' : document.getElementById('inpFirstName').value,
    'lastName'  : document.getElementById('inpLastName').value,
    'address'   : document.getElementById('inpAddress').value,
    'address2'  : document.getElementById('inpAddress2').value,
    'city'      : document.getElementById('inpCity').value,
    'state'     : document.getElementById('inpState').value,
    'zipCode'   : document.getElementById('inpZipCode').value,
    'birthDate' : document.getElementById('inpBirthDate').value,
    'phoneHome' : document.getElementById('inpPhoneHome').value,
    'email'     : document.getElementById('inpEmail').value,    
  }
}

//-------------------------------------------------------------------
function GetAllFields() {
  return {
    'badgeNumberLbl' : document.getElementById('badgeNumberLbl'),
    'memberSinceLbl' : document.getElementById('memberSinceLbl'),
    'firstName' : document.getElementById('inpFirstName'),
    'lastName'  : document.getElementById('inpLastName'),
    'address'   : document.getElementById('inpAddress'),
    'address2'  : document.getElementById('inpAddress2'),
    'city'      : document.getElementById('inpCity'),
    'state'     : document.getElementById('inpState'),
    'zipCode'   : document.getElementById('inpZipCode'),
    'birthDate' : document.getElementById('inpBirthDate'),
    'phoneHome' : document.getElementById('inpPhoneHome'),
    'email'     : document.getElementById('inpEmail'),
  }
}

//-------------------------------------------------------------------
function FormatDateDisplay(dateString) {
  const dateObject    = new Date(dateString);
  const isoString     = dateObject.toISOString();
  const formattedDate = isoString.split("T")[0];
  return formattedDate;
}