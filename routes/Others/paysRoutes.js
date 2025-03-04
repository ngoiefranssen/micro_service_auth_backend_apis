const paysRouters = require('express').Router();

const { findAllElments, findOneElement, createdPays, updatedPays, deletedPays } = require('../../controllers/Others/paysController');
const verifToken = require('../../middlewares/verifyToken');

paysRouters.use(verifToken);

paysRouters.get('/pays', findAllElments);
paysRouters.get('/pays/:ID_PAYS', findOneElement);
paysRouters.post('/created/pays', createdPays);
paysRouters.put('/updated/pays/:ID_PAYS', updatedPays);
paysRouters.delete('/deleted/pays', deletedPays);

module.exports = paysRouters
