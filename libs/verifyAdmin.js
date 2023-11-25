const verifyAdmin = (req, res, next) => {
  const { idAdmin } = req.user;

  if (!idAdmin) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
      err: 'You are not an admin',
      data: null,
    });
  }

  next();
};

module.exports = verifyAdmin;