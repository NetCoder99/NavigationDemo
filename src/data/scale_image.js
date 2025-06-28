const sharp = require('sharp');

async function scaleImageToHeight(inputPath, outputPath, targetHeight) {
  try {
    const resizedImage = await sharp(inputPath)
      .withMetadata()
      .resize({ height: targetHeight })
      .toBuffer();
    console.log(`Image scaled: ${inputPath}`);
    return resizedImage;
  } catch (error) {
    console.error('Error scaling image:', error);
  }
}

module.exports = {scaleImageToHeight}