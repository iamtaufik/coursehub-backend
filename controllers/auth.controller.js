const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// register
const register = async (req, res, next) => {
  try {
    let { nickname, email, password, password_confirmation } = req.body;

    if (password != password_confirmation) {
      return res.status(400).json({
        status: false,
        message: 'Bad Requset',
        err: 'Password & password confirmation do not match!',
        data: null
      });
    }

    let userExist = await prisma.users.findUnique({
      where: { email: email }
    });
    if (userExist) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        err: 'Email already exists!',
        data: null
      });
    }

    let encryptedPassword = await bcrypt.hash(password, 10);

    let users = await prisma.users.create({
      data: {
        nickname,
        email,
        password: encryptedPassword
      }
    });

    const user_id = users.id;
    await prisma.profiles.create({
      data: {
        users_id: user_id,
        first_name: null,
        last_name: null,
        profile_picture: null,
        city: null,
        country: null
      }
    });

    return res.status(201).json({
      status: true,
      message: 'Created Succesfuly!',
      err: null,
      data: { users }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register
}