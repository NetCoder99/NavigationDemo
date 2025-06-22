var appRoot = require('app-root-path');

function getTestStudentData() {
  test_data = {
    badgeNumber: 1565,
    firstName: "John",
    lastName: "Dugger",
    title1: "Rising Sun Martial Arts",
    title2: "Building tomorrows leaders, one black belt at a time!",
    subField1 : "Birthday: 01/01/1652",
    subField2 : "Since: 01/14/2016",
    schoolLogoPath: appRoot   + '/src/images/RSM_Logo1.jpg',
    studentImagePath: appRoot + '/src/images/RSM_Logo1.jpg',
    barcodeImagePath: appRoot + '/src/images/1565.png',
  };
  return test_data;
}

module.exports = {getTestStudentData}
