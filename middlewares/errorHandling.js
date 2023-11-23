const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    data: null,
  });
};

const serverError = (err, req, res, next) => {
  if (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }

  next();
};

module.exports = {
  notFound,
  serverError,
};
