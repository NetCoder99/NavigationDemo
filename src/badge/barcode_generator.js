const fs            = require('fs');
const appRoot       = require('app-root-path');
const JsBarcode     = require('jsbarcode');
const {createCanvas} = require('canvas');

function generateBarcodeImage(badgeNumber, x, y) {
  const canvas = createCanvas(800, 200);
  JsBarcode(canvas, badgeNumber, {
      format: "CODE39",
      displayValue: true,
      lineColor: "#000",
      background: "#fff",
      width: 4,
      height: 80,
      text: "Student# " + badgeNumber  
  });
  const buffer = canvas.toBuffer('image/png');
  const filePath = appRoot + `/src/assets/${badgeNumber}.png`;
  fs.writeFileSync(filePath, buffer);
}

module.exports = {generateBarcodeImage}
