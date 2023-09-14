const errorMessageList = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};

const HttpError = (code, message = errorMessageList[code]) => {
  const error = new Error(message);
  error.status = code;
  return error;
};

module.exports = HttpError;
