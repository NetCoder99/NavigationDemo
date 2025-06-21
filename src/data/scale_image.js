const sharp = require('sharp');

async function scaleImageToHeight(inputPath, outputPath, targetHeight) {
  try {
    const resizedImage = await sharp(inputPath)
      .withMetadata()
      //.extract({ width: 225 })
      .resize({ height: targetHeight })
      .toBuffer();
      //.toFile(outputPath);
    console.log('Image scaled successfully!');
    return resizedImage;
  } catch (error) {
    console.error('Error scaling image:', error);
  }
}

module.exports = {scaleImageToHeight}