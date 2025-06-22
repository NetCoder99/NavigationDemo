const PDFDocument = require('pdfkit');
const fs      = require('fs');
const appRoot = require('app-root-path');
const path    = require('node:path')  

const widthInInches  = 2;
const heightInInches = 3.5;
const widthInPoints  = widthInInches * 72;
const heightInPoints = heightInInches * 72;

console.log(`widthInPoints: ${widthInPoints} : heightInPoints: ${heightInPoints}`);

function createBadgePdf(badgeData, doneWritingPdf) {
  const doc = new PDFDocument({size: [widthInPoints, heightInPoints]});

  doc.lineWidth(1);
  doc.rect(0, 0, widthInPoints, heightInPoints).stroke();

  // show the school logo
  logoPath = path.join(appRoot.path, badgeData.schoolLogoPath);
  doc.image(logoPath, 3, 3, {fit: [30, 30]}).stroke();

  // show the first title
  doc.fontSize(10);    
  doc.font('Times-Bold').text(badgeData.title1, 35, 14, {width: 140});

  // show the second title/message 
  doc.fontSize(8);    
  doc.text(badgeData.title2, 20, 40, {width: widthInPoints-40, align: 'center'});

  // seperator
  doc.lineWidth(1);
  doc.moveTo(5, 60).lineTo(widthInPoints -5, 60).stroke();

  // show the student image 
  if (badgeData.studentImage) {
    const imageBuffer = Buffer.from(badgeData.studentImage, 'base64')
    doc.image(imageBuffer, 30, 65, {
      fit: [95, 95]}
      ).stroke();
  }
  else {
    //src\assets\RSM_Footer.jpg
    const footerPath = path.join(appRoot.path, 'src', 'assets', 'RSM_Footer.jpg');
    doc.image(footerPath, 30, 65, {
      fit: [95, 95]}
      ).stroke();
  }
  
  // show the student name
  doc.fontSize(10);    
  const studentName = badgeData.firstName + ' ' + badgeData.lastName;
  doc.text(studentName.trim(), 1, 165, {width: widthInPoints, align: 'center', lineBreak: false });

  // show other student details
  doc.fontSize(7);    
  doc.text(badgeData.subField2, 5,  181, {width: 65, height:10, lineBreak: false });
  doc.text(badgeData.subField1, 75, 181, {width: 65, height:10, lineBreak: false });

  // seperator
  doc.lineWidth(1);
  doc.moveTo(5, 200).lineTo(widthInPoints -5, 200).stroke();

  // show the barcode
  const barcodeImagePathTmp = path.join(appRoot.path, badgeData.barcodeImagePath);
  doc.image(barcodeImagePathTmp,  25,  205, {fit: [175, 30]}).stroke();
  
  // seperator
  doc.lineWidth(1);
  doc.moveTo(5, 240).lineTo(widthInPoints -5, 240).stroke();

  // write to a file
  pdfOutputPath = appRoot + '/src/assets/' + badgeData.badgeNumber + '.pdf'
  writeStream   = fs.createWriteStream(pdfOutputPath,{ flush: true })
  doc.pipe(writeStream);
  doc.end();

  // invoke the call back display, when the file has been written
  writeStream.on('finish', function () {
    console.log('done writing to file ' + pdfOutputPath);
    doneWritingPdf(pdfOutputPath);
  });  

}


module.exports = {createBadgePdf,};