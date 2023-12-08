const prisma = require('../libs/prisma');
const { createNotificationSchema, deleteNotificationSchema } = require('../validations/notification.validation');

const createNotification = async (req, res, next) => {
  try {
    const { title, description, body } = req.body;

    await createNotificationSchema.validateAsync({ ...req.body });

    const users = await prisma.users.findMany();

    const notificationId = Math.floor(Math.random() * 1000000000);

    const blastNotification = users.map((user) => {
      return {
        userId: user.id,
        notificationId,
        title,
        description,
        body,
      };
    });

    const notification = await prisma.$transaction([
      prisma.notification.createMany({
        data: blastNotification,
      }),
    ]);

    res.status(201).json({
      status: true,
      message: 'Notification created successfully',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

const getAllNotifications = async (req, res, next) => {
  try {
    const notification = await prisma.notification.findMany({
      where: {
        isDeleted: false,
      },
      distinct: ['notificationId'],
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      status: true,
      message: 'Notification retrieved successfully',
      data: [...notification],
    });
  } catch (error) {
    next(error);
  }
};

const getMyNotifications = async (req, res, next) => {
  try {
    const notification = await prisma.notification.findMany({
      where: {
        userId: req.user.id,
        AND: {
          isDeleted: false,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      status: true,
      message: 'Notification retrieved successfully',
      data: [...notification],
    });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    await deleteNotificationSchema.validateAsync({ ...req.params });

    const notification = await prisma.$transaction([
      prisma.notification.updateMany({
        where: {
          notificationId: Number(id),
        },
        data: {
          isDeleted: true,
        },
      }),
    ]);

    res.status(200).json({
      status: true,
      message: 'Notification deleted successfully',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyNotifications, getAllNotifications, createNotification, deleteNotification };
