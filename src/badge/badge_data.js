const appRoot      = require('app-root-path');
const sqlite3  = require('better-sqlite3');
const {getDatabaseLocation} = require(appRoot + '/src/data/create_database.js');

const getBadgeDataStr = `
  select badgeNumber   as badgeNumber ,
  firstName            as firstName ,
  lastName             as lastName ,
  'Rising Sun Martial Arts'                               as title1,
  'Building tomorrows leaders, one black belt at a time!' as title2,
  'Birthday: ' || birthDate    as subField1,
  'Since: '    || memberSince  as subField2,
  '/src/assets/RSM_Logo1.jpg'  as schoolLogoPath,
  '/src/assets/RSM_Logo1.jpg'  as studentImagePath,
  '/src/assets/' || badgeNumber || '.png' as barcodeImagePath,
  studentImage                 as studentImage, 
  imageBase64                  as studentImageBase64, 
  (select imageBytes  from   assets 
   where  imageName = 'RISING_SUN_MA.gif') as schoolLogoGif,
  (select imageBytes  from   assets 
   where  imageName = 'RSM_Logo1.jpg') as schoolLogoJpg
  from  students 
  where badgeNumber = :badgeNumber
`;

function getBadgeData(badgeNumber) {
  try {
    const db_directory = getDatabaseLocation();
    const db           = new sqlite3(db_directory); 
    const searchStmt   = db.prepare(getBadgeDataStr);
    const row          = searchStmt.get({'badgeNumber':badgeNumber});
    db.close();
    return row;
  } catch (err) {
    console.error('Error searching by by badge', err); throw err; 
  } 
}

//---------------------------------------------------------------
module.exports = {getBadgeData}
