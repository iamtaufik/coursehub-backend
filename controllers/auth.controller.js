const prisma = require("../libs/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpHandler = require("../libs/otpHandler");
const nodemailer = require("../libs/nodemailer");
const {
  registerUserSchema,
  createAdminSchema,
  loginAdminSchema,
  loginUserSchema,
  verifyOTPSchema,
} = require("../validations/auth.validation");

// login user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { value, error } = await loginUserSchema.validateAsync({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
        err: error.message,
        data: null,
      });
    }

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
        err: "Wrong Email or Password",
        data: null,
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
        err: "User not verified",
        data: null,
      });
    }

    const payload = {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    delete user.password;

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
    let { nickname, email, phone_number, password } = req.body;

    const { value, error } = await registerUserSchema.validateAsync({
      nickname,
      email,
      phone: phone_number,
      password,
    });

    if (error) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: error.message,
        data: null,
      });
    }

    let userExist = await prisma.users.findUnique({
      where: { email: email },
    });
    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: "Email already exists!",
        data: null,
      });
    }

    let encryptedPassword = await bcrypt.hash(password, 10);

    let users = await prisma.users.create({
      data: {
        nickname,
        email,
        password: encryptedPassword,
      },
    });

    const user_id = users.id;
    await prisma.profiles.create({
      data: {
        users_id: user_id,
        first_name: null,
        last_name: null,
        phone_number: phone_number,
        profile_picture: null,
        city: null,
        country: null,
      },
    });
    delete users.password;

    const otp = await otpHandler.generateOTP(email);
    const html = `Your OTP for account activation is: <strong>${otp}</strong>`;
    await nodemailer.sendEmail(email, "Account Activation OTP", html);

    return res.status(201).json({
      status: true,
      message: "Created Successfully!",
      err: null,
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { idAdmin, password } = req.body;

    const { value, error } = await loginAdminSchema.validateAsync({
      idAdmin,
      password,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
        err: error.message,
        data: null,
      });
    }

    const admin = await prisma.admin.findUnique({
      where: {
        idAdmin: idAdmin,
      },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Wrong id or Password",
        data: null,
      });
    }

    const payload = {
      id: admin.id,
      idAdmin: admin.idAdmin,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      message: "Login success",
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

const createAdmin = async (req, res, next) => {
  try {
    const { idAdmin, password } = req.body;

    const { value, error } = await createAdminSchema.validateAsync({
      idAdmin,
      password,
    });

    const admin = await prisma.admin.findUnique({
      where: {
        idAdmin: idAdmin,
      },
    });

    if (admin) {
      return res.status(404).json({
        success: false,
        message: "Admin already exists",
        data: null,
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        idAdmin,
        password: encryptedPassword,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Created Successfully!",
      data: newAdmin,
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const { value, error } = await verifyOTPSchema.validateAsync({
      email,
      otp,
    });

    if (error) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        err: error.message,
        data: null,
      });
    }

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        err: null,
        data: null,
      });
    }

    const storedOTP = await otpHandler.getOTPFromStorage(email);

    if (otp !== storedOTP) {
      return res.status(400).json({
        status: false,
        message: "Bad request",
        err: "Invalid OTP",
        data: null,
      });
    }

    // OTP yang sesuai, tandai verifikasi pengguna di sini jika perlu
    await prisma.users.update({
      where: { email },
      data: { isVerified: true, otp: null },
    });

    return res.json({
      status: true,
      message: "Account activated successfully",
      err: null,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        err: null,
        data: null,
      });
    }

    let token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);
    let url = `http://localhost:3000/api/v1/auth/reset-password?token=${token}`;

    let html = `<p>Hi ${user.nickname},</p>
      <p>You have requested to reset your password.</p>
      <p>Please click on the link below to reset your password:</p>
      <a href="${url}">${url}</a>`;
    await nodemailer.sendEmail(email, "Reset Password Request", html);

    return res.json({
      status: true,
      message: "Password reset link sent to email successfully",
      err: null,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  loginUser,
  loginAdmin,
  register,
  verifyOTP,
  authenticate,
  createAdmin,
  resetPassword,
};
