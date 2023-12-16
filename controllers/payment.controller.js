const Midtrans = require('midtrans-client');
const prisma = require('../libs/prisma');
const { createPaymentSchema, createNotificationPaymentSchema } = require('../validations/payment.validation');

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

function generateUniqueOrderId() {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 10000);

  const orderId = (timestamp * 10000 + randomPart) % 2147483647;

  return orderId;
}

const checkout = async (req, res, next) => {
  try {
    const { courseId, promoCode } = req.body;
    const { nickname, email, phone_number, id } = req.user;

    await createPaymentSchema.validateAsync({ ...req.body, nickname, email, phone_number, id });

    const course = await prisma.courses.findUnique({
      where: { id: Number(courseId), AND: { isDeleted: false } },
    });

    if (!course) {
      return res.status(404).json({
        status: false,
        message: 'Course not found',
      });
    }

    let total_price = course.price;
    let discount = 0;
    let promoId = null;
    if (promoCode) {
      const promo = await prisma.promo.findUnique({
        where: { code_promo: promoCode },
      });
      if (!promo) {
        return res.status(400).json({
          status: false,
          message: 'Promo code not found',
        });
      }

      promoId = promo.id;

      if (promo.expiresAt < new Date()) {
        return res.status(400).json({
          status: false,
          message: 'Promo code expired',
        });
      }

      if (promo && promo.expiresAt > new Date()) {
        // Menghitung diskon berdasarkan persentase
        discount = (promo.discount / 100) * course.price;

        // Mengurangkan diskon dari total_price
        total_price -= discount;
      }
    }
    const parameter = {
      item_details: [
        {
          id: course.id,
          name: course.title,
          price: Math.round(total_price),
          quantity: 1,
        },
      ],
      transaction_details: {
        order_id: generateUniqueOrderId(),
        gross_amount: Math.round(total_price),
      },
      customer_details: {
        first_name: nickname,
        email: email,
        phone: phone_number,
      },
    };

    const token = await snap.createTransactionToken(parameter);

    const transaction = await prisma.transactions.create({
      data: {
        userId: id,
        courseId,
        total_price,
        discount,
        status: 'Pending',
        promoId: promoId ? promoId : null,
        orderId: parameter.transaction_details.order_id,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Checkout Successfully!',
      orderId: transaction.orderId,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

const notification = async (req, res, next) => {
  try {
    const { order_id, transaction_status, payment_type, transaction_time } = req.body;

    await createNotificationPaymentSchema.validateAsync({ ...req.body });

    const transaction = await prisma.transactions.findUnique({
      where: {
        orderId: Number(order_id),
      },
      include: {
        course: true,
      },
    });

    if (transaction) {
      if (transaction_status === 'settlement') {
        const transaction = await prisma.transactions.update({
          where: {
            orderId: Number(order_id),
          },
          data: {
            status: 'paid',
            payment_type: payment_type,
            transaction_time: new Date(transaction_time),
          },
          include: {
            course: true,
          },
        });

        await prisma.$transaction([
          // set course to user
          prisma.users.update({
            where: {
              id: transaction.userId,
            },
            data: {
              courses: {
                connect: {
                  id: transaction.courseId,
                },
              },
            },
          }),
          prisma.notification.create({
            data: {
              title: 'Notifikasi',
              notificationId: Math.floor(Math.random() * 1000000),
              body: `Selamat anda berhasil mengikuti kelas ${transaction.course.title}`,
              userId: user.id,
            },
          }),
        ]);
      } else if (transaction_status === 'cancel') {
        await prisma.transactions.update({
          where: {
            orderId: Number(order_id),
          },
          data: {
            status: 'cancelled',
            payment_type: payment_type,
            transaction_time: new Date(transaction_time),
          },
        });
      } else if (transaction_status === 'expire') {
        await prisma.transactions.update({
          where: {
            orderId: Number(order_id),
          },
          data: {
            status: 'expired',
            payment_type: payment_type,
            transaction_time: new Date(transaction_time),
          },
        });
      } else if (transaction_status === 'deny') {
        await prisma.transactions.update({
          where: {
            orderId: Number(order_id),
          },
          data: {
            status: 'failed',
            payment_type: payment_type,
            transaction_time: new Date(transaction_time),
          },
        });
      }
    }
    return res.status(200).json({
      message: 'Notification success',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  checkout,
  notification,
};
