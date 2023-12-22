const { getPagination } = require('../libs/getPaggination');
const prisma = require('../libs/prisma');

const getTransactions = async (req, res, next) => {
  try {
    if (req.query.page && req.query.limit) {
      const { page = 1, limit = 10 } = req.query;

      const sort = req.query.sort ? req.query.sort : 'asc';

      const transactions = await prisma.transactions.findMany({
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: {
          course: {
            select: {
              id: true,
              title: true,
              category: {
                select: {
                  name_categories: true,
                },
              },
            },
          },
          user: {
            select: {
              nickname: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: sort === 'asc' ? 'asc' : 'desc',
        },
      });

      const { _count } = await prisma.transactions.aggregate({
        _count: { id: true },
      });

      const pagination = getPagination(req, _count.id, Number(page), Number(limit));

      return res.status(200).json({
        status: true,
        message: 'Transactions retrieved successfully',
        data: {
          transactions,
          pagination,
        },
      });
    }

    const transactions = await prisma.transactions.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
            category: {
              select: {
                name_categories: true,
              },
            },
          },
        },
        user: {
          select: {
            nickname: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Successfully get transactions',
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

const myTransaction = async (req, res, next) => {
  try {
    const { id } = req.user;

    const transactions = await prisma.transactions.findMany({
      where: {
        userId: id,
      },
      include: {
        course: {
          include: {
            ratings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const calculateAverageRating = (ratings) => {
      if (ratings && ratings.length > 0) {
        const totalRatings = ratings.reduce((sum, rating) => sum + rating.ratings, 0);
        const totalUsers = ratings.length;
        return totalRatings / totalUsers;
      } else {
        return 0;
      }
    };

    const newTransactions = transactions.map((transaction) => {
      const averageRating = calculateAverageRating(transaction.course.ratings);
      return {
        ...transaction,
        course: {
          ...transaction.course,
          averageRating,
        },
      };
    });

    res.status(200).json({
      success: true,
      message: 'Successfully get transactions',
      data: [...newTransactions],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  myTransaction,
};
