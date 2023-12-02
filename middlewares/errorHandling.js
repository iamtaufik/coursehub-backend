const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    data: null,
  });
};

const serverError = (err, req, res, next) => {
  if (err.isJoi) {
    return res.status(400).json({
      status: 'Error',
      message: err.name,
      error: err.message,
    });
  }

  if (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

module.exports = {
  notFound,
  serverError,
};
