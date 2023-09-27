const logger = require('morgan');
const express = require('express');
const app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');
const authRouter = require('./routes/api/auth');
const eatenProductRouter = require('./routes/api/eatenProducts');
const doneExercisesRouter = require('./routes/api/doneExercises');
const diariesRouter = require('./routes/api/diaries');
const productsRouter = require('./routes/api/products');
const exercisesRouter = require('./routes/api/exercises');
const exerciseCategoriesRouter = require('./routes/api/exerciseCategories');
const statisticRoute = require('./routes/api/statistic');

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/users', authRouter);
app.use('/api/eaten-products', eatenProductRouter);
app.use('/api/done-exercises', doneExercisesRouter);
app.use('/api/diaries', diariesRouter);
app.use('/api/products', productsRouter);
app.use('/api/exercises', exercisesRouter);
app.use('/api/exercise-categories', exerciseCategoriesRouter);
app.use('/api/statistic', statisticRoute);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
