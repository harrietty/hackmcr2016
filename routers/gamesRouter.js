const Router = require('express').Router;
const gamesRouter = Router();
const _ = require('underscore');
const Game = require('../models/game');
const User = require('../models/user');
const generateOrders = require('../helpers/orders').generateOrders;
const generateBoard = require('../helpers/board');
const items = require('../items');

const basicBoard = [
  ['currentPlayer', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'otherPlayer'],
  ['empty', 'shelf', 'shelf', 'empty', 'shelf', 'shelf', 'empty', 'shelf', 'shelf', 'empty'],
  ['empty', 'shelf', 'shelf', 'empty', 'shelf', 'shelf', 'empty', 'shelf', 'shelf', 'empty'],
  ['empty', 'shelf', 'shelf', 'empty', 'shelf', 'shelf', 'empty', 'shelf', 'shelf', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
  ['empty', 'shelf', 'shelf', 'empty', 'shelf', 'shelf', 'empty', 'shelf', 'shelf', 'empty'],
  ['empty', 'shelf', 'shelf', 'empty', 'shelf', 'shelf', 'empty', 'shelf', 'shelf', 'empty'],
  ['empty', 'shelf', 'shelf', 'empty', 'shelf', 'shelf', 'empty', 'shelf', 'shelf', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'goal', 'goal', 'empty', 'empty', 'empty', 'empty'],
];

gamesRouter.get('/available', (req, res, next) => {
  Game.find({playerB: undefined}, (err, games) => {
    if (err) return next(err);
    res.status(200).json(games);
  });
});

gamesRouter.get('/:id', (req, res, next) => {
  const gameId = req.params.id;
  Game.findById(gameId, (err, game) => {
    if (err) return next(err);
    res.status(200).json(game);
  });
});

gamesRouter.post('/new', (req, res, next) => {
  // create new game and insert into db
  const playerA = req.body.player;
  const orders = generateOrders(3);
  const board = generateBoard(basicBoard, items);
  const game = {
    playerA,
    turn: 'playerA',
    orders: orders,
    score: 0,
    board: board
  };
  const newGame = new Game(game);

  newGame.save()
    .then(data => {
      // add game to the profile of the user
      const gameId = newGame._id;
      const player = newGame.playerA;
      return User.findOneAndUpdate({username: player}, {
        gameId
      });
    })
    .then(() => {
      res.status(201).json(newGame);
    })
    .catch(err => {
      return next(err);
    });
});

gamesRouter.post('/join', (req, res, next) => {
  const playerB = req.body.playerB;
  const gameId = req.body.gameId;
  let game = {};
  // Update the game object
  return Game.findById(gameId)
    .then((gameDoc) => {
      game = gameDoc;
      game.playerB = playerB;
      return game.save();
    })
    .then(() => {
      return User.findOneAndUpdate({username: playerB}, {gameId})
    })
    .then(() => {
      res.status(200).json(game);
    })
    .catch(err => {
      console.log(err.message);
      return next(err);
    });
});

gamesRouter.post('/update', (req, res, next) => {
  // update the game with the given id
  const gameId = req.body.gameId;
  const game = req.body.game;
  console.log(gameId, game);
  Game.findByIdAndUpdate(gameId, game, {new: true}, (err, data) => {
    if (err) return next(err);
    console.log('NEW DATA' ,data);
    res.status(200).json(data);
  });
});

gamesRouter.delete('/:id', (req, res, next) => {
  const gameId = req.params.id;
  let usernames;
  let players = {};
  return Game.findById(gameId)
    .then(game => {
      console.log('******1')
      usernames = {
        A: game.playerA,
        B: game.playerB
      };
      return User.findOne({username: usernames.A});
    })
    .then(playerA => {
      console.log('******2')
      players.A = playerA;
      return User.findOne({username: usernames.B});
    })
    .then(playerB => {
      console.log('******3')
      players.B = playerB;
      players.B.gameId = undefined;
      if (!_.findWhere(players.B.friends, {username: usernames.A})) {
        players.B.friends.push({
          name: players.A.name,
          username: players.A.username,
          interests: players.A.interests,
          age: players.A.age
        });
      }
      return players.B.save();
    })
    .then(() => {
      console.log('******4')
      players.A.gameId = undefined;
      if (!_.findWhere(players.A.friends, {username: usernames.B})) {
        players.A.friends.push({
          name: players.B.name,
          username: players.B.username,
          interests: players.B.interests,
          age: players.B.age
        });
      }
      return players.A.save();
    })
    .then(() => {
      console.log('******5')
      // delete the game
      return Game.findByIdAndRemove(gameId);
    })
    .then(() => {
      res.status(200).send('Successfully deleted');
    })
    .catch(err => {
      console.log(err.message);
      return next(err);
    });
});

module.exports = gamesRouter;
