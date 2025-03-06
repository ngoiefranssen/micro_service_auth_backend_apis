const marquesRouters = require('express').Router();

const {
    findAllElementDatas,
    findOneElementData,
    createdMarques,
    updatedMarque,
    deletedMarque
} = require('../../controllers/vehicule/marqueController');
const verifToken = require('../../middlewares/verifyToken');

marquesRouters.use(verifToken);

marquesRouters.get('/vehicules-marques', findAllElementDatas);
marquesRouters.get('/vehicules-marques/:ID_MARQUE', findOneElementData);
marquesRouters.post('/created/vehicules-marques', createdMarques);
marquesRouters.put('/updated/vehicules-marques/:ID_MARQUE', updatedMarque);
marquesRouters.post('/delete/vehicules-marques', deletedMarque);

module.exports = marquesRouters
