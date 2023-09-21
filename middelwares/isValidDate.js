const { HttpError } = require('./../helpers');

const isValidDate = (req, res, next) => {
  const { dateIso } = req.params;

  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
  if (!isoRegex.test(dateIso)) {
    next(HttpError(400, `${dateIso} is not valid ISO 8601 date format`));
  }

  next();
};

module.exports = isValidDate;
