//-------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function(event) {
  console.log(`DOMContentLoaded - Student Search snippet was loaded`);
});

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
window.electronAPI.navEventInvokedResult((result) => {
  console.log(`navEventInvokedResult was activated`);
  if (result.navButtonId == "navSearch") {
    initializeStudentSearch(null, "success", null);
  }
})

//-------------------------------------------------------------------
function initializeStudentSearch(response, status, xhr) {
  console.log(`initializeStudentSearch - invoked: ${JSON.stringify(status)}`);
  if (status == "success" ) {
    // const allButtons = document.getElementsByTagName('button');
    // for (let i = 0; i < allButtons.length; i++) {
    //     console.log(allButtons[i]);
    // }
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', () => {
      invokeSearchByName();
    });  

    searchData = {
      'firstName'    : document.getElementById('srchFirstName').value,
      'lastName'     : document.getElementById('srchLastName').value,
      'badgeNumber'  : document.getElementById('srchBadgeNumber').value,
    }
    disableSearchForm();
    window.electronAPI.searchByName(searchData);
  
  }
};

//-------------------------------------------------------------------
function invokeSearchByName() {
  console.log('invokeSearchByName was called');
  searchData = {
    'firstName'    : document.getElementById('srchFirstName').value,
    'lastName'     : document.getElementById('srchLastName').value,
    'badgeNumber'  : document.getElementById('srchBadgeNumber').value,
  }
  disableSearchForm();
  window.electronAPI.searchByName(searchData);
}

//-------------------------------------------------------------------
window.electronAPI.searchByNameResult((results) => {
  console.log(`searchByNameResult was activated rows returned: ${results.studentData.length}.`);
  enableSearchForm();
  displayStudentData(results.studentData);
})

//-------------------------------------------------------------------
function displayStudentData (studentData) {
  const table = document.getElementById('searchStudentTable');
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  for (let i = 0; i < studentData.length; i++) {
    const row = document.createElement('tr');
    // badge 
    row.appendChild(getTableCell(studentData[i].badgeNumber));
    // picture
    const td1 = document.createElement('td');
    td1.innerHTML = `<img src="data:image/jpg;base64,${studentData[i].imageBase64}" height="35px"></img>`;
    row.appendChild(td1);
    // name
    row.appendChild(getTableCell(studentData[i].lastName + ", " + studentData[i].firstName));
    // rank
    row.appendChild(getTableCell(studentData[i].lastName + ", " + studentData[i].firstName));
    row.addEventListener('click', () => {
      console.log('Row clicked:', row.cells[0].textContent); 
      badgeData = {'badgeNumber': row.cells[0].textContent};
      window.electronAPI.studentSelected(badgeData);      
    });
    tbody.appendChild(row);
  };
  table.appendChild(tbody);
}
function getTableCell(value) {
  const td = document.createElement('td');
  td.textContent = value;
  return td;
}

//-------------------------------------------------------------------
function disableSearchForm() {
  document.getElementById('srchFirstName').disabled = true;
  document.getElementById('srchLastName').disabled = true;
  document.getElementById('srchBadgeNumber').disabled = true;
}
function enableSearchForm() {
  document.getElementById('srchFirstName').disabled = false;
  document.getElementById('srchLastName').disabled = false;
  document.getElementById('srchBadgeNumber').disabled = false;
}