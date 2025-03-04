const typeVersementRouters = require('express').Router();
const { findAllElements } = require('../../controllers/versements/typeVersementController');
const verifToken = require('../../middlewares/verifyToken');

typeVersementRouters.use(verifToken);

typeVersementRouters.get('/type-versements', findAllElements)

module.exports = typeVersementRouters

