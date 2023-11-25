require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const yaml = require('yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const { serverError, notFound } = require('./middlewares/errorHandling');
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const file = fs.readFileSync(path.join(__dirname, './docs.yaml'), 'utf8');
const swaggerDocument = yaml.parse(file);
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: ['https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js', 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'],
    customSiteTitle: 'CourseHub API Documentation 🚀',
  })
);
app.use('/api/v1', require('./routes/index.route'));
app.use(notFound);
app.use(serverError);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
