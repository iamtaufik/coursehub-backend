const generateOTP = require('otp-generator');
const prisma = require("../libs/prisma");

module.exports = {
    generateOTP: async (email) => {
        const otp = generateOTP.generate(6, { upperCase: false, specialChars: false, alphabets: false });

        // Menyimpan OTP dan tanggal kedaluwarsa ke database
        await prisma.users.update({
            where: { email },
            data: {
                otp,
                 }
        });

        return otp;
    },

    getOTPFromStorage: async (email) => {
        const user = await prisma.users.findUnique({ where: { email } });
        return user ? user.otp : null;
    },

    clearOTPFromStorage: async (email) => {
        await prisma.users.update({
            where: { email },
            data: { otp: null }
        });
    }
};
