//-------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function(event) {
  console.log(`DOMContentLoaded - Student Create snippet was loaded`);
});

//-------------------------------------------------------------------
function initializeStudentCreate(response, status, xhr) {
  console.log(`initializeStudentCreate - invoked: ${JSON.stringify(status)}`);
  document.getElementById('createButton').addEventListener('click',(event)=>{processCreateButton(event);});
  document.getElementById('selectCreatePicture').addEventListener('click',(event)=>{processSelectPictureCreate(event);});
  document.getElementById('saveCreatePicture').addEventListener('click',(event)=>{processSavePictureCreate(event);});
};

clickCounter = 0;
//-------------------------------------------------------------------
function processSelectPictureCreate(event) {
  console.log(`processSelectPictureCreate: ${clickCounter++} times.`);
  createResultsMessage = document.getElementById('createResultsMessage');
  createResultsMessage.innerHTML = 'Selecting picture ...';
  createResultsMessage.className = '';
  createResultsMessage.classList.add('ms-2', 'fw-bold', 'text-warning');  
  window.electronAPI.selectPicture('create');
}
// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
window.electronAPI.selectPictureResult((result) => {
  console.log(`selectPictureResult was activated`);
  const filePath     = result.file_path;
  studentPicture     = document.getElementById('studentCreatePicture');
  studentPicture.src = `data:image/jpg;base64,${result.image_string}`;
  createResultsMessage = document.getElementById('createResultsMessage');
  createResultsMessage.innerHTML = `Picture was selected: ${filePath}.`;
  createResultsMessage.className = '';
  createResultsMessage.classList.add('ms-2', 'fw-bold', 'text-success');  
})

// //-------------------------------------------------------------------
// function processSavePictureCreate(event) {
//   console.log(`processSavePictureCreate: ${clickCounter++} times.`);
// }
// // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
// window.electronAPI.savePictureResult((result) => {
//   console.log(`selectPictureResult was activated`);
// })

//-------------------------------------------------------------------
function processCreateButton(event) {
  console.log(`processCreateButton: ${clickCounter++} times.`);
  const allFieldValues = GetAllCreateFieldValues();
  DisableCreateInputForm(true);
  window.electronAPI.createNewStudent(allFieldValues);
}

//-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
function DisableCreateInputForm(enableFlag) {
  document.getElementById('createButton').disabled = enableFlag;
  //document.getElementById('createButton').disabled = enableFlag;
  const allFields = GetAllCreateFields();
  for (let key in allFields) {
      //console.log(`${key}: ${allFields[key].id}`);
      if (allFields[key].id.startsWith('inp')) {
        allFields[key].disabled = enableFlag;
      }
  }
}

//-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
window.electronAPI.createNewStudentResult((result) => {
  console.log(`createNewStudentResult : ${JSON.stringify(result)}`);
  DisplayCreateResults(result);
})
function DisplayCreateResults(result) {
  DisableCreateInputForm(false);
  createResultsMessage = document.getElementById('createResultsMessage');
  createResultsMessage.innerHTML = result.msg;
  createResultsMessage.className = '';
  createResultsMessage.classList.add('ms-2');
  createResultsMessage.classList.add('fw-bold');
  if (result.status == 'err') {
    createResultsMessage.classList.add('text-danger');
  }
  else {
    createResultsMessage.classList.add('text-success');
  }
}


//-------------------------------------------------------------------
function DisplayCreateStudentData(studentData) {
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
  allFields.studentPicture.src = `data:image/jpg;base64,${studentData.imageBase64}`;
}
//-------------------------------------------------------------------
function GetAllCreateFieldValues() {
  const createForm = document.getElementById('frmCreate');
  return {
    'badgeNumber' : createForm.querySelector('#badgeNumberLbl').innerHTML,
    'memberSince' : createForm.querySelector('#memberSinceLbl').innerHTML,
    'firstName' : createForm.querySelector('#inpFirstName').value,
    'lastName'  : createForm.querySelector('#inpLastName').value,
    'address'   : createForm.querySelector('#inpAddress').value,
    'address2'  : createForm.querySelector('#inpAddress2').value,
    'city'      : createForm.querySelector('#inpCity').value,
    'state'     : createForm.querySelector('#inpState').value,
    'zipCode'   : createForm.querySelector('#inpZipCode').value,
    'birthDate' : createForm.querySelector('#inpBirthDate').value,
    'phoneHome' : createForm.querySelector('#inpPhoneHome').value,
    'email'     : createForm.querySelector('#inpEmail').value,    
  }
}

//-------------------------------------------------------------------
function GetAllCreateFields() {
  const createForm = document.getElementById('frmCreate');
  return {
    'badgeNumberLbl' : createForm.querySelector('#badgeNumberLbl'),
    'memberSinceLbl' : createForm.querySelector('#memberSinceLbl'),
    'firstName' : createForm.querySelector('#inpFirstName'),
    'lastName'  : createForm.querySelector('#inpLastName'),
    'address'   : createForm.querySelector('#inpAddress'),
    'address2'  : createForm.querySelector('#inpAddress2'),
    'city'      : createForm.querySelector('#inpCity'),
    'state'     : createForm.querySelector('#inpState'),
    'zipCode'   : createForm.querySelector('#inpZipCode'),
    'birthDate' : createForm.querySelector('#inpBirthDate'),
    'phoneHome' : createForm.querySelector('#inpPhoneHome'),
    'email'     : createForm.querySelector('#inpEmail'),
    'studentPicture' : document.getElementById('studentCreatePicture')    
  }
}

//-------------------------------------------------------------------
function FormatDateDisplay(dateString) {
  const dateObject    = new Date(dateString);
  const isoString     = dateObject.toISOString();
  const formattedDate = isoString.split("T")[0];
  return formattedDate;
}