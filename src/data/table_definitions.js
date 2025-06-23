// ----------------------------------------------------------------------------------------------
const attendanceDDLLinux = `
CREATE TABLE attendance 
    (
        attendance_id  INTEGER PRIMARY KEY,
        badgeNumber     int,
        checkinDateTime text,
        checkinDate     text,
        checkinTime     text,
        studentName     text,
        studentStatus   text,
        className       text,
        rankName        text,
        classStartTime  text
    );
`;

const attendanceDDL = `
CREATE TABLE attendance 
    (
        attendance_id  INTEGER PRIMARY KEY,
        badgeNumber     int,
        checkinDateTime text,
        checkinDate     text,
        checkinTime     text,
        studentName     text,
        studentStatus   text,
        className       text,
        rankName        text,
        classStartTime  text
    );
`;

const assetsDDL = `
  -- assets definition

  CREATE TABLE assets (
    imageId INTEGER PRIMARY KEY AUTOINCREMENT,
    imageName TEXT NOT NULL,
    imageBase64 TEXT NOT NULL
  , imageBytes BLOB);

  CREATE UNIQUE INDEX assets_imageName_IDX ON assets (imageName);
`;

const studentsDdl = `
  CREATE TABLE students (
          badgeNumber int primary key not null,
          firstName   text,
          lastName      text,
          namePrefix    text,
          email         text,
          address       text,
          address2      text,
          city          text,
          country       text,
          state         text,
          zip           text,
          birthDate     text,
          phoneHome     text,
          phoneMobile   text,
          status        text,
          memberSince   text,
          gender        text,
          currentRank   text,
          ethnicity     text, 
          studentImage      BLOB, 
          studentImagePath  TEXT, 
          imageBase64       TEXT, 
          middleName        TEXT);
    `;