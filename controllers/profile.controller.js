const path = require('path');
const imagekit = require('../libs/imagekit');
const prisma = require('../libs/prisma');
const { createProfileSchema } = require('../validations/profile.validation');

function toIndonesianPhoneNumber(phoneNumber) {
  let digitsOnly = phoneNumber.replace(/\D/g, '');

  if (digitsOnly.startsWith('0')) {
    return '+62' + digitsOnly.substring(1);
  }

  if (!digitsOnly.startsWith('62')) {
    return '+62' + digitsOnly;
  }

  return digitsOnly;
}

const updateProfile = async (req, res, next) => {
  const id = req.user.id;
  const { phone_number, first_name, last_name, city, country } = req.body;
  const file = req.file;
  try {
    await createProfileSchema.validateAsync({ ...req.body });

    let user = await prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        err: null,
        data: null,
      });
    }

    let profile = await prisma.profiles.findUnique({
      where: {
        id,
      },
    });

    let indonesianPhoneNumber = phone_number ? toIndonesianPhoneNumber(phone_number) : profile.phone_number;

    if (file) {
      let strFile = file.buffer.toString('base64');
      let { url } = await imagekit.upload({
        fileName: Date.now() + path.extname(file.originalname),
        file: strFile,
      });

      const updateProfileUser = await prisma.profiles.update({
        where: {
          users_id: id,
        },
        data: {
          phone_number: indonesianPhoneNumber,
          first_name,
          last_name,
          profile_picture: url,
          city,
          country,
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Successfully updated user profile',
        err: null,
        data: updateProfileUser,
      });
    }

    const updateProfileUser = await prisma.profiles.update({
      where: {
        users_id: id,
      },
      data: {
        phone_number: indonesianPhoneNumber,
        first_name,
        last_name,
        profile_picture: req.body.profile_picture,
        city,
        country,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Successfully updated user profile',
      err: null,
      data: updateProfileUser,
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  const { id } = req.user;
  try {
    let user = await prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        err: null,
        data: null,
      });
    }

    let profile = await prisma.profiles.findUnique({
      where: {
        users_id: id,
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
        err: null,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully get user profile',
      err: null,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  getProfile,
};
