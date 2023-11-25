require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

var prisma;

if (process.env.NODE_ENV === 'production') {
  const { PrismaClient } = require('@prisma/client/edge');
  prisma = new PrismaClient();
  module.exports = prisma;
}

prisma = new PrismaClient();

module.exports = prisma;
