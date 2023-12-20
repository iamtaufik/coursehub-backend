const prisma = require('../libs/prisma');
const { sendEmail } = require('../libs/nodemailer');

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
        email: true,
      },
    });

    Promise.all(
      usersEmail.map((user) => {
        return new Promise((resolve, reject) => {
          const mailOptions = {
            from: 'Admin <' + process.env.EMAIL_USER + '>',
            to: user.email,
            subject: 'Yuk, Lanjutkan Kelasmu!',
            text: `Hai ${user.name},\n\nWaktunya membangkitkan semangat! Jangan lupa lanjutkan kelas ${usersToReminder[0].courses} yang sedang kamu ikuti.\n\nIngat, setiap langkahmu membawa ke arah kesuksesan. Teruslah belajar dan teruslah maju!Dunia ini terbuka lebar untuk pengetahuanmu.\n\nBest Regards,\nCourseHub Team`,
          };

          sendEmail(mailOptions.to, mailOptions.subject, mailOptions.text)
            .then(() => {
              resolve(true);
            })
            .catch((error) => {
              reject(error);
            });
        });
      })
    );

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
