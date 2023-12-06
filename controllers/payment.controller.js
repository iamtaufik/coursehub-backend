const Midtrans = require('midtrans-client');
const prisma = require('../libs/prisma');

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// const checkout = async (req, res, next) => {
//   try {
//     const { email, phone_number } = req.user;
//     const { courseId, courseName, price } = req.body;
//     if (!courseId || !courseName || !price) {
//       return res.status(400).json({
//         message: 'Please provide courseId, courseName, and price',
//       });
//     }
//     console.log({ ...req.body });
//     const parameter = {
//       item_details: [
//         {
//           id: courseId,
//           name: courseName,
//           price: Number(price),
//           quantity: 1,
//         },
//       ],
//       transaction_details: {
//         order_id: Math.round(Math.random() * 1000000000),
//         gross_amount: Number(price),
//       },
//       customer_details: {
//         first_name: email,
//         email: email,
//         phone: phone_number,
//       },
//     };

//     console.log('paramater', parameter);

//     const token = await snap.createTransactionToken(parameter);

//     const transaction = await prisma.transactions.create({
//       data: {
//         orderId: parameter.transaction_details.order_id,
//         total_price: price,
//         courseId: courseId,
//         status: 'pending',
//         userId: req.user.id,
//       },
//     });

//     return res.status(200).json({
//       status: true,
//       message: 'Checkout success',
//       orderId: transaction.orderId,
//       token: token,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

function generateUniqueOrderId() {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 10000);

  const orderId = (timestamp * 10000 + randomPart) % 2147483647;

  return orderId;
}

const checkout = async (req, res, next) => {
  try {
    const { userId, courseId, promoId } = req.body;

    const course = await prisma.courses.findUnique({
      where: { id: courseId },
    });

    let total_price = course.price;
    let discount = 0;

    if (promoId) {
      const promo = await prisma.promo.findUnique({
        where: { id: promoId },
      });

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
          id: courseId,
          name: courseName,
          price: Number(price),
          quantity: 1,
        },
      ],
      transaction_details: {
        order_id: Math.round(Math.random() * 1000000000),
        gross_amount: Number(price),
      },
      customer_details: {
        first_name: email,
        email: email,
        phone: phone_number,
      },
    };


    const orderId = generateUniqueOrderId();

    const transaction = await prisma.transactions.create({
      data: {
        userId,
        courseId,
        total_price,
        discount,
        status: 'Pending',
        promoId: promoId ? promoId : null,
        orderId,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Checkout Successfully!',
      data: transaction,
    });

  } catch (error) {
    next(error);
  }
};




const notification = async (req, res, next) => {
  try {
    const { order_id, transaction_status, payment_type, transaction_time } = req.body;

    const transaction = await prisma.transactions.findUnique({
      where: {
        orderId: Number(order_id),
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
        });

        // set course to user
        await prisma.users.update({
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
        });
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
