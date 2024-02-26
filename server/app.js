/* eslint-disable linebreak-style */
require('express-async-errors');
const express = require('express');
const logger = require('morgan');
const { errorHandler } = require('./middlewares/errorHandler');
const cors = require('cors'); // Import cors middleware

const app = express();
const port = process.env.PORT || 3000;
const { missionsRouter } = require('./routers/missionRouter');
const { soldierRouter } = require('./routers/soldierRouter');
// const { requestsRouter } = require('./routers/requestRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use('/missions', missionsRouter);
app.use('/soldier', soldierRouter);

app.use(errorHandler);

app.use((req, res) => {
  res.status(400).send("Couldn't connect");
});

// Set up CORS middleware
const allowedOrigins = ['http://localhost:5173']; // Update with your frontend URL
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));

app.post('/api/login', (req, res) => {
  const { login, password } = req.body;
  console.log('Received login:', login);
  console.log('Received password:', password);

  // No need to manually set CORS headers here

  // Respond to the request
  res.json({ message: 'Login received successfully' });
});

app.listen(port, () => console.log(`Express server is running on port ${port}`));

module.exports = app; // for testing