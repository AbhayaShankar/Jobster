const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // Default error responses
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || `Something went wrong`,
  };

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  if (err.name === "ValidationError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = Object.values(err.errors)
      .map((errItem) => errItem.message)
      .join(" and ");
  }

  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = `Duplicate email provided for ${Object.keys(
      err.keyValue
    )}: ${Object.values(err.keyValue)}`;
  }

  if (err.name === "castError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = `No Job found for id : ${err.value}`;
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
