const isDefaultParams = compareObj => {
  const defaultBodyParams = {
    height: 150,
    currentWeight: 35,
    desiredWeight: 35,
    blood: 1,
    sex: 'male',
    levelActivity: 1,
    birthdate: new Date(),
  };

  if (
    new Date(defaultBodyParams.birthdate).getFullYear() - 18 !==
    new Date(compareObj.birthdate).getFullYear()
  ) {
    return false;
  }

  delete defaultBodyParams.birthdate;
  delete compareObj.birthdate;

  const keys = Object.keys(defaultBodyParams);
  console.log(keys);

  for (let i = 0; i < keys.length; i++) {
    const prop = keys[i];

    if (defaultBodyParams[prop] !== compareObj[prop]) {
      return false;
    }
  }

  return true;
};

module.exports = isDefaultParams;
