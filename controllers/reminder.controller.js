const prisma = require('../libs/prisma');

const createReminder = async (req, res, next) => {
  try {
    let usersToReminder = await prisma.userCourseProgress.findMany({
      where: {
        isCompleted: false,
      },
      select: {
        userId: true,
        module: {
          select: {
            chapters: {
              select: {
                courses: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    usersToReminder = usersToReminder
      .map((user) => ({
        userId: user.userId,
        course: user.module.chapters.courses.title,
      }))
      .reduce((acc, item) => {
        const existingItem = acc.find((entry) => entry.userId === item.userId && entry.courses === item.course);

        if (!existingItem) {
          acc.push({
            userId: item.userId,
            courses: item.course,
          });
        }

        return acc;
      }, []);

    const notificationId = Math.floor(Math.random() * 1000000000);

    // 

    await prisma.$transaction([
      prisma.notification.createMany({
        data: usersToReminder.map((user) => ({
          userId: user.userId,
          title: 'Reminder',
          notificationId,
          body: `Hai jangan lupa melanjutkan kelas ${user.courses} ya.`,
        })),
      }),
    ]);

    res.status(200).json({
      status: true,
      message: 'Reminder created successfully',
      data: [...usersToReminder],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReminder,
};
