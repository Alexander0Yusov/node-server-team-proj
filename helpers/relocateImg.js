const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: 'dwgi8qlph',
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const url =
  'https://res.cloudinary.com/ditdqzoio/image/upload/v1687127066/exercises/0001.gif';
const file = '3/4 sit-up';

const relocateImg = async (sourseUrl, fileName, fileType = 'gif') => {
  try {
    // read block
    const response = await fetch(sourseUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch the image. Status: ${response.status}`);
    }

    const fileBuffer = await response.arrayBuffer();
    const fileNameCorrect = `${fileName
      .split('/')
      .join('!')
      .split(' ')
      .join('_')}.${fileType}`;
    const filePath = path.join(__dirname, '../', 'temp', fileNameCorrect);

    fs.writeFileSync(filePath, Buffer.from(fileBuffer));
    console.log('Image saved:', filePath);

    // write block
    const uploadOptions = {
      folder: 'fit-proj',
      use_filename: true,
    };

    const subfolder = 'gifUrls_100-199';
    if (subfolder) {
      uploadOptions.folder += `/${subfolder}`;
    }

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    console.log('Uploaded file details:', result);
    console.log('Uploaded url:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = relocateImg;
