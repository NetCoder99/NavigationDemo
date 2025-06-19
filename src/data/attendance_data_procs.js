const appRoot  = require('app-root-path');
const sqlite3  = require('better-sqlite3');

const {getDatabaseLocation} = require(appRoot + '/src/data/create_database.js');
const {formatCheckinDate, formatCheckinTime, formatCheckinDateTime} = require(appRoot + '/src/common/format_date.js') ;

//-----------------------------------------------------------------------------------
function insertCheckinRecord(badgeNumber) {
  const insertCheckInStmt = `
    INSERT INTO attendance(badgeNumber, checkinDateTime, checkinDate, checkinTime, studentName)
    VALUES(?, ?, ?, ?, ?);`

  const db_directory = getDatabaseLocation();
  const db           = new sqlite3(db_directory); 
  try {
    const insertStmt   = db.prepare(insertCheckInStmt);
    const crnt_datetime = new Date();crnt_datetime.toISOString().replace('T', ' ')
    checkinDateTime = formatCheckinDateTime(crnt_datetime);
    checkinDate     = formatCheckinDate(crnt_datetime);
    checkinTime     = formatCheckinTime(crnt_datetime);    
    insertStmt.run(badgeNumber, checkinDateTime, checkinDate, checkinTime, '');
    db.close()
  } 
  catch (err) {
    console.err(`insertCheckinRecord: ${err}`)
    throw err; 
  } 
}

//-----------------------------------------------------------------------------------
searchAttendanceStmt = `
select attendance_id, 
       badgeNumber, 
       checkinDate, 
       checkinTime, 
       studentName, 
       studentStatus, 
       className, 
       rankName, 
       classStartTime
from   attendance
order  by checkinDateTime desc, checkinTime desc
limit  10;
`
function getAttendanceData (badgeNumber=null, firstName=null, lastName=null){
  try {
    const db_directory = getDatabaseLocation();
    const db           = new sqlite3(db_directory); 
    const searchStmt   = db.prepare(searchAttendanceStmt);
    const rows         = searchStmt.all();
    db.close();
    return rows;
  } catch (err) {
    console.error('Error fetching attendance records', err); throw err; 
  } 
}


const weekendDatesStmt = `
  WITH RECURSIVE weekend_dates(date) AS (
    VALUES('2015-10-03')
    UNION ALL
    SELECT date(date, '+1 day', 'weekday 6')
    FROM weekend_dates
    WHERE date < date('now')
  )
  SELECT date as saturday_date
  FROM   weekend_dates
  order  by date desc
  limit 20;
`
function getWeekendDates (){
  try {
    const db_directory = getDatabaseLocation();
    const db           = new sqlite3(db_directory); 
    const searchStmt   = db.prepare(weekendDatesStmt);
    const rows         = searchStmt.all();
    db.close();
    return rows;
  } catch (err) {
    console.error('Error fetching weekend dates', err); throw err; 
  } 
}

//---------------------------------------------------------------
module.exports = {
  insertCheckinRecord,
  getAttendanceData,
  getWeekendDates
};