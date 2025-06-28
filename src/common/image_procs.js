const appRoot      = require('app-root-path');
const path         = require('node:path')  
const rootPath     = appRoot.path;
const fs           = require('fs');
const sqlite3      = require('better-sqlite3');
const sharp        = require('sharp');
const {getDatabaseLocation} = require(appRoot + '/src/data/create_database.js');

const resizeImagePath      = path.join(rootPath, 'src', 'data', 'scale_image.js');
const {scaleImageToHeight} = require(resizeImagePath);

//---------------------------------------------------------------
async function SaveCommonAssets() {
  try {
    console.log(`SaveCommonAssets`);
    await processAnImage('RISING_SUN_MA.gif');
    await processAnImage('RISING_SUN_FOOTER.webp');
    await processAnImage('rising-sun-martial-arts-logo.png');
    await processAnImage('RSM_Logo1.jpg');
  }
  catch(err) {
    console.log(`Save picture error: ${err}.`)
    throw err;
  }

//---------------------------------------------------------------
async function processAnImage(imageName) {
  console.log(`processAnImage: ${imageName}`);
  const assetsPath   = path.join(rootPath, 'src', 'assets');
  const imagePath    = path.join(assetsPath, imageName)
  const imageBytes   = fs.readFileSync         (imagePath);
  const resizedImage = await scaleImageToHeight(imagePath, 200) ;
  const imageBase64  = Buffer.from(resizedImage).toString('base64');
  savePictureData({'imageName':imageName,'imageBase64':imageBase64,'imageBytes':imageBytes});
  }
}

//---------------------------------------------------------------
function savePictureData(pictureData) {
  console.log(`savePictureData: ${pictureData.imageName}`);
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

//---------------------------------------------------------------
function getAssetImage(imageName) {
  const db_directory = getDatabaseLocation();
  let db;
  try {
    const db = new sqlite3(db_directory); 
    const imageSelectStmt = `select imageBase64, imageBytes from assets where imageName = :imageName`;
    if (imageName.constructor == Object) {
      row = db.prepare(imageSelectStmt).get(imageName);
    }
    else {
      row = db.prepare(imageSelectStmt).get({'imageName' : imageName});
    }
    return row;
  } catch (err) {
    console.error('Error inserting image:', err);
    throw err; // Re-throw the error for handling by the caller
  } finally {
    if (db) {
      db.close();
    }
  }
}

module.exports = {SaveCommonAssets, getAssetImage}