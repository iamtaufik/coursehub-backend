const prisma = require("../libs/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const otpHandler= require("../libs/otpHandler");
const nodemailer = require("../libs/nodemailer");

// login user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Bad Request",
        err: "User not found",
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
        err: "Wrong Password",
        data: null,
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      message: "Login success",
      err: null,
      data: {
        user: user,
        token: token,
      },
    });
  } catch (error) {
    next(error);
  }
};

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
    const token = jwt.sign({ user_id: users.id }, JWT_SECRET, { expiresIn: '1h' });
    
    const otp = await otpHandler.generateOTP(email);
    const html = `Your OTP for account activation is: <strong>${otp}</strong>`;
    await nodemailer.sendEmail(email, 'Account Activation OTP', html);


    return res.status(201).json({
      status: true,
      message: 'Created Successfully!',
      err: null,
      data: {
        users,
        token, // Menambahkan token ke respons
      }
    });
  } catch (err) {
    next(err);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { idAdmin, password } = req.body;
    const admin = await prisma.admin.findUnique({
      where: {
        idAdmin: idAdmin,
      },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Wrong id or Password',
        data: null,
      });
    }

    const payload = {
      id: admin.id,
      idAdmin: admin.idAdmin,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(200).json({
      success: true,
      message: 'Login success',
      data: token,
    });
  } catch (error) {
    next(error);
  }
};
  

const authenticate = (req, res, next) => {
  return res.status(200).json({
    status: true,
    message: "OK",
    err: null,
    data: { user: req.user },
  });
};

const verifyOTP = async (req, res) => {
  try {
      const token = req.headers.authorization;

      if (!token || !token.startsWith('Bearer ')) {
          return res.status(401).json({
              status: false,
              message: 'Token not found or invalid',
              err: null,
              data: null
          });
      }

      const tokenValue = token.split(' ')[1]; // Mengambil token setelah "Bearer "

      if (!tokenValue) {
          return res.status(401).json({
              status: false,
              message: 'Token not found or invalid',
              err: null,
              data: null
          });
      }

      const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

      if (!decoded.email) {
          return res.status(400).json({
              status: false,
              message: 'Bad request',
              err: 'Email not found in token',
              data: null
          });
      }

      const email = decoded.email;
      const { otp } = req.body;

      const user = await prisma.users.findUnique({ where: { email } });

      if (!user) {
          return res.status(404).json({
              status: false,
              message: 'User not found',
              err: null,
              data: null
          });
      }

      const storedOTP = await otpHandler.getOTPFromStorage(email);

      if (otp !== storedOTP) {
          return res.status(400).json({
              status: false,
              message: 'Bad request',
              err: 'Invalid or expired OTP',
              data: null
          });
      }

      // OTP yang sesuai, tandai verifikasi pengguna di sini jika perlu
      await prisma.users.update({
          where: { email },
          data: { is_verified: true, otp: null }
      });

      return res.json({
          status: true,
          message: 'Account activated successfully',
          err: null,
          data: null
      });
  } catch (err) {
      return res.status(500).json({
          status: false,
          message: 'Error activating account',
          err: err.message,
          data: null
      });
  }
};
module.exports = {
  loginUser,
  loginAdmin,
  register,
  verifyOTP
};
