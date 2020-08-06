class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.message = message;

    //it's capture error
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ErrorHandler;
