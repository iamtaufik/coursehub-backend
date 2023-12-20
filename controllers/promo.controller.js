const prisma = require('../libs/prisma');
const { createPromoSchema, updatePromoSchema } = require('../validations/promo.validation');

const createPromo = async (req, res, next) => {
  try {
    const { code_promo, discount, expiresAt } = req.body;

    await createPromoSchema.validateAsync({ ...req.body });

    const newPromo = await prisma.promo.create({
      data: {
        code_promo,
        discount,
        expiresAt: new Date(expiresAt),
      },
    });

    const users = await prisma.users.findMany();

    const notificationId = Math.floor(Math.random() * 1000000000);

    const blastNotification = users.map((user) => {
      return {
        userId: user.id,
        notificationId,
        title: 'Promo',
        body: `Gunakan kode ${code_promo} berikut untuk mendapatkan diskon ${discount}%`,
        description: 'Syarat dan ketentuan berlaku',
      };
    });

    await prisma.$transaction([
      prisma.notification.createMany({
        data: blastNotification,
      }),
    ]);

    res.status(201).json({
      status: true,
      message: 'Created Promo Succesfully!',
      data: newPromo,
    });
  } catch (error) {
    next(error);
  }
};

const getPromo = async (req, res, next) => {
  try {
    const allPromo = await prisma.promo.findMany();

    if (allPromo.length === 0) {
      return res.status(400).json({
        status: false,
        message: 'Promo Data Not Found!',
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: 'Promo List Retrieved Successfully!',
      data: allPromo,
    });
  } catch (error) {
    next(error);
  }
};

const detailPromo = async (req, res, next) => {
  try {
    const promoId = parseInt(req.params.id, 10);

    const promo = await prisma.promo.findUnique({
      where: { id: promoId },
    });

    if (!promo) {
      return res.status(404).json({
        status: false,
        message: `Promo with Id ${promoId} does not exist!`,
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: 'Promo details retrieved successfully',
      data: promo,
    });
  } catch (error) {
    next(error);
  }
};

const updatePromo = async (req, res, next) => {
  try {
    const promoId = parseInt(req.params.id, 10);
    const { code_promo, discount, expiresAt } = req.body;

    await updatePromoSchema.validateAsync({ ...req.body });

    const existingPromo = await prisma.promo.findUnique({
      where: { id: promoId },
    });

    if (!existingPromo) {
      return res.status(404).json({
        status: false,
        message: `Promo with Id ${promoId} does not exist!`,
        data: null,
      });
    }

    const updatedPromo = await prisma.promo.update({
      where: { id: promoId },
      data: {
        code_promo,
        discount,
        expiresAt: new Date(expiresAt),
      },
    });

    res.status(200).json({
      status: true,
      message: 'Promo updated successfully',
      data: updatedPromo,
    });
  } catch (error) {
    next(error);
  }
};

const deletePromo = async (req, res, next) => {
  try {
    const promoId = parseInt(req.params.id, 10);

    const existingPromo = await prisma.promo.findUnique({
      where: { id: promoId },
    });

    if (!existingPromo) {
      return res.status(404).json({
        status: false,
        message: `Promo with Id ${promoId} does not exist!`,
        data: null,
      });
    }

    await prisma.promo.delete({
      where: { id: promoId },
    });

    res.status(200).json({
      status: true,
      message: 'Promo deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPromo,
  getPromo,
  detailPromo,
  updatePromo,
  deletePromo,
};
