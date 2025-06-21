document.addEventListener("DOMContentLoaded", function(event) {
  console.log(`DOMContentLoaded - Student Select Picture`)
});

//-------------------------------------------------------------------
// invoked by the select picture button click event
//-------------------------------------------------------------------
try{
  const selectPicture = document.getElementById('selectPicture');
  selectPicture.addEventListener('click', () => {
    console.log('selectPicture button was clicked');
    document.getElementById('badgeNumber_error').innerHTML = 'Selecting picture for student ...';
    document.getElementById('badgeNumber_error').classList.remove("text-warning"); 
    document.getElementById('badgeNumber_error').classList.add("text-success");     
    window.electronAPI.selectPicture();
  })
  window.electronAPI.selectPictureResult((result) => {
    console.log(`selectPictureResult was activated`);
    document.getElementById('badgeNumber_error').innerHTML = 'Picture was selected.';
    document.getElementById('badgeNumber_error').classList.remove("text-warning"); 
    document.getElementById('badgeNumber_error').classList.add("text-success");     
    studentPicture.src = `data:image/jpg;base64,${result.image_string}`;
    document.getElementById('studentPicturePath').innerHTML = result.file_path;
  })
}
catch(error){console.log(error);}