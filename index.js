const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const apiRouter = require('./routers/apiRouter');
const DB = process.env.DB || require('./config').DB;
const PORT = 4000;

const app = express();

mongoose.connect(DB, () => {
  console.log('Database connection open.', DB);
});

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './routes.html'));
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log('App listening on port ' + PORT + ' (^._.^)ﾉ')
});
