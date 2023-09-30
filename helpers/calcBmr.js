const calcBmr = ({ desiredWeight, height, birthdate, levelActivity, sex }) => {
  const birthdateObject = new Date(birthdate);
  let currentDate = new Date();

  const years = currentDate.getFullYear() - birthdateObject.getFullYear();

  const SEX_VALUE = {
    male: 5,
    female: -161,
  };
  const LEVEL_ACTIVITY_VALUE = {
    1: 1.2,
    2: 1.375,
    3: 1.55,
    4: 1.725,
    5: 1.9,
  };

  const result =
    (10 * desiredWeight + 6.25 * height - 5 * years + SEX_VALUE[sex]) *
    LEVEL_ACTIVITY_VALUE[levelActivity];

  return Math.round(result / 10) * 10;
};

module.exports = calcBmr;
