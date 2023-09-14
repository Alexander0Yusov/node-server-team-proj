const handleMongooseError = (er, data, next) => {
  const { name, code } = er;
  const status = (name === "MongoServerError", code === 110000) ? 409 : 400;

  er.status = status;
  next();
};

module.exports = handleMongooseError;
