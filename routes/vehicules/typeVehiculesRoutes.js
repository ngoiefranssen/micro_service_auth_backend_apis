const typeVehiculesRouters = require('express').Router();
const { 
    createdTypeVehicule,
    findAllElments,
    findOneElement,
    updatedTypeVihicule,
    deletedTypeVehicule
} = require('../../controllers/vehicule/typeVehiculeController');
const verifToken = require('../../middlewares/verifyToken');

typeVehiculesRouters.use(verifToken);

typeVehiculesRouters.get('/type-vehicules', findAllElments);
typeVehiculesRouters.get('/type-vehicules/:ID_TYPE_VEHICULE', findOneElement);
typeVehiculesRouters.post('/created/type-vehicules', createdTypeVehicule);
typeVehiculesRouters.put('/updated/type-vehicules/:ID_TYPE_VEHICULE', updatedTypeVihicule);
typeVehiculesRouters.post('/delete/type-vehicules', deletedTypeVehicule);

module.exports = typeVehiculesRouters
