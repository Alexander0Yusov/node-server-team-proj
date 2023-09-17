const calcBmr = ({ desiredWeight, height, birthdate, levelActivity, sex }) => {
  const birthdateObject = new Date(birthdate);
  let currentDate = new Date();

  const years = currentDate.getFullYear() - birthdateObject.getFullYear();

  let sexValue;
  let result;

  switch (sex) {
    case 'male':
      sexValue = 5;
      break;
    case 'female':
      sexValue = -161;
      break;

    default:
      break;
  }

  switch (levelActivity) {
    case 1:
      result =
        (10 * desiredWeight + 6.25 * height - 5 * years + sexValue) * 1.2;
    case 2:
      result =
        (10 * desiredWeight + 6.25 * height - 5 * years + sexValue) * 1.375;
    case 3:
      result =
        (10 * desiredWeight + 6.25 * height - 5 * years + sexValue) * 1.55;
    case 4:
      result =
        (10 * desiredWeight + 6.25 * height - 5 * years + sexValue) * 1.725;
    case 5:
      result =
        (10 * desiredWeight + 6.25 * height - 5 * years + sexValue) * 1.9;

    default:
      break;
  }

  return Math.round(result / 10) * 10;
};

module.exports = calcBmr;
