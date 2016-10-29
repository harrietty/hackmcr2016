const Router = require('express').Router;
const apiRouter = Router();
const usersRouter = require('./usersRouter');
const gamesRouter = require('./gamesRouter');

apiRouter.get('/', (req, res) => {
  res.send('apiRouter working');
});

apiRouter.use('/users', usersRouter);
apiRouter.use('/games', gamesRouter);

apiRouter.use((err, req, res, next) => {
  if (err) res.status(500).send(err);
});

module.exports = apiRouter;
