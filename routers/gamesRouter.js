const Router = require('express').Router;
const gamesRouter = Router();
const Game = require('../models/game');
const User = require('../models/user');
const generateOrders = require('../helpers/orders').generateOrders;
const generateBoard = require('../helpers/board');
const items = require('../items');

const basicBoard = [
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
  ['empty', 'empty', 'shelf', 'shelf', 'empty', 'empty', 'shelf', 'shelf', 'empty', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
  ['empty', 'empty', 'shelf', 'shelf', 'empty', 'empty', 'shelf', 'shelf', 'empty', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
  ['empty', 'empty', 'shelf', 'shelf', 'empty', 'empty', 'shelf', 'shelf', 'empty', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
  ['empty', 'empty', 'shelf', 'shelf', 'empty', 'empty', 'shelf', 'shelf', 'empty', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
  ['empty', 'empty', 'shelf', 'shelf', 'empty', 'empty', 'shelf', 'shelf', 'empty', 'empty'],
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
  // Update the game object
  return Game.findByIdAndUpdate(gameId, {playerB})
    .then(() => {
      return User.findOneAndUpdate({username: playerB}, {gameId})
    })
    .then(() => {
      res.status(200).send('Game joined successfully');
    })
    .catch(err => {
      return next(err);
    });
});

gamesRouter.post('/update', (req, res, next) => {
  // update the game with the given id
  const gameId = req.body.gameId;
  const game = req.body.game;
  Game.findByIdAndUpdate(gameId, game, (err, data) => {
    if (err) return next(err);
    res.status(200).json(data);
  });
});

gamesRouter.delete('/:id', (req, res, next) => {
  const gameId = req.params.id;
  let players;
  return Game.findById(gameId)
    .then(game => {
      players = {
        playerA: game.playerA,
        playerB: game.playerB
      };
      return User.findOneAndUpdate({username: players.playerA}, {
        gameId: undefined
      });
    })
    .then(() => {
      return User.findOneAndUpdate({username: players.playerB}, {
        gameId: undefined
      });
    })
    .then(() => {
      // delete the game
      return Game.findByIdAndRemove(gameId);
    })
    .then(() => {
      res.status(200).send('Successfully deleted');
    })
    .catch(err => {
      return next(err);
    });
});

module.exports = gamesRouter;
