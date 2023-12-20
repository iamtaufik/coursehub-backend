const prisma = require('../libs/prisma');

const countActiveUsers = async (req, res, next) => {
  try {
    const { _count } = await prisma.users.aggregate({
      _count: { id: true },
      where: { isVerified: true }
    });

    res.status(200).json({
      status: true,
      message: 'Total Active Users',
      data: { totalActiveUser: _count }
    })

  } catch (error) {
    next(error);
  }
};

const countActiveClass = async (req, res, next) => {
  try {
    const { _count } = await prisma.courses.aggregate({
      _count: { id: true },
      where: { isDeleted: false }
    });

    res.status(200).json({
      status: true,
      message: 'Total Active Class',
      data: { totalActiveClass: _count }
    })

  } catch (error) {
    next(error);
  }
};

const countPremiumClass = async (req, res, next) => {
  try {
    const { _count } = await prisma.courses.aggregate({
      _count: { id: true },
      where: { price: { not: 0 }, AND: { isDeleted: false } }
    });

    res.status(200).json({
      status: true,
      message: 'Total Premium Class',
      data: { totalPremiumClass: _count }
    })

  } catch (error) {
    next(error);
  }
};

module.exports = {
  countActiveUsers,
  countActiveClass,
  countPremiumClass,
};