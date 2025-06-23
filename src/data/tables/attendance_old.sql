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