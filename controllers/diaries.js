const { HttpError, ctrlWrapper } = require('../helpers');
const { EatenProduct } = require('../models/eatenProduct');
const { DoneExercise } = require('../models/doneExercise');
const relocateImg = require('../helpers/relocateImg');
const exersSorce = require('../temp/exercises.json');
const fs = require('fs');
const path = require('path');

const getDiaries = async (req, res) => {
  const { _id: owner } = req.user;
  const { dateIso } = req.params;

  const [yyyymmdd, _] = dateIso.split('T');

  const filter = {
    date: yyyymmdd,
    owner,
  };

  const mealPromise = EatenProduct.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    {
      $unwind: '$product',
    },
    {
      $project: {
        product: 1,
        weight: 1,
      },
    },
  ]);

  const workoutPromise = DoneExercise.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: 'exercises',
        localField: 'exerciseId',
        foreignField: '_id',
        as: 'exercise',
      },
    },
    {
      $unwind: '$exercise',
    },
    {
      $project: {
        exercise: 1,
        duration: 1,
      },
    },
  ]);

  const [meal, workout] = await Promise.all([mealPromise, workoutPromise]);

  // ===========
  // const newJson = path.join(__dirname, '../', 'temp', 'newJson.json');
  // const newAr = [];

  // for (let i = 0; i < 100; i++) {
  //   if (
  //     i === 79 ||
  //     i === 194 ||
  //     i === 195 ||
  //     i === 196 ||
  //     i === 681 ||
  //     i === 920 ||
  // forget upper

  // i === 134 ||
  // i === 135 ||
  // i === 136 ||
  // i === 137 ||
  // i === 138 ||
  // i === 139 ||
  // i === 140 ||
  // i === 141 ||
  // i === 175 ||

  // i === 222 ||
  // i === 223 ||
  // i === 224 ||
  // i === 225 ||
  // i === 226 ||
  // i === 289 ||
  // i === 290 ||
  // i === 291 ||
  // i === 292 ||
  // i === 324 ||
  // i === 325 ||
  // i === 326 ||
  // i === 395 ||
  // i === 396 ||
  // i === 397 ||
  // i === 460 ||
  //   i === 5555
  // ) {
  //
  // console.log('counter ===== ', i);
  // console.log(exersSorce[i]);
  // console.log('counter ============');

  // const newUrl = await relocateImg(
  //   exersSorce[i].gifUrl,
  //   exersSorce[i].name
  // );
  // const tempObj = {
  //   bodyPart: exersSorce[i].bodyPart,
  //   equipment: exersSorce[i].equipment,
  //   gifUrl: newUrl,
  //   name: exersSorce[i].name,
  //   target: exersSorce[i].target,
  //   burnedCalories: exersSorce[i].burnedCalories,
  //   time: exersSorce[i].time,
  // };

  // newAr.push(tempObj);
  // console.log('counter FALSE = ', i);
  // continue;
  // }
  // continue;
  //   await new Promise(r => setTimeout(r, 2000));

  //   const newUrl = await relocateImg(exersSorce[i].gifUrl, exersSorce[i].name);
  //   const tempObj = {
  //     bodyPart: exersSorce[i].bodyPart,
  //     equipment: exersSorce[i].equipment,
  //     gifUrl: newUrl,
  //     name: exersSorce[i].name,
  //     target: exersSorce[i].target,
  //     burnedCalories: exersSorce[i].burnedCalories,
  //     time: exersSorce[i].time,
  //   };

  //   newAr.push(tempObj);
  //   console.log('counter = ', i);
  // }
  // fs.writeFileSync(newJson, JSON.stringify(newAr, null, 2));

  res.status(200).json({
    meal,
    workout,
  });
};

module.exports = {
  getDiaries: ctrlWrapper(getDiaries),
};
