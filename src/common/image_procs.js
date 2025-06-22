const appRoot      = require('app-root-path');
const path         = require('node:path')  
const rootPath     = appRoot.path;
const fs           = require('fs');
const sqlite3      = require('better-sqlite3');
const {getDatabaseLocation} = require(appRoot + '/src/data/create_database.js');

//---------------------------------------------------------------
function SaveCommonAssets() {
  try {
    console.log(`SaveCommonAssets`);
    processAnImage('RISING_SUN_MA.gif');
    processAnImage('RISING_SUN_FOOTER.webp');
    processAnImage('rising-sun-martial-arts-logo.png');
    processAnImage('RSM_Logo1.jpg');
  }
  catch(err) {
    console.log(`Save picture error: ${err}.`)
    throw err;
  }

//---------------------------------------------------------------
function processAnImage(imageName) {
    const assetsPath = path.join(rootPath, 'src', 'assets');
    const imageBytes = fs.readFileSync(path.join(assetsPath, 'RISING_SUN_MA.gif'));
    const imageBase64 = imageBytes.toString('base64');
    savePictureData({'imageName':imageName,'imageBase64':imageBase64,'imageBytes':imageBytes});
  }
}

//---------------------------------------------------------------
function savePictureData(pictureData) {
  const db_directory = getDatabaseLocation();
  let db;
  try {
    const db = new sqlite3(db_directory); 
    db.prepare(`INSERT INTO assets 
                (imageName, imageBase64,imageBytes) 
                VALUES(:imageName, :imageBase64,:imageBytes)
                ON CONFLICT DO NOTHING;`)
      .run(pictureData);
  } catch (err) {
    console.error('Error inserting image:', err);
    throw err; // Re-throw the error for handling by the caller
  } finally {
    if (db) {
      db.close();
    }
  }
}


module.exports = {SaveCommonAssets}