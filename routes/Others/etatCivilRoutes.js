const etatCivileRouters = require('express').Router();
const { findAllElement } = require('../../controllers/Others/etatCivilController');
const verifToken = require('../../middlewares/verifyToken');

etatCivileRouters.use(verifToken);

etatCivileRouters.get('/etat-civiles', findAllElement)

module.exports = etatCivileRouters

