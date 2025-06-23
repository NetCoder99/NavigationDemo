const fs       = require('fs');
const sqlite3  = require('sqlite3');
const path     = require('node:path')  

shared_folder = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
console.log(`shared_folder: ${shared_folder}`)

// //---------------------------------------------------------------
// function getAttendanceDatabaseV2() {
//   db_directory = shared_folder + '/Attendance'
//   if (!fs.existsSync(db_directory)) {
//     fs.mkdirSync(db_directory, { recursive: true });
//     console.log(`Directory created at ${db_directory}`);
//   } else {
//     console.log(`Directory already exists at ${db_directory}`);
//   }
//   return new sqlite3.Database(db_directory + '/AttendanceV2.db');
// }

//---------------------------------------------------------------
function getSharedPath() {
  return shared_folder;
}

//---------------------------------------------------------------
function getDatabaseLocation() {
  const dbFullPath = path.join(shared_folder, 'Attendance', 'AttendanceV2.db');
  return dbFullPath;
}


module.exports = {getDatabaseLocation, getSharedPath};

