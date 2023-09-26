const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const exersSorce = require('../temp/exercises.json');
// const filtersSorce = require('../temp/filters.json');

const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: 'dwgi8qlph',
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

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
    // console.log('Image saved:', filePath);

    // write block
    const uploadOptions = {
      folder: 'fit-proj',
      use_filename: true,
      public_id: fileName,
    };

    const subfolder = 'imgUrls_2';
    if (subfolder) {
      uploadOptions.folder += `/${subfolder}`;
    }

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    // console.log('Uploaded file details:', result);
    // console.log('Uploaded url:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// filtersJsonCreator
// ============================================================================
// const createJsonFilters = async () => {
//   const newJson = path.join(__dirname, '../', 'temp', 'newJsonFilters.json');
//   const newAr = [];

//   for (let i = 0; i < filtersSorce.length; i++) {
//     if (
//       i === 0 ||
//       i === 10 ||
//       (i >= 16 && i <= 20) ||
//       i === 45 ||
//       i === 55 ||
// forget upper
// (i >= 3000 && i <= 4000)
// ) {
// console.log('continue = ', i);
// continue;
// console.log('try relocate = ', i);
// console.log(filtersSorce[i].imgURL);
// await new Promise(r => setTimeout(r, 1000));

// const newUrl = await relocateImg(filtersSorce[i].imgURL, `${i}`, 'jpg');
//       const tempObj = {
//         filter: filtersSorce[i].filter,
//         name: filtersSorce[i].name,
//         imgURL: `${i}`,
//       };

//       newAr.push(tempObj);
//       console.log('done relocate = ', i);
//     }
//     continue;
//     console.log('try relocate = ', i);
//     console.log(filtersSorce[i].imgURL);
//     await new Promise(r => setTimeout(r, 1000));

//     const newUrl = await relocateImg(filtersSorce[i].imgURL, `${i}`, 'jpg');
//     const tempObj = {
//       filter: filtersSorce[i].filter,
//       name: filtersSorce[i].name,
//       imgURL: newUrl,
//     };

//     newAr.push(tempObj);
//     console.log('done relocate = ', i);
//   }

//   fs.writeFileSync(newJson, JSON.stringify(newAr, null, 2));
// };

// exercisesJsonCreator
// ============================================================================
const createJsonExercises = async () => {
  const newJson = path.join(__dirname, '../', 'temp', 'newJson.json');
  const newAr = [];

  for (let i = 0; i < exersSorce.length; i++) {
    if (
      i === 79 ||
      i === 194 ||
      i === 195 ||
      i === 196 ||
      i === 681 ||
      i === 920 ||
      // forget upper
      i === 5555
    ) {
      // console.log('counter ===== ', i);
      // console.log(exersSorce[i]);
      // console.log('counter ============');

      // const newUrl = await relocateImg(
      //   exersSorce[i].gifUrl,
      //   exersSorce[i].name
      // );
      const tempObj = {
        bodyPart: exersSorce[i].bodyPart,
        equipment: exersSorce[i].equipment,
        gifUrl: exersSorce[i].gifUrl,
        name: exersSorce[i].name,
        target: exersSorce[i].target,
        burnedCalories: exersSorce[i].burnedCalories,
        time: exersSorce[i].time,
      };

      newAr.push(tempObj);
      // console.log('counter FALSE = ', i);
      continue;
    }
    continue;
    console.log('try relocate = ', i);
    await new Promise(r => setTimeout(r, 1000));

    const newUrl = await relocateImg(exersSorce[i].gifUrl, `${i}`);
    const tempObj = {
      bodyPart: exersSorce[i].bodyPart,
      equipment: exersSorce[i].equipment,
      gifUrl: newUrl,
      name: exersSorce[i].name,
      target: exersSorce[i].target,
      burnedCalories: exersSorce[i].burnedCalories,
      time: exersSorce[i].time,
    };

    newAr.push(tempObj);
    console.log('counter = ', i);
  }
  fs.writeFileSync(newJson, JSON.stringify(newAr, null, 2));
};
// ============================================================================

module.exports = { createJsonExercises };
