// ----------------------------------------------------------
const appRoot  = require('app-root-path');
const path     = require('node:path')  
const rootPath = appRoot.path;

// ----------------------------------------------------------
const validate_path           = path.join(rootPath, 'src', 'data', 'student_validate.js');
const validateStudentObj      = require(validate_path);

const studentProcsPath        = path.join(rootPath, 'src', 'data', 'student_data_procs.js');
const {searchStudentData, savePictureData}     = require(studentProcsPath);

//---------------------------------------------------------------
async function savePictureByBadge(studentView, badgeData) {
  console.log(`savePictureByBadge was called: ${JSON.stringify(badgeData)}`);
  validationResult = validateStudentObj.isBadgeNumberValid(badgeData.badgeNumber)
  if (validationResult.status === 'err') {
    console.log(`savePictureByBadge: badge was invalid - ${JSON.stringify(validationResult)}`);
    studentView.webContents.send('savePictureResult', validationResult);
    return;      
  }

  const studentData = searchStudentData(badgeData.badgeNumber);
  if (!studentData){
    results = {'status': 'err', 'msg' : 'Badge number does not exist'};
    console.log(`savePictureByBadge: badge was not found - ${JSON.stringify(results)}`);
    studentView.webContents.send('savePictureResult', results);
    return;      
  }

  const resizeImagePath         = path.join(rootPath, 'src', 'pages', 'students', 'scripts', 'functions', 'scale_image.js');
  const {scaleImageToHeight}    = require(resizeImagePath);
  console.log(`savePictureByBadge: saving picture`);
  const resizedImage = await scaleImageToHeight(badgeData.picturePath, null, 300) ;
  const base64String = Buffer.from(resizedImage).toString('base64');
  imageBytes  = null;
  pictureData = {
    'badgeNumber' : badgeData.badgeNumber,
    'imageBase64' : base64String,
    'imagePath'   : badgeData.picturePath,
    'imageBuffer' : resizedImage
  };

  try {
    savePictureData(pictureData);
  }
  catch(err) {
    console.log(`Save picture error: ${err}.`)
  }

  results = {'status': 'ok', 'msg' : 'Student picture has been updated.'};
  studentView.webContents.send('savePictureResult', results);
  return;      

}

function saveSchoolImages () {
  console.log(`saveSchoolImages.`)

}

module.exports = {savePictureByBadge, saveSchoolImages}
