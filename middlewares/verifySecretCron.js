const verifySecretCron = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res.status(401).json({
        status: false,
        message: 'Missing Authorization Header',
        data: null,
      });

    const secret = req.headers.authorization.split(' ')[1];

    if (!secret) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        err: 'No secret cron provided',
        data: null,
      });
    }

    if (secret !== process.env.CRON_SECRET) {
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
