const verifySecretCron = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res.status(401).json({
        status: false,
        message: 'Missing Authorization Header',
        data: null,
      });

    const authHeader = req.headers.authorization;

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = verifySecretCron;
