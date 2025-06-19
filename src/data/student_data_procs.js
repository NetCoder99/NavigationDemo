const appRoot  = require('app-root-path');
const sqlite3  = require('better-sqlite3');
const {getDatabaseLocation} = require(appRoot + '/src/data/create_database.js');
const {formatCheckinDate}   = require(appRoot + '/src/data/format_date.js');

// ----------------------------------------------------------------------------------------------
const searchStudentStmt = `
  SELECT  badgeNumber 
       ,ifnull(firstName,  '') as firstName
       ,ifnull(middleName, '') as middleName 
       ,ifnull(lastName,   '') as lastName 
       ,ifnull(namePrefix, '') as namePrefix 
       ,ifnull(email,      '') as email
       ,ifnull(address,    '') as address
       ,ifnull(address2,   '') as address2
       ,ifnull(city,       '') as city
       ,ifnull(country,    '') as country
       ,ifnull(state,      '') as state
       ,ifnull(zip,        '') as zipCode
       ,ifnull(birthDate,  '') as birthDate
       ,ifnull(phoneHome,  '') as phoneHome
       ,ifnull(phoneMobile, '') as phoneMobile
       ,ifnull(status,      '') as status
       ,ifnull(memberSince, '') as memberSince
       ,ifnull(gender,      '') as gender
       ,ifnull(currentRank, '') as currentRank
       ,ifnull(ethnicity,   '') as ethnicity
       ,studentImage            as studentImage
       ,imageBase64             as imageBase64
  FROM  students
  where badgeNumber = ?
`
function searchStudentData(badgeNumber) {
  try {
    const db_directory = getDatabaseLocation();
    const db           = new sqlite3(db_directory); 
    const searchStmt   = db.prepare(searchStudentStmt);
    const row          = searchStmt.get(badgeNumber);
    db.close();
    return row;
  } catch (err) {
    console.error('Error searching by by badge', err); throw err; 
  } 
}


// ----------------------------------------------------------------------------------------------
const searchStudentDataByNameStmt = `
  SELECT  badgeNumber 
       ,ifnull(firstName,  '') as firstName
       ,ifnull(middleName, '') as middleName 
       ,ifnull(lastName,   '') as lastName 
       ,ifnull(namePrefix, '') as namePrefix 
       ,ifnull(email,      '') as email
       ,ifnull(address,    '') as address
       ,ifnull(address2,   '') as address2
       ,ifnull(city,       '') as city
       ,ifnull(country,    '') as country
       ,ifnull(state,      '') as state
       ,ifnull(zip,        '') as zipCode
       ,ifnull(birthDate,  '') as birthDate
       ,ifnull(phoneHome,  '') as phoneHome
       ,ifnull(phoneMobile, '') as phoneMobile
       ,ifnull(status,      '') as status
       ,ifnull(memberSince, '') as memberSince
       ,ifnull(gender,      '') as gender
       ,ifnull(currentRank, '') as currentRank
       ,ifnull(ethnicity,   '') as ethnicity
       ,studentImage            as studentImage
       ,imageBase64             as imageBase64
  FROM  students
  where  lower(lastName)   like :lastName
  and    lower(firstName)  like :firstName
  order  by lastName   
`
function searchStudentDataByName(searchData) {
  try {
    const db_directory = getDatabaseLocation();
    const db           = new sqlite3(db_directory); 
    const searchStmt   = db.prepare(searchStudentDataByNameStmt);
    searchParms = {
      'lastName'  : searchData.lastName.toLowerCase() + '%',
      'firstName' : searchData.firstName.toLowerCase() + '%',
    }
    const rows         = searchStmt.all(searchParms);
    db.close();
    return rows;
  } catch (err) {
    console.error('Error searching by by badge', err); throw err; 
  } 
}

//---------------------------------------------------------------
function savePictureData(pictureData) {
  const db_directory = getDatabaseLocation();
  let db;
  try {
    const db = new sqlite3(db_directory); 
    db.prepare("update students set studentImage=?, imageBase64=?, studentImagePath=? where badgeNumber=?")
      .run(pictureData.imageBuffer, pictureData.imageBase64, pictureData.imagePath, pictureData.badgeNumber);
  } catch (err) {
    console.error('Error fetching row:', err);
    throw err; // Re-throw the error for handling by the caller
  } finally {
    if (db) {
      db.close();
    }
  }
}

// ----------------------------------------------------------------------------------------------
const updateStudentStmt = `
  update students
  set    firstName   = :firstName,
         lastName    = :lastName,
         birthDate   = :birthDate,
         state       = :state,
         zip         = :zip
  where  badgeNumber = :badgeNumber;        
`
function updateStudentData(studentData) {
  try {
    day     = studentData.birthDate.slice(8, 10);
    month   = studentData.birthDate.slice(5, 7);
    year    = studentData.birthDate.slice(0, 4);
    fmtDate = `${month}/${day}/${year}`;
    const db_directory = getDatabaseLocation();
    const db           = new sqlite3(db_directory); 
    db_info = db.prepare(updateStudentStmt)
      .run({
        'firstName'   : studentData.firstName,
        'lastName'    : studentData.lastName,
        'birthDate'   : fmtDate,
        'badgeNumber' : studentData.badgeNumber,
        'state'       : studentData.state,
        'zip'         : studentData.zipCode,
    });
    db.close();
  } catch (err) {
    console.error('Error updating student data', err); throw err; 
  } 
}

// ----------------------------------------------------------------------------------------------
const getNewBadgeNumberStmt = `
  select max(badgeNumber)+1 as badgeNumber
  from   students s
  where  badgeNumber != '';
`
function getNewBadgeNumber() {
  try {
    const db_directory = getDatabaseLocation();
    const db           = new sqlite3(db_directory); 
    row = db.prepare(getNewBadgeNumberStmt).get();
    db.close();
    return row;
  } catch (err) {
    console.error('Error updating student data', err); throw err; 
  } 
}

// ----------------------------------------------------------------------------------------------
const insertStudentStmt = `
  insert into students
  (
     'badgeNumber'
    ,'firstName'
    ,'middleName'
    ,'lastName'
    ,'birthDate'
    ,'badgeNumber'
    ,'state'
    ,'zip' 
    ,'memberSince'
  )
  values 
  (
     :badgeNumber
    ,:firstName
    ,:middleName
    ,:lastName
    ,:birthDate
    ,:badgeNumber
    ,:state
    ,:zip
    ,:memberSince
  );
`
function insertStudent(studentData) {
  try {
    day     = studentData.birthDate.slice(8, 10);
    month   = studentData.birthDate.slice(5, 7);
    year    = studentData.birthDate.slice(0, 4);
    fmtDate = `${month}/${day}/${year}`;

    const memberSinceDate = new Date();
    sinceDay     = memberSinceDate.getDate();
    sinceMonth   = memberSinceDate.getMonth() + 1;
    sinceYear    = memberSinceDate.getFullYear();
    const memberSinceFmt = `${sinceMonth}/${sinceDay}/${sinceYear}`;

    const db_directory = getDatabaseLocation();
    const db           = new sqlite3(db_directory); 
    db_info = db.prepare(insertStudentStmt)
      .run({
        'badgeNumber' : studentData.badgeNumber,
        'firstName'   : studentData.firstName,
        'middleName'  : studentData.middleName,
        'lastName'    : studentData.lastName,
        'birthDate'   : fmtDate,
        'badgeNumber' : studentData.badgeNumber,
        'state'       : studentData.state,
        'zip'         : studentData.zipCode,
        'memberSince' : memberSinceFmt
    });
    db.close();
  } catch (err) {
    console.error('Error updating student data', err); throw err; 
  } 
}

module.exports = {
  searchStudentData, 
  searchStudentDataByName,
  savePictureData, 
  updateStudentData, 
  getNewBadgeNumber,
  insertStudent
}