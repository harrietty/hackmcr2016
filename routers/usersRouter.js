const Router = require('express').Router;
const usersRouter = Router();

const User = require('../models/user');

usersRouter.get('/:username', (req, res, next) => {
  User.findOne({username: req.params.username}, {
    _id: 0,
    __v: 0
  }, (err, user) => {
    if (err) return next(err);
    res.status(200).send(user);
  });
});

usersRouter.put('/:username', (req, res, next) => {
  User.findOneAndUpdate({username: req.params.username}, req.body.user, {new: true}, (err, user) => {
    res.status(200).json(user);
  });
});

usersRouter.post('/:username', (req, res) => {
  const newUser = {
    username: req.params.username
  };
  const newUserDb = new User(newUser);
  newUserDb.save()
    .then(user => {
      res.status(201).json(newUser);
    })
    .catch(err => {
      if (err) return next(err);
    });
});

module.exports = usersRouter;
// 07860033815 <-- HOTPOT
