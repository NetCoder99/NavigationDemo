const sqlite3  = require('better-sqlite3');
const path     = require('path')  

shared_folder = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
console.log(`shared_folder: ${shared_folder}`)

//---------------------------------------------------------------
function getDatabaseLocation() {
  const dbFullPath = path.join(shared_folder, 'Attendance', 'AttendanceV2.db');
  return dbFullPath;
}

//---------------------------------------------------------------
// create the assets db and add new columns to students 
//---------------------------------------------------------------
function updAttendanceDatabase_20250623() {
  execAlterTable(`ALTER TABLE students ADD studentImage     BLOB;`);
  execAlterTable(`ALTER TABLE students ADD studentImagePath TEXT;`);
  execAlterTable(`ALTER TABLE students ADD imageBase64      TEXT;`);
  execAlterTable(`ALTER TABLE students ADD middleName       TEXT;`);

  const createAssetsTableStmt = `
    CREATE TABLE assets (
      imageId INTEGER PRIMARY KEY AUTOINCREMENT,
      imageName TEXT NOT NULL,
      imageBase64 TEXT NOT NULL
    , imageBytes BLOB);
    
    CREATE UNIQUE INDEX assets_imageName_IDX ON assets (imageName);  
  `
  execAlterTable(createAssetsTableStmt);
}
//---------------------------------------------------------------
function execAlterTable(sqlStmt) {
  const db_directory = getDatabaseLocation();
  let db;
  try {
    const db = new sqlite3(db_directory); 
    db.prepare(sqlStmt).run();
  } catch (err) {
    console.error('Error updating table:', err);
    if (!(err.message.includes('duplicate column name') || err.message.includes('already exists'))) {
      throw err;
    }
  } finally {
    if (db) {
      db.close();
    }
  }
};

module.exports = {updAttendanceDatabase_20250623}
