const genreRouters = require('express').Router();
const { findAllElements } = require('../../controllers/Others/genreController');
const verifToken = require('../../middlewares/verifyToken');

genreRouters.use(verifToken);

genreRouters.get('/genres', findAllElements)

module.exports = genreRouters

