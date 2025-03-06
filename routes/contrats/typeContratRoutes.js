const typeContratRouters = require('express').Router();
const {
    findAllElements,
    findOnElement,
    createdTypeContrat,
    updatedTypeContrat,
    deletedTypeContrat
} = require('../../controllers/contrats/TypeContratController');
const verifToken = require('../../middlewares/verifyToken');

typeContratRouters.use(verifToken);

typeContratRouters.get('/type-contrats', findAllElements);
typeContratRouters.get('/type-contrats/:ID_TYPE_CONTRAT', findOnElement);
typeContratRouters.post('/created/type-contrats', createdTypeContrat);
typeContratRouters.put('/updated/type-contrats/:ID_TYPE_CONTRAT', updatedTypeContrat);
typeContratRouters.post('/delete/type-contrats', deletedTypeContrat);

module.exports = typeContratRouters
