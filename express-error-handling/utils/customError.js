class CustomError extends Error {
  constructor(messag, status) {
    super(messag);
    this.status = status;
  }
}

module.exports = CustomError;
