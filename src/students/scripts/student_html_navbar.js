//-------------------------------------------------------------------
function initializeNavbar(response, status, xhr) {
  console.log(`initializeNavbar - invoked: ${JSON.stringify(status)}`);
  if (status == "success" ) {
    document.getElementById('navSearch').addEventListener('click',(event)=>{processNavButton(event);});
    //document.getElementById('navContact').addEventListener('click',(event)=>{processNavButton(event);});
    document.getElementById('navCreate').addEventListener('click',(event)=>{processNavButton(event);});
    document.getElementById('navAttendance').addEventListener('click',(event)=>{processNavButton(event);});
    document.getElementById('navClasses').addEventListener('click',(event)=>{processNavButton(event);});
  }
};

//-------------------------------------------------------------------
window.electronAPI.searchByBadgeResult((result) => {
  console.log(`searchByBadgeResult : StudentNavbar was activated`);
  hideAllPanels();
  ShowActivePanel('navContact');
})

clickCounter = 0;
//-------------------------------------------------------------------
function processNavButton(event) {
  console.log(`processNavButton: ${JSON.stringify(event.target.id)} :: ${clickCounter++} times.`);
  hideAllPanels();
  ShowActivePanel(event.target.id);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function ShowActivePanel(navButtonId) {
  if (navButtonId == 'navSearch') {
    document.getElementById('StudentSearchDiv').classList.remove('iframe_hidden');
    document.getElementById('StudentTableDiv').classList.remove('iframe_hidden');
  }
  if (navButtonId == 'navContact') {
    document.getElementById('StudentContactDiv').classList.remove('iframe_hidden');
  }
  if (navButtonId == 'navCreate') {
    document.getElementById('StudentCreateDiv').classList.remove('iframe_hidden');
  }

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function hideAllPanels() {
  document.getElementById('StudentSearchDiv').className = '';
  document.getElementById('StudentTableDiv').className = '';
  document.getElementById('StudentContactDiv').className = '';
  document.getElementById('StudentSearchDiv').classList.add('iframe_hidden');
  document.getElementById('StudentTableDiv').classList.add('iframe_hidden');
  document.getElementById('StudentContactDiv').classList.add('iframe_hidden');
  document.getElementById('StudentCreateDiv').classList.add('iframe_hidden');
}