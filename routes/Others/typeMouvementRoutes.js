const typeMouvementRouters = require('express').Router();
const { findAllElments } = require('../../controllers/mouvements/typeMouvementController');
const verifToken = require('../../middlewares/verifyToken');

typeMouvementRouters.use(verifToken);

typeMouvementRouters.get('/type-mouvements', findAllElments)

module.exports = typeMouvementRouters

