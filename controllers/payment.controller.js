const Midtrans = require('midtrans-client');
const prisma = require('../libs/prisma');

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const checkout = async (req, res, next) => {
  try {
    const { email, phone_number } = req.user;
    const { courseId, courseName, price } = req.body;
    if (!courseId || !courseName || !price) {
      return res.status(400).json({
        message: 'Please provide courseId, courseName, and price',
      });
    }
    console.log({ ...req.body });
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

    console.log('paramater', parameter);

    const token = await snap.createTransactionToken(parameter);

    const transaction = await prisma.transactions.create({
      data: {
        orderId: parameter.transaction_details.order_id,
        total_price: price,
        courseId: courseId,
        status: 'pending',
        userId: req.user.id,
      },
    });

    return res.status(200).json({
      status: true,
      message: 'Checkout success',
      orderId: transaction.orderId,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

const notification = async (req, res, next) => {
  try {
    const { order_id, transaction_status } = req.body;
    console.log({
      order_id,
      transaction_status,
    });
    const transaction = await prisma.transactions.findUnique({
      where: {
        orderId: Number(order_id),
      },
    });

    if (transaction) {
      if (transaction_status === 'settlement') {
        await prisma.transactions.update({
          where: {
            orderId: Number(order_id),
          },
          data: {
            status: 'paid',
          },
        });
      } else if (transaction_status === 'cancel') {
        await prisma.transactions.update({
          where: {
            orderId: Number(order_id),
          },
          data: {
            status: 'cancelled',
          },
        });
      } else if (transaction_status === 'expire') {
        await prisma.transactions.update({
          where: {
            orderId: Number(order_id),
          },
          data: {
            status: 'expired',
          },
        });
      } else if (transaction_status === 'deny') {
        await prisma.transactions.update({
          where: {
            orderId: Number(order_id),
          },
          data: {
            status: 'failed',
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
