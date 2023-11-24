const prisma = require("../libs/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

// register
const register = async (req, res, next) => {
  try {
    let { nickname, email, password, password_confirmation } = req.body;

    if (password != password_confirmation) {
      return res.status(400).json({
        status: false,
        message: "Bad Requset",
        err: "Password & password confirmation do not match!",
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
        profile_picture: null,
        city: null,
        country: null,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Created Succesfuly!",
      err: null,
      data: { users },
    });
  } catch (err) {
    next(err);
  }
};

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

const authenticate = (req, res, next) => {
  return res.status(200).json({
    status: true,
    message: "OK",
    err: null,
    data: { user: req.user },
  });
};

module.exports = {
  loginAdmin,
  loginUser,
  register,
  authenticate,
};
