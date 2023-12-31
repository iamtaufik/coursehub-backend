const prisma = require('../libs/prisma');
const { sendEmail } = require('../libs/nodemailer');
const { emailReminder } = require('../libs/template-email/emailReminder');

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

    const usersEmail = await prisma.users.findMany({
      where: {
        id: {
          in: usersToReminder.map((user) => user.userId),
        },
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        courses: {
          select: {
            title: true,
          },
        },
      },
    });

    Promise.all(
      usersEmail.map((user) => {
        user.courses.forEach((course) => {
          const mailOptions = {
            from: 'Admin <' + process.env.EMAIL_USER + '>',
            to: user.email,
            subject: 'Yuk, Lanjutkan Kelasmu!',
          };

          sendEmail(mailOptions.to, mailOptions.subject, emailReminder(user, course.title));
        });
      })
    );

    prisma.notification.create({
      data: {
        notificationId,
      },
    });
    await prisma.$transaction([
      prisma.notification.createMany({
        data: usersToReminder.map((user) => ({
          notificationId: notificationId,
          userId: user.userId,
          title: 'Reminder',
          body: `Hai, jangan lupa untuk melanjutkan kelas ${user.courses} ya!`,
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
